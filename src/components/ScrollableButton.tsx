import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ScrollableButtonProps {
   title: string;
   isActive: boolean;
   onClick: () => void;
}

const ScrollableButton = ({
   title,
   isActive,
   onClick,
}: ScrollableButtonProps) => {
   const containerRef = useRef<HTMLDivElement>(null);
   const textRef = useRef<HTMLDivElement>(null);
   const [shouldScroll, setShouldScroll] = useState(false);
   const controls = useAnimationControls();

   useEffect(() => {
      if (containerRef.current && textRef.current) {
         const containerWidth = containerRef.current.clientWidth;
         const textWidth = textRef.current.scrollWidth;
         const hasOverflow = textWidth > containerWidth;
         setShouldScroll(hasOverflow);

         if (hasOverflow && isActive && shouldScroll) {
            const distance = textWidth - containerWidth;
            controls.start({
               x: [0, -distance - 4],
               transition: {
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "linear",
                  repeatDelay: 0.5,
               },
            });
         } else {
            controls.stop();
            controls.set({ x: 0 });
         }
      }
   }, [title, isActive, controls, shouldScroll]);

   return (
      <Button
         onClick={onClick}
         variant={isActive ? "default" : "secondary"}
         className={cn(
            "relative overflow-hidden whitespace-nowrap px-2 py-1 text-xs md:px-3 md:py-1.5 md:text-sm md:flex-1",
            "transition-all duration-200",
            shouldScroll && "group" // Add group class for hover state handling
         )}
         title={title}
      >
         <div ref={containerRef} className="overflow-hidden">
            <motion.div
               ref={textRef}
               animate={controls}
               className={cn(
                  "inline-block",
                  // Only apply hover pause when scrolling is active
                  shouldScroll && "group-hover:[animation-play-state:paused]"
               )}
            >
               {title}
            </motion.div>
         </div>
      </Button>
   );
};

export default ScrollableButton;
