import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  { name: "Carlos Mendoza", text: "Desde que uso TitanX mis ganancias musculares se dispararon. La calidad es top.", rating: 5, city: "Santa Cruz" },
  { name: "Ana Gutiérrez", text: "Excelente servicio y productos originales. La entrega fue súper rápida.", rating: 5, city: "La Paz" },
  { name: "Diego Rojas", text: "El pre-entreno Fury es una bestia. Energía increíble sin crash.", rating: 5, city: "Cochabamba" },
];

const TestimonialsSection = () => (
  <section className="py-20">
    <div className="container mx-auto px-4">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-display text-4xl md:text-5xl text-center mb-12"
      >
        Lo que dicen nuestros <span className="text-gradient-red">Titanes</span>
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="bg-gradient-card border border-border rounded-lg p-6 relative"
          >
            <Quote className="w-8 h-8 text-primary/20 absolute top-4 right-4" />
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: t.rating }).map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-primary text-primary" />
              ))}
            </div>
            <p className="text-foreground/80 mb-4 italic">"{t.text}"</p>
            <div>
              <p className="font-medium text-foreground">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.city}, Bolivia</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
