import React, { useEffect, useRef, useState } from "react";

interface ScrollableButtonProps {
   title: string;
   isActive: boolean;
   onClick: () => void;
}
export const ScrollableButton: React.FC<ScrollableButtonProps> = ({
   title,
   isActive,
   onClick,
}) => {
   const buttonRef = useRef<HTMLButtonElement>(null);
   const textRef = useRef<HTMLElement>(null);
   const [shouldScroll, setShouldScroll] = useState(false);

   useEffect(() => {
      if (buttonRef.current && textRef.current) {
         const buttonWidth = buttonRef.current.clientWidth;
         const textWidth = textRef.current.scrollWidth;
         setShouldScroll(textWidth > buttonWidth); // Only scroll if text is wider than the button
      }
   }, [title, isActive]);

   return (
      <button
         ref={buttonRef}
         onClick={onClick}
         className={`
        whitespace-nowrap px-2 py-1 text-xs rounded-md font-medium transition-all duration-200
        relative overflow-hidden truncate md:px-3 md:py-1.5 md:text-sm md:rounded-lg md:flex-1
        ${
           isActive
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-blue-50 text-blue-600 hover:bg-blue-100"
        }
      `}
         title={title}
      >
         <span
            ref={textRef}
            className={`inline-block ${
               isActive && shouldScroll ? "animate-marquee" : ""
            }`}
         >
            {title}
         </span>
      </button>
   );
};
