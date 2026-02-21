import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-fitness.jpg";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0">
      <img src={heroImg} alt="TitanX Fitness" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />
    </div>

    <div className="relative container mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="inline-block bg-primary/20 border border-primary/40 rounded-full px-4 py-1 mb-6"
        >
          <span className="text-primary text-sm font-medium">🔥 Suplementos Premium Bolivia</span>
        </motion.div>

        <h1 className="font-display text-6xl sm:text-7xl md:text-8xl text-foreground leading-none mb-4">
          Construye el cuerpo que{" "}
          <span className="text-gradient-red">impone respeto</span>
        </h1>

        <p className="text-lg text-muted-foreground mb-8 max-w-lg">
          Suplementos originales para fuerza, volumen y rendimiento máximo. Entrega rápida a toda Bolivia.
        </p>

        <div className="flex flex-wrap gap-4">
          <Button size="lg" className="glow-red gap-2 text-lg px-8 font-display tracking-wider" asChild>
            <a href={buildWhatsAppLink("Hola, quiero información sobre productos TitanX")} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-5 h-5" /> Comprar por WhatsApp
            </a>
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 font-display tracking-wider border-foreground/20" asChild>
            <a href="/productos">Ver Catálogo</a>
          </Button>
        </div>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
