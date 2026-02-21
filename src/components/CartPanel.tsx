import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

const CartPanel = () => {
  const { items, removeItem, updateQuantity, subtotal, isCartOpen, setCartOpen } = useCart();

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="bg-card border-border flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl text-foreground flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" /> Tu Carrito
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Tu carrito está vacío</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-4 py-4">
              {items.map(({ product, quantity }) => {
                const price = product.discountPrice ?? product.price;
                return (
                  <div key={product.id} className="flex gap-3 bg-secondary/50 rounded-lg p-3">
                    <img src={product.image} alt={product.name} className="w-16 h-16 rounded object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.name}</p>
                      <p className="text-sm text-primary font-display">Bs {price}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <button onClick={() => updateQuantity(product.id, quantity - 1)} className="w-6 h-6 rounded bg-muted flex items-center justify-center hover:bg-primary/20 transition-colors">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm w-6 text-center">{quantity}</span>
                        <button onClick={() => updateQuantity(product.id, quantity + 1)} className="w-6 h-6 rounded bg-muted flex items-center justify-center hover:bg-primary/20 transition-colors">
                          <Plus className="w-3 h-3" />
                        </button>
                        <button onClick={() => removeItem(product.id)} className="ml-auto text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex justify-between text-lg">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-display text-primary">Bs {subtotal}</span>
              </div>
              <Button className="w-full glow-red" asChild onClick={() => setCartOpen(false)}>
                <Link to="/checkout">Ir al Checkout</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartPanel;
