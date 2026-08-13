import { Breadcrumb } from "@/components/ui/Breadcrumb";

export default function CarePage() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Jewelry Care" }]} />
      
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="font-serif text-4xl md:text-5xl font-medium mb-6">
          Keep Your Shine Longer
        </h1>
        <p className="text-lg text-gray-600 mb-16 max-w-xl mx-auto">
          Our pieces are designed for everyday wear. Follow these simple tips to ensure they last a lifetime.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 text-left">
          <div>
            <h3 className="font-serif text-2xl font-medium mb-4">Everyday Usage</h3>
            <p className="text-gray-600 leading-relaxed">
              Our jewelry is tarnish-resistant and water-resistant. You can safely wear it while washing your hands or during light exercise. However, we recommend removing pieces before swimming in chlorinated pools or the ocean.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-2xl font-medium mb-4">Storage</h3>
            <p className="text-gray-600 leading-relaxed">
              When not wearing your jewelry, store it in the original Treasure Trove pouch or a jewelry box. Keep pieces separate to avoid scratching, and store them in a cool, dry place away from direct sunlight.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-2xl font-medium mb-4">Perfume & Cosmetics</h3>
            <p className="text-gray-600 leading-relaxed">
              Always apply lotions, perfumes, and hairspray before putting on your jewelry. Wait for these products to dry completely. The chemicals in these products can dull the shine of your pieces over time.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-2xl font-medium mb-4">Cleaning</h3>
            <p className="text-gray-600 leading-relaxed">
              To restore shine, gently wipe your jewelry with a soft microfiber cloth. For a deeper clean, soak in warm water with a drop of mild dish soap, gently brush with a soft toothbrush, rinse thoroughly, and pat dry.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
