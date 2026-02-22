import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Save, X, GripVertical } from "lucide-react";

const PLATFORMS = ["Facebook", "Instagram", "TikTok", "Twitter", "YouTube", "LinkedIn", "Otro"];
const ICONS = ["facebook", "instagram", "tiktok", "twitter", "youtube", "linkedin", "other"];

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  display_order: number;
  active: boolean;
}

const AdminSocialLinks = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ platform: "", url: "", icon: "facebook" });
  const [showAdd, setShowAdd] = useState(false);

  const { data: links = [], isLoading } = useQuery({
    queryKey: ["admin-social-links"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("social_links" as any)
        .select("*")
        .order("display_order");
      if (error) throw error;
      return (data as any[]) as SocialLink[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (link: { platform: string; url: string; icon: string }) => {
      const { error } = await supabase.from("social_links" as any).insert({
        platform: link.platform,
        url: link.url,
        icon: link.icon,
        display_order: links.length + 1,
      } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-social-links"] });
      queryClient.invalidateQueries({ queryKey: ["social-links"] });
      setShowAdd(false);
      setForm({ platform: "", url: "", icon: "facebook" });
      toast({ title: "Red social agregada" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<SocialLink> & { id: string }) => {
      const { error } = await supabase.from("social_links" as any).update(updates as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-social-links"] });
      queryClient.invalidateQueries({ queryKey: ["social-links"] });
      setEditing(null);
      toast({ title: "Red social actualizada" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("social_links" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-social-links"] });
      queryClient.invalidateQueries({ queryKey: ["social-links"] });
      toast({ title: "Red social eliminada" });
    },
  });

  const toggleActive = (link: SocialLink) => {
    updateMutation.mutate({ id: link.id, active: !link.active });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl">Redes Sociales</h2>
        <Button size="sm" className="gap-2" onClick={() => setShowAdd(true)}>
          <Plus className="w-4 h-4" /> Agregar
        </Button>
      </div>

      {showAdd && (
        <div className="bg-card border border-border rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select value={form.platform} onValueChange={(v) => {
              const idx = PLATFORMS.indexOf(v);
              setForm({ ...form, platform: v, icon: ICONS[idx] || "other" });
            }}>
              <SelectTrigger><SelectValue placeholder="Plataforma" /></SelectTrigger>
              <SelectContent>
                {PLATFORMS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input placeholder="URL (https://...)" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} className="col-span-1 sm:col-span-2" />
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => addMutation.mutate(form)} disabled={!form.platform || !form.url}>
              <Save className="w-4 h-4 mr-1" /> Guardar
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowAdd(false)}>
              <X className="w-4 h-4 mr-1" /> Cancelar
            </Button>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-lg divide-y divide-border">
        {links.map((link) => (
          <div key={link.id} className="flex items-center gap-3 p-3">
            <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            {editing === link.id ? (
              <EditRow link={link} onSave={(updates) => updateMutation.mutate({ id: link.id, ...updates })} onCancel={() => setEditing(null)} />
            ) : (
              <>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{link.platform}</p>
                  <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => toggleActive(link)} className={link.active ? "text-green-500" : "text-muted-foreground"}>
                  {link.active ? "Activo" : "Inactivo"}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setEditing(link.id)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteMutation.mutate(link.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        ))}
        {links.length === 0 && !isLoading && (
          <p className="p-6 text-center text-muted-foreground text-sm">No hay redes sociales configuradas</p>
        )}
      </div>
    </div>
  );
};

const EditRow = ({ link, onSave, onCancel }: { link: SocialLink; onSave: (u: Partial<SocialLink>) => void; onCancel: () => void }) => {
  const [url, setUrl] = useState(link.url);
  const [platform, setPlatform] = useState(link.platform);

  return (
    <div className="flex-1 flex flex-col sm:flex-row gap-2">
      <Select value={platform} onValueChange={setPlatform}>
        <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
        <SelectContent>
          {PLATFORMS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
        </SelectContent>
      </Select>
      <Input value={url} onChange={e => setUrl(e.target.value)} className="flex-1" />
      <div className="flex gap-1">
        <Button size="sm" onClick={() => onSave({ platform, url, icon: ICONS[PLATFORMS.indexOf(platform)] || "other" })}>
          <Save className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default AdminSocialLinks;
