import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import { useProducts, useCategories } from "@/hooks/useProducts";

const Products = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();

  const filtered = products.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (category && p.category !== category) return false;
    return true;
  });

  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-5xl md:text-6xl mb-8"
        >
          Nuestros <span className="text-gradient-red">Productos</span>
        </motion.h1>

        <div className="mb-8">
          <ProductFilters
            search={search} onSearchChange={setSearch}
            category={category} onCategoryChange={setCategory}
            categories={categories}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">No se encontraron productos</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
