import React, { useEffect, useRef, useState } from "react";
import ModelCard from "./ModelCard";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Model } from "@/types/types";

interface ModelListProps {
   models: Model[];
   categorySlug: string;
}

const ModelList: React.FC<ModelListProps> = ({ models, categorySlug }) => {
   const containerRef = useRef<HTMLDivElement>(null);
   const [canScrollLeft, setCanScrollLeft] = useState(false);
   const [canScrollRight, setCanScrollRight] = useState(false);
   const [cardWidth, setCardWidth] = useState(0);
   const gap = 24; // Adjust based on Tailwind gap-6 (6 * 4px)

   // Check for overflow and update scroll button visibility
   const checkOverflow = () => {
      if (containerRef.current) {
         const { scrollWidth, clientWidth, scrollLeft } = containerRef.current;

         // Determine scrollable sides
         const canScrollLeftNow = scrollLeft > 0;
         const canScrollRightNow = scrollLeft + clientWidth < scrollWidth - 1;

         setCanScrollLeft(canScrollLeftNow);
         setCanScrollRight(canScrollRightNow);

         // Calculate the width of the first card
         const firstCard = containerRef.current.querySelector(".model-card");
         if (firstCard) {
            setCardWidth(firstCard.clientWidth + gap);
         }
      }
   };

   useEffect(() => {
      checkOverflow();
      window.addEventListener("resize", checkOverflow);
      return () => window.removeEventListener("resize", checkOverflow);
   }, [models]);

   const scrollLeft = () => {
      if (containerRef.current && cardWidth > 0) {
         containerRef.current.scrollBy({
            left: -cardWidth,
            behavior: "smooth",
         });
      }
   };

   const scrollRight = () => {
      if (containerRef.current && cardWidth > 0) {
         containerRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
      }
   };

   return (
      <div className="relative">
         {/* Scrollable Cards */}
         <div
            ref={containerRef}
            className="models flex overflow-x-auto gap-6 py-4 hide-scrollbar bg-slate-100 scroll-smooth"
            onScroll={checkOverflow}
         >
            {models.map((model) => (
               <ModelCard
                  key={model.id}
                  model={model}
                  categorySlug={categorySlug}
               />
            ))}
         </div>

         {/* Left Scroll Button */}
         {canScrollLeft && (
            <button
               onClick={scrollLeft}
               className="absolute -left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white text-black flex items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            >
               <FaArrowLeft className="w-6 h-6" />
            </button>
         )}

         {/* Right Scroll Button */}
         {canScrollRight && (
            <button
               onClick={scrollRight}
               className="absolute -right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white text-black flex items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            >
               <FaArrowRight className="w-6 h-6" />
            </button>
         )}
      </div>
   );
};

export default ModelList;
