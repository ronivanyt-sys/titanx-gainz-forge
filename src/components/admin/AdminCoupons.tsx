import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2 } from "lucide-react";

const AdminCoupons = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: "", discount_percent: 10, min_amount: 0, uses_remaining: "" });

  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ["coupons"],
    queryFn: async () => {
      const { data, error } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const addCoupon = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("coupons").insert({
        code: form.code.toUpperCase().trim(),
        discount_percent: form.discount_percent,
        min_amount: form.min_amount,
        uses_remaining: form.uses_remaining ? Number(form.uses_remaining) : null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      toast({ title: "Cupón creado" });
      setShowForm(false);
      setForm({ code: "", discount_percent: 10, min_amount: 0, uses_remaining: "" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase.from("coupons").update({ active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["coupons"] }),
  });

  const deleteCoupon = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("coupons").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      toast({ title: "Cupón eliminado" });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl">Cupones de Descuento</h2>
        <Button className="glow-red gap-2 font-display" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4" /> Nuevo Cupón
        </Button>
      </div>

      {showForm && (
        <div className="bg-muted/30 border border-border rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Código</label>
              <Input value={form.code} onChange={e => setForm(prev => ({ ...prev, code: e.target.value }))} className="bg-background border-border uppercase" placeholder="TITAN10" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Descuento %</label>
              <Input type="number" min={1} max={100} value={form.discount_percent} onChange={e => setForm(prev => ({ ...prev, discount_percent: Number(e.target.value) }))} className="bg-background border-border" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Monto mínimo (Bs)</label>
              <Input type="number" value={form.min_amount} onChange={e => setForm(prev => ({ ...prev, min_amount: Number(e.target.value) }))} className="bg-background border-border" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Usos (vacío = ilimitado)</label>
              <Input type="number" value={form.uses_remaining} onChange={e => setForm(prev => ({ ...prev, uses_remaining: e.target.value }))} className="bg-background border-border" placeholder="∞" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => addCoupon.mutate()} disabled={!form.code.trim() || addCoupon.isPending}>
              {addCoupon.isPending && <Loader2 className="w-4 h-4 animate-spin mr-1" />} Crear
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-3 font-medium">Código</th>
                  <th className="text-right p-3 font-medium">Descuento</th>
                  <th className="text-right p-3 font-medium">Mín.</th>
                  <th className="text-right p-3 font-medium">Usos rest.</th>
                  <th className="text-center p-3 font-medium">Estado</th>
                  <th className="text-right p-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c: any) => (
                  <tr key={c.id} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="p-3 font-mono font-bold">{c.code}</td>
                    <td className="p-3 text-right">{c.discount_percent}%</td>
                    <td className="p-3 text-right">Bs {c.min_amount}</td>
                    <td className="p-3 text-right">{c.uses_remaining ?? "∞"}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => toggleActive.mutate({ id: c.id, active: !c.active })}
                        className={`text-xs px-2 py-0.5 rounded-full ${c.active ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"}`}
                      >
                        {c.active ? "Activo" : "Inactivo"}
                      </button>
                    </td>
                    <td className="p-3 text-right">
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteCoupon.mutate(c.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {coupons.length === 0 && (
                  <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No hay cupones</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
