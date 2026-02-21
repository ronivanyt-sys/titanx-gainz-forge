import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";
import { WHATSAPP_NUMBER, cartWhatsAppMessage } from "@/lib/whatsapp";
const cities = ["Santa Cruz", "La Paz", "Cochabamba", "Sucre", "Oruro", "Potosí", "Tarija", "Trinidad", "Cobija"];
const payments = ["Transferencia bancaria", "QR", "Coordinación por WhatsApp"];

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", city: "", address: "", payment: "" });

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl mb-4">Tu carrito está vacío</h1>
          <Button asChild><Link to="/productos">Ver Productos</Link></Button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.city || !form.address || !form.payment) {
      toast({ title: "Error", description: "Por favor completa todos los campos", variant: "destructive" });
      return;
    }
    const productDetails = cartWhatsAppMessage(items, subtotal);
    const msg = `${productDetails}\n\nNombre: ${form.name}\nDirección: ${form.address}\nCelular: ${form.phone}\nCiudad: ${form.city}\nPago: ${form.payment}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
    clearCart();
    toast({ title: "¡Pedido enviado!", description: "Tu pedido fue enviado por WhatsApp." });
    navigate("/");
  };

  const set = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/productos" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" /> Seguir comprando
        </Link>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-5xl mb-8">
          <span className="text-gradient-red">Checkout</span>
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-4">
            <Input placeholder="Nombre completo" value={form.name} onChange={e => set("name", e.target.value)} className="bg-card border-border" />
            <Input placeholder="Teléfono" value={form.phone} onChange={e => set("phone", e.target.value)} className="bg-card border-border" />
            <select value={form.city} onChange={e => set("city", e.target.value)} className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground">
              <option value="">Selecciona tu ciudad</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <Input placeholder="Dirección de entrega" value={form.address} onChange={e => set("address", e.target.value)} className="bg-card border-border" />
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Método de pago:</p>
              {payments.map(p => (
                <label key={p} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${form.payment === p ? "border-primary bg-primary/5" : "border-border bg-card"}`}>
                  <input type="radio" name="payment" value={p} checked={form.payment === p} onChange={() => set("payment", p)} className="accent-primary" />
                  <span className="text-sm">{p}</span>
                </label>
              ))}
            </div>
            <Button type="submit" size="lg" className="w-full glow-red gap-2 font-display tracking-wider">
              <MessageCircle className="w-5 h-5" /> Confirmar Pedido por WhatsApp
            </Button>
          </form>

          <div className="lg:col-span-2">
            <div className="bg-gradient-card border border-border rounded-lg p-6 sticky top-24">
              <h3 className="font-display text-xl mb-4">Resumen del Pedido</h3>
              <div className="space-y-3">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{product.name} x{quantity}</span>
                    <span>Bs {(product.discountPrice ?? product.price) * quantity}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border mt-4 pt-4 flex justify-between font-display text-xl">
                <span>Total</span>
                <span className="text-primary">Bs {subtotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
