import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Loader2, LogOut, Plus, Pencil, Trash2, Package, AlertTriangle, Tag, BarChart3 } from "lucide-react";
import AdminProductForm from "@/components/admin/AdminProductForm";

const AdminDashboard = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const queryClient = useQueryClient();
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product-categories"] });
      toast({ title: "Producto eliminado" });
    },
  });

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }
  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />;

  const filtered = products.filter((p: any) => p.name.toLowerCase().includes(search.toLowerCase()));
  const totalProducts = products.length;
  const lowStock = products.filter((p: any) => p.stock > 0 && p.stock <= 10).length;
  const outOfStock = products.filter((p: any) => p.stock === 0).length;
  const activePromos = products.filter((p: any) => p.countdown_active || p.discount_price).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="font-display text-2xl"><span className="text-gradient-red">TitanX</span> Admin</h1>
          <Button variant="outline" size="sm" onClick={signOut} className="gap-2">
            <LogOut className="w-4 h-4" /> Salir
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Productos", value: totalProducts, icon: Package, color: "text-primary" },
            { label: "Stock Bajo", value: lowStock, icon: AlertTriangle, color: "text-yellow-500" },
            { label: "Agotados", value: outOfStock, icon: Package, color: "text-destructive" },
            { label: "Promociones", value: activePromos, icon: Tag, color: "text-green-500" },
          ].map(s => (
            <div key={s.label} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <s.icon className={`w-5 h-5 ${s.color}`} />
                <span className="text-sm text-muted-foreground">{s.label}</span>
              </div>
              <p className="font-display text-3xl">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Input
            placeholder="Buscar producto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-card border-border flex-1"
          />
          <Button className="glow-red gap-2 font-display" onClick={() => { setEditingProduct(null); setShowForm(true); }}>
            <Plus className="w-4 h-4" /> Nuevo Producto
          </Button>
        </div>

        {/* Product Form Modal */}
        {showForm && (
          <AdminProductForm
            product={editingProduct}
            onClose={() => { setShowForm(false); setEditingProduct(null); }}
            onSaved={() => {
              setShowForm(false);
              setEditingProduct(null);
              queryClient.invalidateQueries({ queryKey: ["products"] });
              queryClient.invalidateQueries({ queryKey: ["product-categories"] });
            }}
          />
        )}

        {/* Products table */}
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left p-3 font-medium">Producto</th>
                    <th className="text-left p-3 font-medium">Categoría</th>
                    <th className="text-right p-3 font-medium">Precio</th>
                    <th className="text-right p-3 font-medium">Stock</th>
                    <th className="text-center p-3 font-medium">Promo</th>
                    <th className="text-right p-3 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p: any) => (
                    <tr key={p.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          {p.image && <img src={p.image} alt="" className="w-10 h-10 rounded object-cover" />}
                          <div>
                            <p className="font-medium">{p.name}</p>
                            <p className="text-xs text-muted-foreground">{p.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground">{p.category}</td>
                      <td className="p-3 text-right">
                        <span>Bs {p.price}</span>
                        {p.discount_price && <span className="text-primary text-xs ml-1">(Bs {p.discount_price})</span>}
                      </td>
                      <td className="p-3 text-right">
                        <span className={p.stock === 0 ? "text-destructive" : p.stock <= 10 ? "text-yellow-500" : ""}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        {(p.countdown_active || p.discount_price) ? (
                          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Activa</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex gap-1 justify-end">
                          <Button size="sm" variant="ghost" onClick={() => { setEditingProduct(p); setShowForm(true); }}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => deleteMutation.mutate(p.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No hay productos</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
