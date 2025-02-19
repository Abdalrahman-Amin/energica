import { Model, Product } from "@/types/types";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

// First, create a new component for the scrollable model section
export const ModelSection = ({
   model,
   products,
   handleWhatsAppClick,
}: {
   model: Model;
   products: Product[];
   handleWhatsAppClick: (params: { product: Product | null }) => void;
}) => {
   const containerRef = useRef<HTMLDivElement>(null);
   const [canScrollLeft, setCanScrollLeft] = useState(false);
   const [canScrollRight, setCanScrollRight] = useState(false);

   const checkOverflow = () => {
      const container = containerRef.current;
      if (container) {
         const { scrollLeft, scrollWidth, clientWidth } = container;
         setCanScrollLeft(scrollLeft > 0);
         setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
      }
   };

   const scrollLeft = () => {
      const container = containerRef.current;
      if (container) {
         container.scrollBy({ left: -280, behavior: "smooth" });
      }
   };

   const scrollRight = () => {
      const container = containerRef.current;
      if (container) {
         container.scrollBy({ left: 280, behavior: "smooth" });
      }
   };

   useEffect(() => {
      checkOverflow();
      window.addEventListener("resize", checkOverflow);
      return () => window.removeEventListener("resize", checkOverflow);
   }, []);

   return (
      <div className="mb-12" id={`model-${model.id}`}>
         <div className="model-section flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-700 pl-4 border-l-4 border-blue-500">
               {model.title}
            </h3>
         </div>

         <div className="relative -mx-4 px-4">
            {/* Container Background & Shadow */}
            <div className="absolute inset-x-0 h-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-50/50 via-blue-100/20 to-blue-50/50 blur-2xl -z-10" />

            {/* Scrollable Cards */}
            <div
               ref={containerRef}
               className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 hide-scrollbar scroll-smooth 
                   [scrollbar-width:none] [-ms-overflow-style:none] 
                   [&::-webkit-scrollbar]:hidden"
               onScroll={checkOverflow}
            >
               {products.map((product) => (
                  <div
                     id={`product-${product.id}`}
                     key={product.id}
                     className="group flex-shrink-0 w-[280px] bg-white rounded-xl overflow-hidden transition-all duration-300
                         hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]
                         border border-gray-100 product-card"
                  >
                     {/* Your existing product card content */}
                     {/* Image Container */}
                     <div className="relative h-48 overflow-hidden bg-gray-50">
                        <a
                           href={product.image}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="block h-full w-full"
                        >
                           <Image
                              src={product.image}
                              alt={product.title}
                              width={280}
                              height={192}
                              className="w-full h-full object-cover transition-transform duration-300 
                                         group-hover:scale-105"
                           />
                        </a>
                        {product.rating_value && (
                           <div
                              className="absolute top-3 right-3 px-2 py-1 rounded-lg 
                                       bg-white/90 backdrop-blur-sm 
                                       text-xs font-medium text-gray-700
                                       shadow-sm"
                           >
                              {product.rating_value} {product.rating_unit}
                           </div>
                        )}
                     </div>

                     {/* Content */}
                     <div className="p-4 space-y-3">
                        {/* Title and Description */}
                        <div className="space-y-1.5">
                           <h4 className="font-semibold text-gray-900 leading-tight">
                              {product.title}
                           </h4>
                           <p className="text-xs text-gray-600 line-clamp-2">
                              {product.description}
                           </p>
                        </div>

                        {/* Buttons Container */}
                        <div className="flex gap-2">
                           {/* WhatsApp Button */}
                           <button
                              onClick={() => handleWhatsAppClick({ product })}
                              className="flex-1 inline-flex items-center justify-center
                                       bg-gradient-to-r from-green-500 to-green-600
                                       text-white py-1.5 px-3 rounded-lg
                                       text-xs font-medium
                                       transition-all duration-200
                                       hover:from-green-600 hover:to-green-700
                                       focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                           >
                              <svg
                                 viewBox="0 0 24 24"
                                 className="w-3.5 h-3.5 mr-1.5 fill-current"
                                 xmlns="http://www.w3.org/2000/svg"
                              >
                                 <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                              </svg>
                              WhatsApp
                           </button>

                           {/* Data Sheet Download Button */}
                           {product.data_sheet && (
                              <a
                                 href={product.data_sheet}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="flex-1 inline-flex items-center justify-center
                                          bg-gradient-to-r from-blue-500 to-blue-600
                                          text-white py-1.5 px-3 rounded-lg
                                          text-xs font-medium
                                          transition-all duration-200
                                          hover:from-blue-600 hover:to-blue-700
                                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                              >
                                 <svg
                                    className="w-3.5 h-3.5 mr-1.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                 >
                                    <path
                                       strokeLinecap="round"
                                       strokeLinejoin="round"
                                       strokeWidth={2}
                                       d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                 </svg>
                                 Data Sheet
                              </a>
                           )}
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            {/* Scroll Buttons */}
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
                     z-10"
                  aria-label="Scroll right"
               >
                  <FaArrowRight className="w-4 h-4" />
               </button>
            )}
         </div>
      </div>
   );
};

// Then, in your main component, replace the models.map section with:
