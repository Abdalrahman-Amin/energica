import React from 'react';
import Category from '../components/Category';

const categories = [
  { id: 1, title: 'Batteries' },
  { id: 2, title: 'UPS' },
  { id: 3, title: 'Inverters' },
  { id: 4, title: 'AVR' },
];

export default function Home() {
  return (
    <div className="">
      <main className="">
        {/* <h1>مرحبا بالعالم</h1> */}
        {categories.map((category) => (
          <Category key={category.id} categoryId={category.id} />
        ))}
      </main>
    </div>
  );
}
