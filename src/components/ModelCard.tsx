import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Model {
   id: number;
   created_at: string;
   slug: string;
   title: string;
   description: string;
   image: string;
}

interface ModelCardProps {
   model: Model;
   categorySlug: string;
   className?: string;
}

const ModelCard: React.FC<ModelCardProps> = ({
   model,
   categorySlug,
   className,
}) => {
   return (
      <Link
         href={`/category/${categorySlug}/${model.slug}`}
         passHref
         className={className}
      >
         <div className=" model-card flex flex-col lg:flex-row h-full w-screen max-w-md lg:max-w-lg  overflow-hidden border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 bg-white">
            {/* Image Section */}
            <div className="w-full lg:w-1/2 flex-shrink-0 relative h-48 lg:h-auto">
               <Image
                  src={model.image}
                  alt={model.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg lg:rounded-none lg:rounded-l-lg"
               />
            </div>

            {/* Text Content */}
            <div className="flex-1 p-6 flex flex-col h-full justify-start bg-gray-50">
               <div className="mb-10">
                  <h3 className="text-xl font-semibold text-gray-900 self-center">
                     {model.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                     {model.description}
                  </p>
               </div>
            </div>
         </div>
      </Link>
   );
};

export default ModelCard;
