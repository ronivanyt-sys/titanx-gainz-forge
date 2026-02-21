import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import BenefitsSection from "@/components/BenefitsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import { useProducts } from "@/hooks/useProducts";
import { useSEO } from "@/hooks/useSEO";

const Index = () => {
  const { data: products = [], isLoading } = useProducts();
  const featured = products.filter((p) => p.featured);

  useSEO({
    title: "Suplementos Deportivos Premium en Bolivia",
    description: "TitanX Bolivia - Los mejores suplementos deportivos: proteínas, creatina, pre-workout y más. Envíos a todo Bolivia.",
  });

  return (
    <div>
      <HeroSection />

      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <h2 className="font-display text-4xl md:text-5xl">
                Productos <span className="text-gradient-red">Destacados</span>
              </h2>
              <p className="text-muted-foreground mt-2">Los mejores suplementos de Bolivia solo para ti</p>
            </div>
            <Button variant="ghost" className="hidden sm:flex gap-1 text-primary" asChild>
              <Link to="/productos">
                Ver todos <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : featured.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No hay productos destacados aún</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          <div className="sm:hidden mt-6 text-center">
            <Button variant="outline" className="gap-1" asChild>
              <Link to="/productos">
                Ver todos los productos <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <BenefitsSection />
      <TestimonialsSection />
    </div>
  );
};

export default Index;
