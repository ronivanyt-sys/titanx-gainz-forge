import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const WhatsAppButton = () => (
  <a
    href={buildWhatsAppLink("Hola, quiero información sobre productos TitanX")}
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-accent flex items-center justify-center shadow-lg hover:bg-primary transition-colors animate-pulse-glow"
    aria-label="Contactar por WhatsApp"
  >
    <MessageCircle className="w-7 h-7 text-accent-foreground" />
  </a>
);

export default WhatsAppButton;
