import { Link } from 'react-router-dom';

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/products?category=${category.category_id}`}
      className="group relative block overflow-hidden rounded-2xl"
    >
      <img
        src={category.image_url}
        alt={category.category_name}
        className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
      <div className="absolute bottom-4 left-4 text-white">
        <h3 className="text-lg font-bold">{category.category_name}</h3>
        <p className="text-xs text-slate-200">{category.product_count} items</p>
      </div>
    </Link>
  );
}
