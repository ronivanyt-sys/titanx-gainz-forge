import { motion } from "framer-motion";
import { Shield, Truck, HeadphonesIcon, BadgeDollarSign } from "lucide-react";

const benefits = [
  { icon: Shield, title: "Productos Originales", desc: "100% auténticos, importados directamente de fábrica" },
  { icon: Truck, title: "Entrega Rápida", desc: "Envío a toda Bolivia en 24-72 horas" },
  { icon: HeadphonesIcon, title: "Asesoramiento Personalizado", desc: "Te guiamos para elegir el suplemento ideal" },
  { icon: BadgeDollarSign, title: "Precios Competitivos", desc: "Los mejores precios del mercado boliviano" },
];

const BenefitsSection = () => (
  <section className="py-20 bg-gradient-dark">
    <div className="container mx-auto px-4">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-display text-4xl md:text-5xl text-center mb-12"
      >
        ¿Por qué <span className="text-gradient-red">TitanX</span>?
      </motion.h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {benefits.map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-gradient-card border border-border rounded-lg p-6 text-center hover:border-primary/40 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <b.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-display text-xl mb-2">{b.title}</h3>
            <p className="text-sm text-muted-foreground">{b.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default BenefitsSection;
