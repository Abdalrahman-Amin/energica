"use client";
import React, { useState, useEffect, useRef } from "react";
import {
   // FaWhatsapp,
   FaEnvelope,
   FaPhone,
   FaTimes,
   FaCommentDots,
} from "react-icons/fa";

const FloatingContactButton = () => {
   const [isOpen, setIsOpen] = useState(false);
   const buttonRef = useRef<HTMLDivElement>(null);

   const toggleContactDetails = () => setIsOpen(!isOpen);

   const handleClickOutside = (event: MouseEvent) => {
      if (
         buttonRef.current &&
         !buttonRef.current.contains(event.target as Node)
      ) {
         setIsOpen(false);
      }
   };

   useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, []);

   return (
      <div ref={buttonRef} className="z-50">
         {/* Floating Button */}
         <button
            onClick={toggleContactDetails}
            className="bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Contact Me"
            aria-expanded={isOpen}
         >
            {isOpen ? (
               <FaTimes className="h-5 w-5" />
            ) : (
               <FaCommentDots className="h-5 w-5" />
            )}
         </button>

         {/* Contact Details Dropdown */}
         <div
            className={`absolute top-20 right-0 bg-white rounded-lg shadow-lg p-4 w-64 transition-all duration-300 transform ${
               isOpen
                  ? "scale-100 opacity-100"
                  : "scale-95 opacity-0 pointer-events-none"
            }`}
         >
            <div className="space-y-3">
               <div className="flex items-center space-x-2">
                  <FaEnvelope className="h-5 w-5 text-red-500" />
                  <a
                     href="mailto:abdelrhmanmohamed421@gmail.com"
                     className="text-gray-700 hover:text-blue-600"
                  >
                     Email
                  </a>
               </div>
               <div className="flex items-center space-x-2">
                  <FaPhone className="h-5 w-5 text-blue-500" />
                  <a
                     href="tel:+2001070708070"
                     className="text-gray-700 hover:text-blue-600"
                  >
                     Call
                  </a>
               </div>
            </div>
         </div>
      </div>
   );
};

export default FloatingContactButton;
