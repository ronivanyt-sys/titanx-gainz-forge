import { Link } from "react-router-dom";
import { useCategories } from "@/hooks/useProducts";
import SocialIcons from "@/components/SocialIcons";

const Footer = () => {
  const { data: categories = [] } = useCategories();

  return (
    <footer className="border-t border-border bg-card/50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-display text-3xl text-primary tracking-widest mb-3">TITANX</h3>
            <p className="text-sm text-muted-foreground">Suplementos premium para atletas que buscan resultados reales.</p>
          </div>
          <div>
            <h4 className="font-display text-lg mb-3">Navegación</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Inicio</Link>
              <Link to="/productos" className="text-sm text-muted-foreground hover:text-primary transition-colors">Productos</Link>
              <Link to="/nosotros" className="text-sm text-muted-foreground hover:text-primary transition-colors">Nosotros</Link>
              <Link to="/contacto" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contacto</Link>
            </div>
          </div>
          <div>
            <h4 className="font-display text-lg mb-3">Categorías</h4>
            <div className="flex flex-col gap-2">
              {categories.map(c => (
                <Link key={c} to={`/productos?cat=${encodeURIComponent(c)}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {c}
                </Link>
              ))}
              {categories.length === 0 && (
                <span className="text-sm text-muted-foreground">Cargando...</span>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-display text-lg mb-3">Contacto</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <span>📍 Calle Genesis #24, Ciudad de Potosí, Bolivia</span>
              <span>📱 +591 60452794</span>
              <span>✉️ contacto@titanxbolivia.shop</span>
            </div>
            <SocialIcons className="mt-3" />
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} TitanX. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
