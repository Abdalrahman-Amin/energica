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
      <div className="model-card flex flex-col md:flex-row h-auto w-full md:w-96 flex-shrink-0 overflow-hidden border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-all">
         <div className="flex-1 p-6 flex flex-col justify-center bg-gray-50">
            <h3 className="text-xl font-semibold text-gray-900">
               {model.title}
            </h3>
            <p className="text-sm text-gray-600 mt-2">{model.description}</p>
         </div>
         <div className="w-full md:w-1/2 flex-shrink-0">
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
