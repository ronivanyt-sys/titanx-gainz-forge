import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast({ title: "Error", description: "Por favor completa todos los campos", variant: "destructive" });
      return;
    }
    toast({ title: "¡Mensaje enviado!", description: "Te responderemos lo antes posible." });
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto px-4">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-5xl md:text-6xl text-center mb-4">
          <span className="text-gradient-red">Contáctanos</span>
        </motion.h1>
        <p className="text-center text-muted-foreground mb-12 max-w-md mx-auto">¿Tienes dudas? Escríbenos y te asesoramos con el mejor suplemento para ti.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
          <motion.form initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleSubmit} className="space-y-4">
            <Input placeholder="Tu nombre" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-card border-border" />
            <Input type="email" placeholder="Tu email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="bg-card border-border" />
            <Textarea placeholder="Tu mensaje" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="bg-card border-border min-h-[120px]" />
            <Button type="submit" className="w-full glow-red font-display tracking-wider">Enviar Mensaje</Button>
          </motion.form>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="bg-gradient-card border border-border rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm">Calle Genesis #24, Ciudad de Potosí, Bolivia</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm">+591 60452794</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm">contacto@titanxbolivia.shop</span>
              </div>
            </div>

            <Button size="lg" className="w-full gap-2 font-display tracking-wider" style={{ backgroundColor: "#25D366" }} asChild>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5" /> Escribir por WhatsApp
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
