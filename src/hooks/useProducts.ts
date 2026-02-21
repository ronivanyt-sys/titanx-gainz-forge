import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";

// Maps DB row (snake_case) to frontend Product type (camelCase)
function mapDbProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    price: Number(row.price),
    discountPrice: row.discount_price ? Number(row.discount_price) : undefined,
    category: row.category,
    benefit: "",
    shortBenefit: row.short_benefit ?? "",
    description: row.description ?? "",
    benefits: row.benefits ?? [],
    ingredients: row.ingredients ?? "",
    usage: row.usage_instructions ?? "",
    image: row.image ?? "",
    rating: Number(row.rating),
    reviewCount: Number(row.review_count),
    reviews: [],
    stock: Number(row.stock),
    featured: row.featured ?? false,
    countdown: row.countdown_active
      ? {
          active: true,
          discountPercent: Number(row.countdown_discount_percent),
          endDate: row.countdown_end_date ?? "",
        }
      : undefined,
  };
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapDbProduct);
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["product-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("category");
      if (error) throw error;
      const unique = [...new Set((data ?? []).map((r) => r.category))].filter(Boolean);
      return unique.sort();
    },
  });
}
