import { Facebook, Instagram, Twitter, Youtube, Linkedin, Globe } from "lucide-react";
import { useSocialLinks, SocialLink } from "@/hooks/useSocialLinks";

const iconMap: Record<string, React.ComponentType<any>> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
  tiktok: Globe,
  other: Globe,
};

const SocialIcons = ({ className = "" }: { className?: string }) => {
  const { data: links = [] } = useSocialLinks();

  if (links.length === 0) return null;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {links.map((link) => {
        const Icon = iconMap[link.icon] || Globe;
        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-muted/50 hover:bg-primary/20 hover:text-primary flex items-center justify-center transition-colors"
            aria-label={link.platform}
          >
            <Icon className="w-4 h-4" />
          </a>
        );
      })}
    </div>
  );
};

export default SocialIcons;
