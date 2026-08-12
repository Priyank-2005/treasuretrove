import { Star } from "lucide-react";

interface ReviewCardProps {
  review: {
    name: string;
    rating: number;
    text: string;
  };
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="bg-white p-8 shadow-soft flex flex-col items-center text-center gap-4 h-full">
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < review.rating ? "fill-brand-gold text-brand-gold" : "text-gray-300"
            }`}
          />
        ))}
      </div>
      <p className="italic text-gray-600 flex-1">&ldquo;{review.text}&rdquo;</p>
      <p className="font-medium text-sm tracking-wider uppercase">— {review.name}</p>
    </div>
  );
}
