export const WHATSAPP_NUMBER = "59160454245";

export const buildWhatsAppLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const productWhatsAppMessage = (product: { name: string; slug: string; price: number; discountPrice?: number }) => {
  const finalPrice = product.discountPrice ?? product.price;
  return `Hola, me interesa este producto:\n\nNombre: ${product.name}\nPrecio: Bs ${finalPrice}\n\n¿Está disponible?`;
};

export const cartWhatsAppMessage = (items: { product: { name: string; slug: string; price: number; discountPrice?: number }; quantity: number }[], subtotal: number) => {
  const lines = items.map(i => {
    const price = (i.product.discountPrice ?? i.product.price) * i.quantity;
    return `Nombre: ${i.product.name}\nCantidad: ${i.quantity}\nPrecio: Bs ${price}`;
  }).join("\n\n");
  return `🛒 *Pedido TitanX*\n\n${lines}\n\nTotal: Bs ${subtotal}`;
};
