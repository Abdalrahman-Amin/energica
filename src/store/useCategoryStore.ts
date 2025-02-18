import { create } from "zustand";
import { Category, Model, Product } from "@/types/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface CategoryState {
   categories: Category[];
   models: { [key: number]: Model[] }; // Models keyed by category ID
   products: Product[];
   searchResults: {
      categories: Category[];
      models: Model[];
      products: Product[];
   };
   isLoading: boolean;
   error: string | null;
   fetchCategories: () => Promise<void>;
   fetchModelsForCategory: (categoryId: number) => Promise<void>;
   fetchSearchResults: (query: string) => Promise<void>;
   deleteCategory: (id: number) => Promise<void>;
}

const useCategoryStore = create<CategoryState>((set) => ({
   categories: [],
   models: {},
   products: [],
   searchResults: { categories: [], models: [], products: [] },
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

   fetchSearchResults: async (query: string) => {
      const supabase = createClientComponentClient();
      set({ isLoading: true, error: null });

      try {
         // Split the query into individual words (to match separately)
         const queryParts = query.split(" ");

         // Build OR conditions dynamically for each word
         const titleConditions = queryParts
            .map((part) => `title.ilike.%${part}%`)
            .join(",");
         const unitConditions = queryParts
            .map((part) => `rating_unit.ilike.%${part}%`)
            .join(",");

         // Extract numeric part separately for `rating_value`
         const numericQuery = queryParts.find((part) => !isNaN(Number(part)));

         let productsQuery = supabase
            .from("products")
            .select("*")
            .or(`${titleConditions},${unitConditions}`);

         // If a numeric value is found, add an explicit filter for rating_value
         if (numericQuery) {
            productsQuery = productsQuery.or(`rating_value.eq.${numericQuery}`);
         }

         const [
            { data: categoriesData, error: categoriesError },
            { data: modelsData, error: modelsError },
            { data: productsData, error: productsError },
         ] = await Promise.all([
            supabase
               .from("categories")
               .select("*")
               .ilike("title", `%${query}%`),
            supabase.from("models").select("*").ilike("title", `%${query}%`),
            productsQuery,
         ]);

         if (categoriesError) throw categoriesError;
         if (modelsError) throw modelsError;
         if (productsError) throw productsError;

         set({
            searchResults: {
               categories: categoriesData,
               models: modelsData,
               products: productsData,
            },
            isLoading: false,
         });
      } catch (error) {
         console.error("Error fetching search results:", error);
         set({
            error: "Failed to fetch search results. Please try again later.",
            isLoading: false,
         });
      }
   },

   // fetchSearchResults: async (query: string) => {
   //    const supabase = createClientComponentClient();
   //    set({ isLoading: true, error: null });
   //    try {
   //       const [
   //          { data: categoriesData, error: categoriesError },
   //          { data: modelsData, error: modelsError },
   //          { data: productsData, error: productsError },
   //       ] = await Promise.all([
   //          supabase
   //             .from("categories")
   //             .select("*")
   //             .ilike("title", `%${query}%`),
   //          supabase.from("models").select("*").ilike("title", `%${query}%`),
   //          supabase.from("products").select("*").ilike("title", `%${query}%`),
   //       ]);

   //       if (categoriesError) throw categoriesError;
   //       if (modelsError) throw modelsError;
   //       if (productsError) throw productsError;

   //       set({
   //          searchResults: {
   //             categories: categoriesData,
   //             models: modelsData,
   //             products: productsData,
   //          },
   //          isLoading: false,
   //       });
   //    } catch (error) {
   //       console.error("Error fetching search results:", error);
   //       set({
   //          error: "Failed to fetch search results. Please try again later.",
   //          isLoading: false,
   //       });
   //    }
   // },
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
