export interface Category {
   id: number;
   title: string;
   slug: string;
   image: string;
}
export interface Category_Models {
   id: number;
   created_at: string;
   category_id: number;
   model_id: number;
}
export interface Model {
   id: number;
   created_at: string;
   slug: string;
   title: string;
   description: string;
   image: string;
   pdf_url: string;
}

export interface Product {
   id: number;
   created_at: string;
   title: string;
   image: string;
   description: string;
   price: number;
   currency: string;
   category: number;
   model: number;
}
