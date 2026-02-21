import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Star, Loader2 } from "lucide-react";

interface Props {
  productId: string;
}

const ProductReviews = ({ productId }: Props) => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ author_name: "", rating: 5, comment: "" });

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const addReview = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("reviews").insert({
        product_id: productId,
        author_name: form.author_name.trim() || "Anónimo",
        rating: form.rating,
        comment: form.comment.trim(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      toast({ title: "¡Gracias por tu reseña!" });
      setShowForm(false);
      setForm({ author_name: "", rating: 5, comment: "" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const avgRating = reviews.length ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length).toFixed(1) : "—";

  return (
    <section className="border-t border-border pt-10 mt-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-3xl">Reseñas</h2>
          <p className="text-sm text-muted-foreground">{reviews.length} reseñas · Promedio: {avgRating} ⭐</p>
        </div>
        <Button variant="outline" onClick={() => setShowForm(!showForm)}>Escribir Reseña</Button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-lg p-4 mb-6 space-y-3">
          <Input placeholder="Tu nombre (opcional)" value={form.author_name} onChange={e => setForm(prev => ({ ...prev, author_name: e.target.value }))} className="bg-background border-border" />
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Calificación:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => setForm(prev => ({ ...prev, rating: n }))}>
                  <Star className={`w-5 h-5 ${n <= form.rating ? "fill-primary text-primary" : "text-muted"}`} />
                </button>
              ))}
            </div>
          </div>
          <Textarea placeholder="Tu comentario..." value={form.comment} onChange={e => setForm(prev => ({ ...prev, comment: e.target.value }))} className="bg-background border-border" />
          <div className="flex gap-2">
            <Button onClick={() => addReview.mutate()} disabled={!form.comment.trim() || addReview.isPending}>
              {addReview.isPending && <Loader2 className="w-4 h-4 animate-spin mr-1" />} Enviar
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-6"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : reviews.length === 0 ? (
        <p className="text-muted-foreground text-center py-6">Sé el primero en dejar una reseña</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r: any) => (
            <div key={r.id} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{r.author_name}</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(n => (
                      <Star key={n} className={`w-3 h-3 ${n <= r.rating ? "fill-primary text-primary" : "text-muted"}`} />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString("es-BO")}</span>
              </div>
              <p className="text-sm text-foreground/80">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductReviews;
