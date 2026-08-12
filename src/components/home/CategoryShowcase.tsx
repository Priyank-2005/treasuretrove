import { CATEGORIES } from "@/data/categories";
import { CategoryCard } from "@/components/ui/CategoryCard";

export function CategoryShowcase() {
  return (
    <section className="py-20 bg-brand-ivory">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
