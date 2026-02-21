import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "59112345678";

const WhatsAppButton = () => (
  <a
    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola, quiero información sobre productos TitanX")}`}
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-accent flex items-center justify-center shadow-lg hover:bg-primary transition-colors animate-pulse-glow"
    aria-label="Contactar por WhatsApp"
  >
    <MessageCircle className="w-7 h-7 text-accent-foreground" />
  </a>
);

export default WhatsAppButton;
