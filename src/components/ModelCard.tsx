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

const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
   const words = model.title.split(" ");
   const firstWord = words.shift();
   const remainingWords = words.join(" ");

   return (
      <div className="model-card flex-shrink-0 transition-all duration-300 ease-in-out transform w-72 h-72 overflow-hidden border border-blue-500 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/50 hover:-translate-y-2 bg-white grid grid-rows-[auto_auto_1fr] p-4">
         {/* Top Section: Title & Image */}
         <div className="flex items-start justify-between space-x-3">
            {/* Title (Two Fixed Lines) */}
            <div className="flex-1 flex flex-col justify-start min-h-[3rem] max-h-[3rem]">
               <Link href={`/category#model-${model.id}`} passHref>
                  <h3 className="text-[0.9rem] font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors duration-200 leading-tight">
                     <span className="block whitespace-nowrap text-lg">
                        {firstWord}
                     </span>
                     <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                        {remainingWords}
                     </span>
                  </h3>
               </Link>
               {model.rating_value && (
                  <p className="text-[0.75rem] text-gray-600">
                     Rating: {model.rating_value} {model.rating_unit}
                  </p>
               )}
            </div>

            {/* Image + Button Wrapper */}
            <div className="flex flex-col items-center space-y-2">
               <div className="relative w-[80px] h-[80px] rounded-md overflow-hidden border border-gray-300 shadow-sm">
                  <Link href={`/category#model-${model.id}`} passHref>
                     <Image
                        src={model.image}
                        alt={model.title}
                        width={80}
                        height={80}
                        className="object-cover hover:opacity-90 transition-opacity duration-200"
                     />
                  </Link>
               </div>

               {/* Data Sheet Button */}
               <a
                  href={model.pdf_url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-28 items-center px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-md"
               >
                  <FaFilePdf className="mr-2" />
                  Data Sheet
               </a>
            </div>
         </div>

         {/* Full-Width Description */}
         <div className="p-2">
            <Link href={`/category#model-${model.id}`} passHref>
               <p className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200 line-clamp-3">
                  {model.description}
               </p>
            </Link>
         </div>
      </div>
   );
};

export default ModelCard;
