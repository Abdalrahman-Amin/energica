import { Model } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaFilePdf } from "react-icons/fa"; // Import the PDF icon

interface ModelCardProps {
   model: Model;
   categorySlug: string;
   className?: string;
}

const ModelCard: React.FC<ModelCardProps> = ({ model, categorySlug }) => {
   return (
      <div className="model-card flex-shrink-0 transition-all duration-300 ease-in-out transform w-64 h-64 overflow-hidden border-2 border-blue-500 rounded-lg shadow-md hover:shadow-lg hover:shadow-blue-500/50 hover:-translate-y-1 bg-white grid grid-rows-[auto_auto_1fr] p-3">
         {/* Top: Title & Image */}
         <div className="flex items-center justify-between space-x-4">
            {/* Title (Vertically Centered) */}
            <div className="flex-1 flex flex-col justify-start p-2 space-y-1">
               <Link href={`/category/${categorySlug}/${model.slug}`} passHref>
                  <h3 className="text-xl font-semibold text-gray-900 cursor-pointer truncate hover:text-blue-600 transition-colors duration-200">
                     {model.title}
                  </h3>
               </Link>
               {model.rating_value && (
                  <p className="text-[0.8rem] text-gray-600">
                     Rating: {model.rating_value} {model.rating_unit}
                  </p>
               )}
            </div>

            {/* Image */}
            <div className="relative w-24 h-24 flex-shrink-0">
               <Link href={`/model/${model.id}`} passHref>
                  <Image
                     src={model.image}
                     alt={model.title}
                     layout="fill"
                     objectFit="cover"
                     className="rounded-lg hover:opacity-90 transition-opacity duration-200"
                  />
               </Link>
            </div>
         </div>

         {/* Button (Aligned Below Image) */}
         <div className="flex justify-end mt-2">
            <a
               href={model.pdf_url}
               download
               target="_blank"
               rel="noopener noreferrer"
               className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
               <FaFilePdf className="mr-2" />
               Data Sheet
            </a>
         </div>

         {/* Full-Width Description */}
         <div className="p-2">
            <Link href={`/model/${model.id}`} passHref>
               <p className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200 line-clamp-3">
                  {model.description}
               </p>
            </Link>
         </div>
      </div>
   );
};

export default ModelCard;
