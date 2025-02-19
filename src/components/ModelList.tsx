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
<div className={`relative px-4`}>
   {/* Container Background & Shadow */}
   <div className="absolute inset-x-0 h-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-50/50 via-blue-100/20 to-blue-50/50 blur-2xl -z-10" />

   {/* Scrollable Cards */}
   <div
      ref={containerRef}
      className="models flex overflow-x-auto gap-4 py-8 px-2 hide-scrollbar scroll-smooth 
         [scrollbar-width:none] [-ms-overflow-style:none] 
         [&::-webkit-scrollbar]:hidden"
      onScroll={checkOverflow}
   >
      {models.map((model) => (
         <div key={model.id} className="first:ml-0 last:mr-0">
            <ModelCard model={model} categorySlug={categorySlug} />
         </div>
      ))}
   </div>

   {/* Scroll Buttons - Smaller & Better Positioned */}
   {canScrollLeft && (
      <button
         onClick={scrollLeft}
         className="absolute -left-2 top-1/2 -translate-y-1/2 
           w-10 h-10 rounded-full 
           bg-white/90 backdrop-blur-sm 
           text-blue-600 
           flex items-center justify-center 
           shadow-md shadow-black/5 
           ring-1 ring-black/5
           transition-all duration-200 
           hover:bg-white hover:text-blue-700
           active:scale-95
           focus:outline-none focus:ring-2 
           focus:ring-blue-500 focus:ring-offset-2
           disabled:opacity-50 disabled:cursor-not-allowed
           z-10"
         aria-label="Scroll left"
      >
         <FaArrowLeft className="w-4 h-4" />
      </button>
   )}

   {canScrollRight && (
      <button
         onClick={scrollRight}
         className="absolute -right-2 top-1/2 -translate-y-1/2 
           w-10 h-10 rounded-full 
           bg-white/90 backdrop-blur-sm 
           text-blue-600 
           flex items-center justify-center 
           shadow-md shadow-black/5 
           ring-1 ring-black/5
           transition-all duration-200 
           hover:bg-white hover:text-blue-700
           active:scale-95
           focus:outline-none focus:ring-2 
           focus:ring-blue-500 focus:ring-offset-2
           disabled:opacity-50 disabled:cursor-not-allowed
           z-10"
         aria-label="Scroll right"
      >
         <FaArrowRight className="w-4 h-4" />
      </button>
   )}
</div>
   );
};

export default ModelList;
