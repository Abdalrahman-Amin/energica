import { Model } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaFilePdf } from "react-icons/fa";

interface ModelCardProps {
   model: Model;
   categorySlug: string;
   className?: string;
}

const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
   const words = model.title.split(" ");
   const firstWord = words.shift();
   const remainingWords = words.join(" ");

   return (
      <div className="model-card group relative flex-shrink-0 w-72 h-auto min-h-[220px] bg-white rounded-2xl">
         {/* Background Effects - Moved to back */}
         <div
            className="absolute inset-0 rounded-2xl transition-all duration-300
                        ring-1 ring-gray-200/50 group-hover:ring-blue-500/20
                        shadow-lg shadow-gray-200/50 group-hover:shadow-blue-500/20
                        group-hover:-translate-y-1 bg-gradient-to-br from-white/90 to-white/50 backdrop-blur-sm"
         />

         {/* Content Container - Brought to front */}
         <div className="relative h-full p-5 flex flex-col z-10">
            {/* Top Section: Title & Image */}
            <div className="flex items-start justify-between gap-4">
               {/* Title Section */}
               <div className="flex-1 space-y-1">
                  <Link
                     href={`/category#model-${model.id}`}
                     className="block group-hover:text-blue-600 transition-colors duration-200"
                  >
                     <h3 className="text-gray-900">
                        <span className="block text-lg font-bold tracking-tight">
                           {firstWord}
                        </span>
                        <span className="block text-sm font-medium text-gray-600 truncate">
                           {remainingWords}
                        </span>
                     </h3>
                  </Link>
                  {model.rating_value && (
                     <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {model.rating_value} {model.rating_unit}
                     </div>
                  )}
               </div>

               {/* Image Section */}
               <div className="flex flex-col items-end gap-3">
                  <Link
                     href={`/category#model-${model.id}`}
                     className="block relative w-20 h-20 rounded-lg overflow-hidden ring-1 ring-gray-200 transition-transform duration-300 group-hover:scale-105"
                  >
                     <Image
                        src={model.image}
                        alt={model.title}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full transition-all duration-300 group-hover:brightness-110"
                     />
                  </Link>
               </div>
            </div>

            {/* Description Section */}
            <div className="mt-4 flex-grow">
               <Link
                  href={`/category#model-${model.id}`}
                  className="block hover:text-gray-900"
               >
                  <p className="text-sm leading-relaxed text-gray-600 line-clamp-4 group-hover:text-gray-900 transition-colors duration-200">
                     {model.description}
                  </p>
               </Link>
            </div>

            {/* Data Sheet Button */}
            <div className="mt-4 pt-4 border-t border-gray-100">
               <a
                  href={model.pdf_url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center px-4 py-2.5 
                           bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg
                           hover:from-blue-700 hover:to-blue-800 
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                           transition-all duration-200 
                           shadow-[0_2px_8px_-2px_rgba(59,130,246,0.3)] 
                           hover:shadow-[0_4px_12px_-2px_rgba(59,130,246,0.4)]"
               >
                  <FaFilePdf className="mr-2 text-white/90" />
                  Download Data Sheet
               </a>
            </div>
         </div>
      </div>
   );
};

export default ModelCard;
