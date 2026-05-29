export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
}

export type CartState = Record<string, number>;

export interface Depoimento {
  name: string;
  site: string;
  body: string;
}
