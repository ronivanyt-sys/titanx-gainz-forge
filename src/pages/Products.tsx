import { useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import { products } from "@/data/products";

const Products = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [benefit, setBenefit] = useState("");

  const filtered = products.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (category && p.category !== category) return false;
    if (benefit && p.benefit !== benefit) return false;
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
            benefit={benefit} onBenefitChange={setBenefit}
          />
        </div>

        {filtered.length === 0 ? (
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
