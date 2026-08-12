import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Accordion } from "@/components/ui/Accordion";

export default function FAQPage() {
  const faqs = [
    {
      title: "Is the jewelry anti-tarnish?",
      content: "Yes, our jewelry is designed to be highly resistant to tarnishing. We use high-quality materials like 18K gold plating over stainless steel and 14K gold filled to ensure long-lasting shine."
    },
    {
      title: "Is it water resistant?",
      content: "Yes, you can safely wear our pieces while washing your hands or showering. However, we advise avoiding prolonged exposure to chlorinated pools or ocean water."
    },
    {
      title: "Is it suitable for sensitive skin?",
      content: "Absolutely. Our jewelry is hypoallergenic, meaning it is free from common irritants like nickel and lead, making it safe and comfortable for sensitive skin."
    },
    {
      title: "How long does shipping take?",
      content: "Standard shipping within India typically takes 3-5 business days depending on your location."
    },
    {
      title: "Do you offer Cash on Delivery (COD)?",
      content: "Yes, we offer COD for orders up to ₹5000. Please select the COD option at checkout."
    },
    {
      title: "What is the return policy?",
      content: "We accept returns within 14 days of delivery for unworn items in original packaging. Please note that for hygiene reasons, earrings cannot be returned."
    }
  ];

  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "FAQ" }]} />
      
      <div className="max-w-3xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl font-medium mb-12 text-center">
          Frequently Asked Questions
        </h1>
        
        <div className="bg-white p-8">
          <Accordion items={faqs} />
        </div>
        
        <div className="mt-12 text-center text-gray-600">
          <p>Still have questions?</p>
          <a href="/contact" className="text-brand-charcoal font-medium hover:text-brand-gold underline mt-2 inline-block">Contact Support</a>
        </div>
      </div>
    </div>
  );
}
