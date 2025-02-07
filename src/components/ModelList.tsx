import React, { useEffect, useRef, useState } from "react";
import ModelCard from "./ModelCard";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface Model {
   id: number;
   created_at: string;
   slug: string;
   title: string;
   description: string;
   image: string;
}

interface ModelListProps {
   models: Model[];
   categorySlug: string;
}

const ModelList: React.FC<ModelListProps> = ({ models, categorySlug }) => {
   const containerRef = useRef<HTMLDivElement>(null);
   const [hasOverflow, setHasOverflow] = useState(false);

   // Check for overflow on mount and when models change
   useEffect(() => {
      const checkOverflow = () => {
         if (containerRef.current) {
            const hasHorizontalOverflow =
               containerRef.current.scrollWidth >
               containerRef.current.clientWidth;
            setHasOverflow(hasHorizontalOverflow);
         }
      };

      checkOverflow();
      window.addEventListener("resize", checkOverflow);
      return () => window.removeEventListener("resize", checkOverflow);
   }, [models]);

   const scrollLeft = () => {
      if (containerRef.current) {
         containerRef.current.scrollBy({ left: -350, behavior: "smooth" });
      }
   };

   const scrollRight = () => {
      if (containerRef.current) {
         containerRef.current.scrollBy({ left: 350, behavior: "smooth" });
      }
   };
   return (
      <div className="relative">
         <div
            ref={containerRef}
            className="models flex overflow-x-auto gap-6 py-4 hide-scrollbar justify-start pl-8 lg:justify-center"
         >
            {models.map((model) => (
               <ModelCard
                  key={model.id}
                  model={model}
                  categorySlug={categorySlug}
               />
            ))}
         </div>
         {hasOverflow && (
            <div className="absolute -bottom-8 flex justify-center w-full">
               <div className="flex gap-2 p-2">
                  <button
                     onClick={scrollLeft}
                     className="w-10 h-10 bg-purple-500 text-white flex items-center justify-center rounded-full shadow-md hover:bg-purple-600 transition hover:scale-105"
                  >
                     <FaArrowLeft />
                  </button>
                  <button
                     onClick={scrollRight}
                     className="w-10 h-10 bg-purple-500 text-white flex items-center justify-center rounded-full shadow-md hover:bg-purple-600 transition hover:scale-105"
                  >
                     <FaArrowRight />
                  </button>
               </div>
            </div>
         )}
      </div>
   );
};

export default ModelList;
