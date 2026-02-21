import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2 } from "lucide-react";

const AdminSalesLog = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ product_id: "", quantity: 1, sale_price: 0, customer_name: "", notes: "" });

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("id, name, price, stock").order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: sales = [], isLoading } = useQuery({
    queryKey: ["sales-log"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sales_log")
        .select("*, products(name, image)")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
  });

  const addSale = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("sales_log").insert({
        product_id: form.product_id,
        quantity: form.quantity,
        sale_price: form.sale_price,
        customer_name: form.customer_name,
        notes: form.notes,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales-log"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Venta registrada", description: "El stock se actualizó automáticamente" });
      setShowForm(false);
      setForm({ product_id: "", quantity: 1, sale_price: 0, customer_name: "", notes: "" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteSale = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("sales_log").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales-log"] });
      toast({ title: "Registro eliminado" });
    },
  });

  const selectedProduct = products.find((p: any) => p.id === form.product_id);

  const handleProductSelect = (id: string) => {
    const p = products.find((pr: any) => pr.id === id);
    setForm(prev => ({ ...prev, product_id: id, sale_price: p?.price ?? 0 }));
  };

  const totalSales = sales.reduce((sum: number, s: any) => sum + Number(s.sale_price) * s.quantity, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl">Registro de Ventas</h2>
          <p className="text-sm text-muted-foreground">Total vendido: <span className="text-primary font-bold">Bs {totalSales.toFixed(0)}</span></p>
        </div>
        <Button className="glow-red gap-2 font-display" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4" /> Registrar Venta
        </Button>
      </div>

      {showForm && (
        <div className="bg-muted/30 border border-border rounded-lg p-4 space-y-3">
          <select
            value={form.product_id}
            onChange={e => handleProductSelect(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
          >
            <option value="">Seleccionar producto</option>
            {products.map((p: any) => (
              <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>
            ))}
          </select>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Cantidad</label>
              <Input type="number" min={1} max={selectedProduct?.stock ?? 999} value={form.quantity} onChange={e => setForm(prev => ({ ...prev, quantity: Number(e.target.value) }))} className="bg-background border-border" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Precio venta (Bs)</label>
              <Input type="number" value={form.sale_price} onChange={e => setForm(prev => ({ ...prev, sale_price: Number(e.target.value) }))} className="bg-background border-border" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Cliente</label>
              <Input value={form.customer_name} onChange={e => setForm(prev => ({ ...prev, customer_name: e.target.value }))} className="bg-background border-border" placeholder="Opcional" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Notas</label>
              <Input value={form.notes} onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))} className="bg-background border-border" placeholder="Opcional" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => addSale.mutate()} disabled={!form.product_id || form.quantity < 1 || addSale.isPending} className="gap-2">
              {addSale.isPending && <Loader2 className="w-4 h-4 animate-spin" />} Guardar
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
                  <th className="text-left p-3 font-medium">Producto</th>
                  <th className="text-right p-3 font-medium">Cant.</th>
                  <th className="text-right p-3 font-medium">Precio</th>
                  <th className="text-right p-3 font-medium">Total</th>
                  <th className="text-left p-3 font-medium">Cliente</th>
                  <th className="text-left p-3 font-medium">Fecha</th>
                  <th className="text-right p-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {sales.map((s: any) => (
                  <tr key={s.id} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="p-3">{s.products?.name ?? "—"}</td>
                    <td className="p-3 text-right">{s.quantity}</td>
                    <td className="p-3 text-right">Bs {s.sale_price}</td>
                    <td className="p-3 text-right font-medium">Bs {(s.sale_price * s.quantity).toFixed(0)}</td>
                    <td className="p-3 text-muted-foreground">{s.customer_name || "—"}</td>
                    <td className="p-3 text-muted-foreground">{new Date(s.created_at).toLocaleDateString("es-BO")}</td>
                    <td className="p-3 text-right">
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteSale.mutate(s.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {sales.length === 0 && (
                  <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No hay ventas registradas</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSalesLog;
