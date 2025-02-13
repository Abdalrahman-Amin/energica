import React from "react";
interface SidebarProps {
   onScrollTo: (formId: string) => void;
}
const Sidebar: React.FC<SidebarProps> = ({ onScrollTo }) => {
   const menuItems = [
      { label: "Add Category", formId: "add-category-form" },
      { label: "Add Model", formId: "add-model-form" },
      { label: "Add Product", formId: "add-product-form" },
   ];

   return (
      <div className="w-64 min-h-screen relative bg-gray-900 text-white flex flex-col p-4 border-r border-gray-700">
         <div className=" fixed top-0 left-0">
            <h2 className="text-xl font-bold text-gray-200 mb-6">
               Admin Panel
            </h2>
            <nav className="space-y-2">
               {menuItems.map((item, index) => (
                  <button
                     key={index}
                     onClick={() => onScrollTo(item.formId)}
                     className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-300 font-medium rounded-lg hover:bg-gray-800 transition-all duration-300"
                  >
                     {item.label}
                  </button>
               ))}
            </nav>
         </div>
      </div>
   );
};

export default Sidebar;
