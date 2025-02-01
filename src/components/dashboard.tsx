"use client";

import withAdminAuth from "@/components/withAdminAuth";
import { useRouter } from "next/navigation";

const AdminDashboard = () => {
   const router = useRouter();

   return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
         <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-3xl text-center">
            <h1 className="text-4xl font-extrabold text-blue-700 mb-6">
               Admin Dashboard
            </h1>
            <p className="text-gray-600 mb-8">
               Manage categories, models, and products with ease.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <button
                  onClick={() => router.push("/admin/add-category")}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md"
               >
                  Add Category
               </button>

               <button
                  onClick={() => router.push("/admin/add-model")}
                  className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md"
               >
                  Add Model
               </button>

               <button
                  onClick={() => router.push("/admin/add-product")}
                  className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all duration-300 shadow-md"
               >
                  Add Product
               </button>
            </div>
         </div>
      </div>
   );
};

export default withAdminAuth(AdminDashboard);
