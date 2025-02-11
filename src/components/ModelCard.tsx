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
      <div className="model-card flex-shrink-0  transition-all duration-300 ease-in-out transform w-64 h-64 overflow-hidden border-2 border-blue-500 rounded-lg shadow-md hover:shadow-lg hover:shadow-blue-500/50 hover:-translate-y-1 bg-white grid grid-cols-2 grid-rows-2">
         {/* Top Left: Header */}
         <div className="p-2 ps-5 flex items-start justify-start bg-gray-50 overflow-hidden">
            <Link href={`/category/${categorySlug}/${model.slug}`} passHref>
               <h3 className="text-2xl font-semibold text-gray-900 cursor-pointer text-center truncate">
                  {model.title}
               </h3>
            </Link>
         </div>

         {/* Top Right: Image */}
         <div className="relative">
            <Link href={`/category/${categorySlug}/${model.slug}`} passHref>
               <Image
                  src={model.image}
                  alt={model.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-tr-lg"
               />
            </Link>
         </div>

         {/* Bottom Left: Description */}
         <div className="p-2 flex bg-gray-50 overflow-hidden">
            <Link href={`/category/${categorySlug}/${model.slug}`} passHref>
               <p className="text-sm text-gray-600 ">{model.description}</p>
            </Link>
         </div>

         {/* Bottom Right: PDF Link */}
         <div className="p-2 flex items-end justify-center bg-gray-50">
            <a
               href={model.pdf_url}
               download
               target="_blank"
               className=" inline-flex items-center px-2 py-1 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
               <FaFilePdf className="mr-1" /> {/* PDF Icon */}
               Data Sheet
            </a>
         </div>
      </div>
   );
};

export default ModelCard;
