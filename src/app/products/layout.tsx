export default function ProductsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <p>تخطيط المنتجات</p>
      {children}
    </div>
  );
}
