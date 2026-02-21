import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { X, Loader2, Upload } from "lucide-react";

interface Props {
  product?: any;
  onClose: () => void;
  onSaved: () => void;
}

const categories = ["Proteína", "Creatina", "Pre-entreno", "Quemadores"];

const AdminProductForm = ({ product, onClose, onSaved }: Props) => {
  const isEdit = !!product;
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    description: product?.description ?? "",
    short_benefit: product?.short_benefit ?? "",
    category: product?.category ?? "Proteína",
    price: product?.price ?? 0,
    discount_price: product?.discount_price ?? "",
    image: product?.image ?? "",
    stock: product?.stock ?? 0,
    rating: product?.rating ?? 5,
    review_count: product?.review_count ?? 0,
    benefits: product?.benefits?.join("\n") ?? "",
    ingredients: product?.ingredients ?? "",
    usage_instructions: product?.usage_instructions ?? "",
    featured: product?.featured ?? false,
    countdown_active: product?.countdown_active ?? false,
    countdown_discount_percent: product?.countdown_discount_percent ?? 0,
    countdown_end_date: product?.countdown_end_date ? product.countdown_end_date.slice(0, 16) : "",
  });

  const set = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const autoSlug = (name: string) => {
    set("name", name);
    if (!isEdit) {
      set("slug", name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) {
      toast({ title: "Error subiendo imagen", description: error.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from("product-images").getPublicUrl(path);
    set("image", publicUrl);
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.slug) {
      toast({ title: "Error", description: "Nombre y slug son requeridos", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      short_benefit: form.short_benefit,
      category: form.category,
      price: Number(form.price),
      discount_price: form.discount_price ? Number(form.discount_price) : null,
      image: form.image,
      stock: Number(form.stock),
      rating: Number(form.rating),
      review_count: Number(form.review_count),
      benefits: form.benefits.split("\n").filter(Boolean),
      ingredients: form.ingredients,
      usage_instructions: form.usage_instructions,
      featured: form.featured,
      countdown_active: form.countdown_active,
      countdown_discount_percent: Number(form.countdown_discount_percent),
      countdown_end_date: form.countdown_end_date ? new Date(form.countdown_end_date).toISOString() : null,
    };

    let error;
    if (isEdit) {
      ({ error } = await supabase.from("products").update(payload).eq("id", product.id));
    } else {
      ({ error } = await supabase.from("products").insert(payload));
    }

    setSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: isEdit ? "Producto actualizado" : "Producto creado" });
      onSaved();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </button>
        <h2 className="font-display text-2xl mb-6">{isEdit ? "Editar" : "Nuevo"} Producto</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Nombre</label>
              <Input value={form.name} onChange={e => autoSlug(e.target.value)} className="bg-background border-border" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Slug</label>
              <Input value={form.slug} onChange={e => set("slug", e.target.value)} className="bg-background border-border" />
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Beneficio corto</label>
            <Input value={form.short_benefit} onChange={e => set("short_benefit", e.target.value)} className="bg-background border-border" />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Descripción</label>
            <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Categoría</label>
              <select value={form.category} onChange={e => set("category", e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Precio (Bs)</label>
              <Input type="number" value={form.price} onChange={e => set("price", e.target.value)} className="bg-background border-border" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Precio Desc.</label>
              <Input type="number" value={form.discount_price} onChange={e => set("discount_price", e.target.value)} className="bg-background border-border" placeholder="Opcional" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Stock</label>
              <Input type="number" value={form.stock} onChange={e => set("stock", e.target.value)} className="bg-background border-border" />
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Imagen</label>
            <div className="flex gap-3 items-center">
              <Input value={form.image} onChange={e => set("image", e.target.value)} className="bg-background border-border flex-1" placeholder="URL de imagen" />
              <label className="cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                <Button type="button" variant="outline" size="sm" className="gap-1" asChild>
                  <span>{uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Subir</span>
                </Button>
              </label>
            </div>
            {form.image && <img src={form.image} alt="" className="w-20 h-20 object-cover rounded mt-2" />}
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Beneficios (uno por línea)</label>
            <textarea value={form.benefits} onChange={e => set("benefits", e.target.value)} rows={3} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Ingredientes</label>
              <textarea value={form.ingredients} onChange={e => set("ingredients", e.target.value)} rows={2} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Modo de Uso</label>
              <textarea value={form.usage_instructions} onChange={e => set("usage_instructions", e.target.value)} rows={2} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={e => set("featured", e.target.checked)} className="accent-primary" />
              <span className="text-sm">Destacado</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.countdown_active} onChange={e => set("countdown_active", e.target.checked)} className="accent-primary" />
              <span className="text-sm">Countdown activo</span>
            </label>
          </div>

          {form.countdown_active && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Descuento %</label>
                <Input type="number" value={form.countdown_discount_percent} onChange={e => set("countdown_discount_percent", e.target.value)} className="bg-background border-border" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Fecha fin</label>
                <Input type="datetime-local" value={form.countdown_end_date} onChange={e => set("countdown_end_date", e.target.value)} className="bg-background border-border" />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 glow-red font-display tracking-wider" disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {isEdit ? "Guardar Cambios" : "Crear Producto"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductForm;
