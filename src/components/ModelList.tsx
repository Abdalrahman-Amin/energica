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
}

const ModelList: React.FC<ModelListProps> = ({ models }) => {
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
         containerRef.current.scrollBy({ left: -200, behavior: "smooth" });
      }
   };

   const scrollRight = () => {
      if (containerRef.current) {
         containerRef.current.scrollBy({ left: 200, behavior: "smooth" });
      }
   };
   return (
      <div className="relative">
         <div
            ref={containerRef}
            className="models flex overflow-x-auto gap-4 py-4 md:justify-center hide-scrollbar"
         >
            {models.map((model) => (
               <ModelCard key={model.id} model={model} />
            ))}
         </div>
         {/* Scroll Buttons (Conditional Rendering) */}
         {hasOverflow && (
            <div className="absolute -bottom-8 right-0 flex gap-2 p-2">
               <button
                  onClick={scrollLeft}
                  className="w-8 h-8 bg-white bg-opacity-75 flex items-center justify-center rounded-lg shadow-md hover:bg-opacity-100 transition hover:scale-105 hover:bg-gray-100 "
               >
                  <FaArrowLeft />
               </button>
               <button
                  onClick={scrollRight}
                  className="w-8 h-8 bg-white bg-opacity-75 flex items-center justify-center rounded-lg shadow-md hover:bg-opacity-100 transition hover:scale-105 hover:bg-gray-100"
               >
                  <FaArrowRight />
               </button>
            </div>
         )}
      </div>
   );
};

export default ModelList;
