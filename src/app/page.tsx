import React from "react";
import Category from "../components/Category";
import { Category as categoryType } from "@/types/types";

const categories: categoryType[] = [
   {
      id: 1,
      title: "Batteries",
      slug: "batteries",
      image: "https://picsum.photos/200/300",
   },
   {
      id: 2,
      title: "UPS",
      slug: "ups",
      image: "https://picsum.photos/200/300",
   },
   {
      id: 3,
      title: "Inverters",
      slug: "inverters",
      image: "https://picsum.photos/200/300",
   },
   {
      id: 4,
      title: "AVR",
      slug: "avr",
      image: "https://picsum.photos/200/300",
   },
];

export default function Home() {
   return (
      <main className="mt-52">
         {categories.map((category) => (
            <Category key={category.id} category={category} />
         ))}
      </main>
   );
}
