export const WHATSAPP_NUMBER = "59160454245";
export const SITE_URL = "https://id-preview--a2d9b1cc-09d6-4a04-9da4-098469a4bac9.lovable.app";

export const buildWhatsAppLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const productWhatsAppMessage = (product: { name: string; slug: string; price: number; discountPrice?: number }) => {
  const finalPrice = product.discountPrice ?? product.price;
  return `Hola, me interesa este producto:\n\n📦 *${product.name}*\n💰 Precio: Bs ${finalPrice}\n🔗 ${SITE_URL}/producto/${product.slug}\n\n¿Está disponible?`;
};

export const cartWhatsAppMessage = (items: { product: { name: string; slug: string; price: number; discountPrice?: number }; quantity: number }[], subtotal: number) => {
  const lines = items.map(i => {
    const price = (i.product.discountPrice ?? i.product.price) * i.quantity;
    return `• *${i.product.name}* x${i.quantity} - Bs ${price}\n  🔗 ${SITE_URL}/producto/${i.product.slug}`;
  }).join("\n\n");
  return `🛒 *Pedido TitanX*\n\n${lines}\n\n💰 *Total: Bs ${subtotal}*`;
};
