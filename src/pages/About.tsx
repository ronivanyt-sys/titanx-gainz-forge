import { motion } from "framer-motion";
import { Target, Eye, Heart, Dumbbell } from "lucide-react";

const values = [
  { icon: Target, title: "Misión", text: "Proveer suplementos de la más alta calidad a atletas bolivianos, impulsando su rendimiento y bienestar físico." },
  { icon: Eye, title: "Visión", text: "Ser la marca líder de suplementos deportivos en Bolivia, reconocida por calidad, innovación y servicio excepcional." },
  { icon: Heart, title: "Valores", text: "Calidad sin compromiso, honestidad, compromiso con nuestros clientes y pasión por el fitness." },
  { icon: Dumbbell, title: "Estilo de Vida", text: "TitanX no es solo suplementos. Es una comunidad de personas que buscan ser la mejor versión de sí mismos." },
];

const About = () => (
  <div className="min-h-screen py-10">
    <div className="container mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="font-display text-5xl md:text-6xl mb-4">
          Somos <span className="text-gradient-red">TitanX</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Nacimos con una misión clara: llevar suplementos deportivos de calidad mundial a todos los rincones de Bolivia.
          Creemos que cada persona que entra al gimnasio merece acceso a productos originales y efectivos.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {values.map((v, i) => (
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-gradient-card border border-border rounded-lg p-8"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <v.icon className="w-6 h-6 text-primary" />
            </div>
            <h2 className="font-display text-2xl mb-3">{v.title}</h2>
            <p className="text-muted-foreground">{v.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

export default About;
