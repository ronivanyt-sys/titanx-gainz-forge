export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  category: string;
  benefit: string;
  shortBenefit: string;
  description: string;
  benefits: string[];
  ingredients: string;
  usage: string;
  image: string;
  rating: number;
  reviewCount: number;
  reviews: Review[];
  stock: number;
  featured: boolean;
  countdown?: {
    active: boolean;
    endDate: string;
    discountPercent: number;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}
