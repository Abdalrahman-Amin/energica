import { create } from "zustand";
import { Category } from "@/types/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface CategoryState {
   categories: Category[];
   isLoading: boolean;
   error: string | null;
   fetchCategories: () => Promise<void>;
   deleteCategory: (id: number) => Promise<void>;
}

const useCategoryStore = create<CategoryState>((set) => ({
   categories: [],
   isLoading: true,
   error: null,
   fetchCategories: async () => {
      const supabase = createClientComponentClient();
      set({ isLoading: true, error: null });
      try {
         const { data, error } = await supabase.from("categories").select("*");
         if (error) throw error;
         set({ categories: data, isLoading: false });
      } catch (error) {
         console.error("Error fetching categories:", error);
         set({ error: "Failed to fetch categories. Please try again later.", isLoading: false });
      }
   },
   deleteCategory: async (id: number) => {
      const supabase = createClientComponentClient();
      try {
         const { error } = await supabase.from("categories").delete().eq("id", id);
         if (error) throw error;
         set((state) => ({
            categories: state.categories.filter((category) => category.id !== id),
         }));
      } catch (error) {
         console.error("Error deleting category:", error);
         set({ error: "Failed to delete category. Please try again later." });
      }
   },
}));

export default useCategoryStore;