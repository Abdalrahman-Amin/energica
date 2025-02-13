import React, { useState } from "react";

interface SidebarProps {
   onScrollTo: (formId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onScrollTo }) => {
   const [isOpen, setIsOpen] = useState(false);

   const menuItems = [
      { label: "Add Category", formId: "add-category-form" },
      { label: "Add Model", formId: "add-model-form" },
      { label: "Add Product", formId: "add-product-form" },
   ];

   return (
      <>
         {/* Mobile Toggle Button */}
         <button
            className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white px-3 py-2 rounded-md shadow-md"
            onClick={() => setIsOpen(!isOpen)}
         >
            {isOpen ? "Close" : "Menu"}
         </button>

         {/* Sidebar */}
         <div
            className={`fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white border-r border-gray-700 transition-transform duration-300 ease-in-out z-40
               ${
                  isOpen ? "translate-x-0" : "-translate-x-full"
               } md:translate-x-0`}
         >
            <div className="flex flex-col h-full p-4 overflow-y-auto">
               <h2 className="text-xl font-bold text-gray-200 mb-6">
                  Admin Panel
               </h2>
               <nav className="space-y-2">
                  {menuItems.map((item, index) => (
                     <button
                        key={index}
                        onClick={() => {
                           onScrollTo(item.formId);
                           setIsOpen(false); // Close sidebar after click (on mobile)
                        }}
                        className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-300 font-medium rounded-lg hover:bg-gray-800 transition-all duration-300"
                     >
                        {item.label}
                     </button>
                  ))}
               </nav>
            </div>
         </div>

         {/* Overlay for Mobile */}
         {isOpen && (
            <div
               className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
               onClick={() => setIsOpen(false)}
            ></div>
         )}
      </>
   );
};

export default Sidebar;
