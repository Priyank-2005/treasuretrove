import Link from "next/link";
import Image from "next/image";

interface CategoryCardProps {
  category: {
    name: string;
    slug: string;
    image: string;
  };
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/shop/${category.slug}`}
      className="group relative aspect-[3/4] overflow-hidden bg-brand-champagne block"
    >
      <Image
        src={category.image}
        alt={category.name}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
      <div className="absolute inset-0 flex items-center justify-center">
        <h3 className="text-2xl md:text-3xl font-serif text-white tracking-widest uppercase relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-300 group-hover:after:w-full">
          {category.name}
        </h3>
      </div>
    </Link>
  );
}
