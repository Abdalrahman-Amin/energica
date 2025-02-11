import { create } from "zustand";
import { Category, Model } from "@/types/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface CategoryState {
   categories: Category[];
   models: { [key: number]: Model[] }; // Models keyed by category ID
   isLoading: boolean;
   error: string | null;
   fetchCategories: () => Promise<void>;
   fetchModelsForCategory: (categoryId: number) => Promise<void>;
   deleteCategory: (id: number) => Promise<void>;
}

const useCategoryStore = create<CategoryState>((set) => ({
   categories: [],
   models: {},
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
         set({
            error: "Failed to fetch categories. Please try again later.",
            isLoading: false,
         });
      }
   },
   fetchModelsForCategory: async (categoryId: number) => {
      const supabase = createClientComponentClient();
      set({ isLoading: true, error: null });
      try {
         const { data, error } = await supabase
            .from("category_models")
            .select("model_id")
            .eq("category_id", categoryId);
         if (error) throw error;

         const modelIds = data.map((item) => item.model_id);
         const { data: modelsData, error: modelsError } = await supabase
            .from("models")
            .select("*")
            .in("id", modelIds);
         if (modelsError) throw modelsError;

         set((state) => ({
            models: { ...state.models, [categoryId]: modelsData },
            isLoading: false,
         }));
      } catch (error) {
         console.error("Error fetching models:", error);
         set({
            error: "Failed to fetch models. Please try again later.",
            isLoading: false,
         });
      }
   },
   deleteCategory: async (id: number) => {
      const supabase = createClientComponentClient();
      try {
         const { error } = await supabase
            .from("categories")
            .delete()
            .eq("id", id);
         if (error) throw error;
         set((state) => ({
            categories: state.categories.filter(
               (category) => category.id !== id
            ),
         }));
      } catch (error) {
         console.error("Error deleting category:", error);
         set({ error: "Failed to delete category. Please try again later." });
      }
   },
}));

export default useCategoryStore;
