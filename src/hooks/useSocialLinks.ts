import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  display_order: number;
  active: boolean;
}

export const useSocialLinks = () => {
  return useQuery({
    queryKey: ["social-links"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("social_links" as any)
        .select("*")
        .eq("active", true)
        .order("display_order");
      if (error) throw error;
      return (data as any[]) as SocialLink[];
    },
  });
};
