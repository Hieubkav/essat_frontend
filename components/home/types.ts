export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  isNew?: boolean;
}

export interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  author: string;
}

export interface Partner {
  id: number;
  name: string;
  logo: string;
}
