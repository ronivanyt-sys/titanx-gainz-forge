import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Loader2, Pencil, Trash2, Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AdminCategories = () => {
  const queryClient = useQueryClient();
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [deleteCategory, setDeleteCategory] = useState<string | null>(null);
  const [reassignTo, setReassignTo] = useState("");

  const { data: categoriesWithCount = [], isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("category");
      if (error) throw error;
      const counts: Record<string, number> = {};
      (data ?? []).forEach((r) => {
        counts[r.category] = (counts[r.category] || 0) + 1;
      });
      return Object.entries(counts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => a.name.localeCompare(b.name));
    },
  });

  const renameMutation = useMutation({
    mutationFn: async ({ oldName, newName }: { oldName: string; newName: string }) => {
      const { error } = await supabase
        .from("products")
        .update({ category: newName })
        .eq("category", oldName);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product-categories"] });
      toast({ title: "Categoría renombrada" });
      setEditingCategory(null);
      setNewName("");
    },
    onError: () => toast({ title: "Error al renombrar", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ category, reassignTo }: { category: string; reassignTo: string }) => {
      const { error } = await supabase
        .from("products")
        .update({ category: reassignTo })
        .eq("category", category);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product-categories"] });
      toast({ title: "Categoría eliminada y productos reasignados" });
      setDeleteCategory(null);
      setReassignTo("");
    },
    onError: () => toast({ title: "Error al eliminar", variant: "destructive" }),
  });

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const otherCategories = categoriesWithCount.filter(c => c.name !== deleteCategory);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Administra las categorías de tus productos. Puedes renombrar o eliminar categorías (los productos se reasignarán).</p>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left p-3 font-medium">Categoría</th>
              <th className="text-right p-3 font-medium">Productos</th>
              <th className="text-right p-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categoriesWithCount.map(cat => (
              <tr key={cat.name} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="p-3">
                  {editingCategory === cat.name ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        className="h-8 bg-background border-border max-w-[200px]"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={!newName.trim() || renameMutation.isPending}
                        onClick={() => renameMutation.mutate({ oldName: cat.name, newName: newName.trim() })}
                      >
                        <Check className="w-4 h-4 text-green-500" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => { setEditingCategory(null); setNewName(""); }}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <span className="font-medium">{cat.name}</span>
                  )}
                </td>
                <td className="p-3 text-right text-muted-foreground">{cat.count}</td>
                <td className="p-3 text-right">
                  <div className="flex gap-1 justify-end">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => { setEditingCategory(cat.name); setNewName(cat.name); }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    {categoriesWithCount.length > 1 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => { setDeleteCategory(cat.name); setReassignTo(""); }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteCategory} onOpenChange={open => { if (!open) setDeleteCategory(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar categoría "{deleteCategory}"</DialogTitle>
            <DialogDescription>
              Los productos de esta categoría se moverán a la categoría que elijas.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">Mover productos a:</label>
            <Select value={reassignTo} onValueChange={setReassignTo}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona categoría" />
              </SelectTrigger>
              <SelectContent>
                {otherCategories.map(c => (
                  <SelectItem key={c.name} value={c.name}>{c.name} ({c.count} productos)</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteCategory(null)}>Cancelar</Button>
            <Button
              variant="destructive"
              disabled={!reassignTo || deleteMutation.isPending}
              onClick={() => deleteCategory && deleteMutation.mutate({ category: deleteCategory, reassignTo })}
            >
              {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Eliminar y reasignar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategories;
