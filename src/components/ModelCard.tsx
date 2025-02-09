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
      <div className="model-card flex-shrink-0 hover:scale-105 transition-all duration-300 ease-in-out transform flex flex-col lg:flex-row h-auto w-full md:max-w-md lg:max-w-lg overflow-hidden border border-gray-300 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 bg-white">
         {/* Image Section */}
         <div className="w-full lg:w-1/2 flex-shrink-0 relative h-48 lg:h-auto">
            <Link href={`/category/${categorySlug}/${model.slug}`} passHref>
               <Image
                  src={model.image}
                  alt={model.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg lg:rounded-none lg:rounded-l-lg"
               />
            </Link>
         </div>

         {/* Text Content */}
         <div className="flex-1 p-6 flex flex-col h-full justify-start bg-gray-50">
            <div className="mb-10">
               <Link href={`/category/${categorySlug}/${model.slug}`} passHref>
                  <h3 className="text-xl font-semibold text-gray-900 self-center cursor-pointer">
                     {model.title}
                  </h3>
               </Link>
               <p className="text-sm text-gray-600 mt-1">{model.description}</p>
            </div>
            <div className="mt-auto">
               <a
                  href={model.pdf_url}
                  download
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
               >
                  <FaFilePdf className="mr-2" /> {/* PDF Icon */}
                  Download PDF
               </a>
            </div>
         </div>
      </div>
   );
};

export default ModelCard;
