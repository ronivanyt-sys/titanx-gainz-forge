import { Link } from "react-router-dom";
import { ShoppingCart, Star, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import CountdownTimer from "./CountdownTimer";
import { Button } from "@/components/ui/button";
import { buildWhatsAppLink, productWhatsAppMessage } from "@/lib/whatsapp";

const StockBadge = ({ stock }: { stock: number }) => {
  if (stock === 0) return <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/20 text-destructive">Agotado</span>;
  if (stock <= 10) return <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent-foreground">Pocas unidades</span>;
  return <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">En stock</span>;
};

const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCart();
  const whatsappLink = buildWhatsAppLink(productWhatsAppMessage(product));
  const hasDiscount = product.discountPrice || product.countdown?.active;
  const finalPrice = product.discountPrice ?? (product.countdown?.active ? Math.round(product.price * (1 - product.countdown.discountPercent / 100)) : product.price);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group bg-gradient-card border border-border rounded-lg overflow-hidden flex flex-col"
    >
      <Link to={`/producto/${product.slug}`} className="relative aspect-square overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
            -{product.countdown?.discountPercent || Math.round((1 - (product.discountPrice! / product.price)) * 100)}%
          </div>
        )}
        <div className="absolute top-2 right-2"><StockBadge stock={product.stock} /></div>
      </Link>

      <div className="flex flex-col flex-1 p-4 gap-2">
        <Link to={`/producto/${product.slug}`} className="font-display text-xl text-foreground hover:text-primary transition-colors leading-tight">
          {product.name}
        </Link>
        <p className="text-xs text-muted-foreground">{product.shortBenefit}</p>

        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted"}`} />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({product.reviewCount})</span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="font-display text-2xl text-primary">Bs {finalPrice}</span>
          {hasDiscount && <span className="text-sm text-muted-foreground line-through">Bs {product.price}</span>}
        </div>

        {product.countdown?.active && <CountdownTimer endDate={product.countdown.endDate} compact />}

        <div className="flex gap-2 mt-auto pt-2">
          <Button size="sm" className="flex-1 gap-1" onClick={() => product.stock > 0 && addItem(product)} disabled={product.stock === 0}>
            <ShoppingCart className="w-3.5 h-3.5" /> Agregar
          </Button>
          <Button size="sm" variant="outline" className="gap-1" asChild>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-3.5 h-3.5" />
            </a>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
