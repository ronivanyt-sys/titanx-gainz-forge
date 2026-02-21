import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { categories, benefitFilters } from "@/data/products";

interface ProductFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  category: string;
  onCategoryChange: (v: string) => void;
  benefit: string;
  onBenefitChange: (v: string) => void;
}

const ProductFilters = ({ search, onSearchChange, category, onCategoryChange, benefit, onBenefitChange }: ProductFiltersProps) => (
  <div className="space-y-4">
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        placeholder="Buscar producto..."
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        className="pl-10 bg-card border-border"
      />
    </div>
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onCategoryChange("")}
        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${!category ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
      >
        Todos
      </button>
      {categories.map(c => (
        <button
          key={c}
          onClick={() => onCategoryChange(category === c ? "" : c)}
          className={`px-3 py-1.5 rounded-full text-sm transition-colors ${category === c ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
        >
          {c}
        </button>
      ))}
    </div>
    <div className="flex flex-wrap gap-2">
      {benefitFilters.map(b => (
        <button
          key={b.value}
          onClick={() => onBenefitChange(benefit === b.value ? "" : b.value)}
          className={`px-3 py-1.5 rounded-full text-xs transition-colors ${benefit === b.value ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
        >
          {b.label}
        </button>
      ))}
    </div>
  </div>
);

export default ProductFilters;
