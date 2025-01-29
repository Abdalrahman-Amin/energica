import React from "react";

interface Model {
   id: number;
   created_at: string;
   slug: string;
   title: string;
   description: string;
   image: string;
}

interface ModelCardProps {
   model: Model;
}

const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
   return (
      <div className="model-card flex h-64 w-96 flex-shrink-0 overflow-hidden border border-gray-200 rounded-lg shadow-sm">
         {/* Text Content (Left Side) */}
         <div className="flex-1 p-6 flex flex-col justify-center">
            <h3 className="text-xl font-semibold text-gray-800">
               {model.title}
            </h3>
            <p className="text-base text-gray-600">{model.description}</p>
         </div>

         {/* Image (Right Side - Full Height) */}
         <div className="w-1/2 flex-shrink-0">
            <img
               src={model.image}
               alt={model.title}
               className="w-full h-full object-cover"
            />
         </div>
      </div>
   );
};

export default ModelCard;
