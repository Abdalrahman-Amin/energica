import { Model } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { Card } from "./ui/card";
// import { FaFilePdf } from "react-icons/fa";

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
      <motion.div
         initial={{ opacity: 0, y: 20 }} // Fade-in animation
         animate={{ opacity: 1, y: 0 }}
         whileHover={{ scale: 1.03 }} // Slight hover scale
         transition={{ duration: 0.4, ease: "easeOut" }}
      >
         <Card className="relative flex-shrink-0 w-72 min-h-[220px] p-5 overflow-hidden group">
            {/* Outer Glow & Background Effects */}
            <div className="absolute inset-0 rounded-2xl transition-all duration-300">
               <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-gray-200 via-white to-gray-100" />
               <div
                  className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-white/90 to-white/50 backdrop-blur-sm
              transition-all duration-300 group-hover:from-white group-hover:to-white/80"
               />
               <div
                  className="absolute inset-0 rounded-2xl border border-gray-200/80 transition-all duration-300
              bg-gradient-to-br from-transparent to-transparent
              group-hover:from-blue-500/10 group-hover:to-blue-400/5
              group-hover:border-blue-500/20"
               />
            </div>

            {/* Content Container */}
            <div className="relative h-full flex flex-col z-10">
               {/* Title & Image Section */}
               <div className="flex items-start justify-between gap-4">
                  {/* Title */}
                  <div className="flex-1 space-y-1 min-w-4">
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
                  </div>

                  {/* Image */}
                  <motion.div
                     whileHover={{ scale: 1.1 }}
                     transition={{ duration: 0.3 }}
                  >
                     <Link
                        href={`/category#model-${model.id}`}
                        className="block relative w-20 h-20 rounded-lg overflow-hidden ring-1 ring-gray-200/80 
                  transition-all duration-300 group-hover:ring-blue-500/20"
                     >
                        <Image
                           src={model.image}
                           alt={model.title}
                           width={80}
                           height={80}
                           className="object-cover w-full h-full transition-all duration-300 group-hover:brightness-110"
                        />
                     </Link>
                  </motion.div>
               </div>

               {/* Description Section */}
               <div className="mt-4 flex-grow">
                  <Link
                     href={`/category#model-${model.id}`}
                     className="block hover:text-gray-900"
                  >
                     <p
                        className="text-sm leading-relaxed text-gray-600 line-clamp-4 
                  group-hover:text-gray-900 transition-colors duration-200"
                     >
                        {model.description}
                     </p>
                  </Link>
               </div>
            </div>
         </Card>
      </motion.div>
   );
};

export default ModelCard;
