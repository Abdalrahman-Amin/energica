"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Loader from "@/components/Loader";
import { Model } from "@/types/types";

interface ModelsResultsProps {
   toggleAddedModel: boolean;
   onEditModel: (model: Model) => void;
}
const ModelsResults: React.FC<ModelsResultsProps> = ({
   toggleAddedModel,
   onEditModel,
}) => {
   const [models, setModels] = useState<Model[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const supabase = createClientComponentClient();

   useEffect(() => {
      const fetchModels = async () => {
         try {
            const { data, error } = await supabase.from("models").select("*");
            if (error) throw error;
            setModels(data);
         } catch (error) {
            console.error("Error fetching models:", error);
            setError("Failed to fetch models. Please try again later.");
         } finally {
            setIsLoading(false);
         }
      };

      fetchModels();
   }, [supabase, toggleAddedModel]);

   const handleDelete = async (id: number) => {
      const confirmDelete = confirm(
         "Are you sure you want to delete this model?"
      );
      if (!confirmDelete) return;

      try {
         const { error } = await supabase.from("models").delete().eq("id", id);
         if (error) throw error;
         setModels(models.filter((model) => model.id !== id));
      } catch (error) {
         console.error("Error deleting model:", error);
         setError("Failed to delete model. Please try again later.");
      }
   };

   if (isLoading) return <Loader />;

   if (error) {
      return (
         <div className="flex justify-center items-center h-screen">
            <p className="text-red-500 text-lg">{error}</p>
         </div>
      );
   }

   return (
      <div className="container mx-auto px-4 py-6 bg-gray-900 min-h-screen w-full max-w-4xl">
         <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 text-center">
            Models
         </h1>
         <div className="bg-gray-50 shadow-lg rounded-xl overflow-hidden">
            {/* Scrollable container for smaller screens */}
            <div className="overflow-x-auto">
               <table className="min-w-full border-collapse">
                  <thead className="bg-gray-200 border-b sticky top-0">
                     <tr className="grid grid-cols-1 sm:grid-cols-2 w-full">
                        <th className="py-3 px-4 text-left font-semibold text-gray-700">
                           Title
                        </th>
                        <th className="py-3 px-4 text-center font-semibold text-gray-700">
                           Actions
                        </th>
                     </tr>
                  </thead>
                  <tbody className="block w-full h-[15rem] overflow-y-auto">
                     {models.map((model) => (
                        <tr
                           key={model.id}
                           className="grid grid-cols-1 sm:grid-cols-2 border-b hover:bg-gray-100 transition"
                        >
                           <td className="py-3 px-4 text-gray-800">
                              {model.title}
                           </td>
                           <td className="py-3 px-4 flex flex-col sm:flex-row justify-center gap-2">
                              <button
                                 onClick={() => onEditModel(model)}
                                 className="bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-600 transition"
                              >
                                 Edit
                              </button>
                              <button
                                 onClick={() => handleDelete(model.id)}
                                 className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition"
                              >
                                 Delete
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
};

export default ModelsResults;
