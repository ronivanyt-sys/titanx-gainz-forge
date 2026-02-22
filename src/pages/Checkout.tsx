import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MessageCircle, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";
import { WHATSAPP_NUMBER, cartWhatsAppMessage } from "@/lib/whatsapp";
import { supabase } from "@/integrations/supabase/client";

const cities = ["Santa Cruz", "La Paz", "Cochabamba", "Sucre", "Oruro", "Potosí", "Tarija", "Trinidad", "Cobija"];
const payments = ["Transferencia bancaria", "QR", "Coordinación por WhatsApp"];

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", city: "", address: "", payment: "" });
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount_percent: number; id: string } | null>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

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

  const discount = appliedCoupon ? Math.round(subtotal * appliedCoupon.discount_percent / 100) : 0;
  const total = subtotal - discount;

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", couponCode.toUpperCase().trim())
      .eq("active", true)
      .maybeSingle();

    if (error || !data) {
      toast({ title: "Cupón inválido", description: "El código no existe o no está activo", variant: "destructive" });
    } else if (data.min_amount && subtotal < Number(data.min_amount)) {
      toast({ title: "Monto insuficiente", description: `El mínimo para este cupón es Bs ${data.min_amount}`, variant: "destructive" });
    } else if (data.uses_remaining !== null && data.uses_remaining <= 0) {
      toast({ title: "Cupón agotado", variant: "destructive" });
    } else {
      setAppliedCoupon({ code: data.code, discount_percent: data.discount_percent, id: data.id });
      toast({ title: `¡Cupón aplicado! -${data.discount_percent}%` });
    }
    setApplyingCoupon(false);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.city || !form.address || !form.payment) {
      toast({ title: "Error", description: "Por favor completa todos los campos", variant: "destructive" });
      return;
    }

    // Decrement coupon uses server-side via secure RPC with amount validation
    if (appliedCoupon) {
      const { data: success } = await supabase.rpc("use_coupon", { _coupon_id: appliedCoupon.id, _order_amount: subtotal });
      if (!success) {
        toast({ title: "Error con el cupón", description: "El cupón ya no es válido", variant: "destructive" });
        return;
      }
    }

    const productDetails = cartWhatsAppMessage(items, subtotal);
    const couponLine = appliedCoupon ? `\nCupón: ${appliedCoupon.code} (-${appliedCoupon.discount_percent}% = -Bs ${discount})` : "";
    const msg = `${productDetails}${couponLine}\n\n💰 Total: Bs ${total}\n\nNombre: ${form.name}\nDirección: ${form.address}\nCelular: ${form.phone}\nCiudad: ${form.city}\nPago: ${form.payment}`;
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
            <div className="bg-gradient-card border border-border rounded-lg p-6 sticky top-24 space-y-4">
              <h3 className="font-display text-xl">Resumen del Pedido</h3>
              <div className="space-y-3">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{product.name} x{quantity}</span>
                    <span>Bs {(product.discountPrice ?? product.price) * quantity}</span>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="border-t border-border pt-3">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-primary/10 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Tag className="w-4 h-4 text-primary" />
                      <span className="font-mono font-bold text-primary">{appliedCoupon.code}</span>
                      <span className="text-muted-foreground">-{appliedCoupon.discount_percent}%</span>
                    </div>
                    <button onClick={removeCoupon}><X className="w-4 h-4 text-muted-foreground hover:text-foreground" /></button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input placeholder="Código de cupón" value={couponCode} onChange={e => setCouponCode(e.target.value)} className="bg-background border-border text-sm" onKeyDown={e => e.key === "Enter" && (e.preventDefault(), applyCoupon())} />
                    <Button type="button" variant="outline" size="sm" onClick={applyCoupon} disabled={applyingCoupon}>Aplicar</Button>
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-3 space-y-1">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>Bs {subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-primary">
                    <span>Descuento</span>
                    <span>-Bs {discount}</span>
                  </div>
                )}
                <div className="flex justify-between font-display text-xl pt-2">
                  <span>Total</span>
                  <span className="text-primary">Bs {total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
