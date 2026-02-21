import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, MessageCircle, Star, Minus, Plus, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import CountdownTimer from "@/components/CountdownTimer";
import ProductCard from "@/components/ProductCard";
import ProductReviews from "@/components/ProductReviews";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/hooks/useProducts";
import { buildWhatsAppLink, productWhatsAppMessage } from "@/lib/whatsapp";
import { useSEO } from "@/hooks/useSEO";

const ProductDetail = () => {
  const { slug } = useParams();
  const { data: products = [], isLoading } = useProducts();
  const product = products.find(p => p.slug === slug);
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  useSEO({
    title: product?.name ?? "Producto",
    description: product?.description?.slice(0, 155),
    image: product?.image,
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl mb-4">Producto no encontrado</h1>
          <Button asChild><Link to="/productos">Volver a Productos</Link></Button>
        </div>
      </div>
    );
  }

  const hasDiscount = product.discountPrice || product.countdown?.active;
  const finalPrice = product.discountPrice ?? (product.countdown?.active ? Math.round(product.price * (1 - product.countdown.discountPercent / 100)) : product.price);
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const whatsappLink = buildWhatsAppLink(productWhatsAppMessage(product) + `\n\n📊 Cantidad: ${qty}`);

  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto px-4">
        <Link to="/productos" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Volver a productos
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative rounded-lg overflow-hidden bg-card aspect-square">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            {hasDiscount && (
              <div className="absolute top-4 left-4 bg-primary text-primary-foreground font-bold px-3 py-1 rounded text-sm">
                -{product.countdown?.discountPercent || Math.round((1 - (product.discountPrice! / product.price)) * 100)}% OFF
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <span className="text-xs text-primary uppercase tracking-wider">{product.category}</span>
              <h1 className="font-display text-4xl md:text-5xl mt-1">{product.name}</h1>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted"}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{product.rating} ({product.reviewCount} reseñas)</span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="font-display text-5xl text-primary">Bs {finalPrice}</span>
              {hasDiscount && <span className="text-xl text-muted-foreground line-through">Bs {product.price}</span>}
            </div>

            {product.countdown?.active && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <p className="text-sm text-primary mb-2 font-medium">🔥 Oferta termina en:</p>
                <CountdownTimer endDate={product.countdown.endDate} />
              </div>
            )}

            <p className="text-foreground/80">{product.description}</p>

            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400">{product.stock > 10 ? "En stock" : `Solo ${product.stock} unidades`}</span>
                </>
              ) : (
                <span className="text-sm text-destructive">Agotado</span>
              )}
            </div>

            {product.stock > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Cantidad:</span>
                  <div className="flex items-center border border-border rounded-lg">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 hover:bg-muted transition-colors"><Minus className="w-4 h-4" /></button>
                    <span className="px-4 py-2 font-medium min-w-[40px] text-center">{qty}</span>
                    <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-3 py-2 hover:bg-muted transition-colors"><Plus className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button size="lg" className="flex-1 glow-red gap-2 font-display tracking-wider" onClick={() => addItem(product, qty)}>
                    <ShoppingCart className="w-5 h-5" /> Agregar al Carrito
                  </Button>
                  <Button size="lg" variant="outline" className="gap-2" asChild>
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="w-5 h-5" /> WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
            )}

            {product.benefits.length > 0 && (
              <div className="border-t border-border pt-6">
                <h3 className="font-display text-xl mb-3">Beneficios</h3>
                <ul className="space-y-2">
                  {product.benefits.map(b => (
                    <li key={b} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" /> {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border pt-6">
              {product.ingredients && (
                <div>
                  <h3 className="font-display text-xl mb-2">Ingredientes</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{product.ingredients}</p>
                </div>
              )}
              {product.usage && (
                <div>
                  <h3 className="font-display text-xl mb-2">Modo de Uso</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{product.usage}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Reviews */}
        <ProductReviews productId={product.id} />

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-3xl mb-6">Productos Relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
