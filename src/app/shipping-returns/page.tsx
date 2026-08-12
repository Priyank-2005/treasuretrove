import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { POLICIES } from "@/data/categories";

export default function ShippingReturnsPage() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Shipping & Returns" }]} />
      
      <div className="max-w-3xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl font-medium mb-12 text-center">
          Shipping & Returns
        </h1>

        <div className="space-y-16 text-gray-700 leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl font-medium text-brand-charcoal mb-4">Shipping Policy</h2>
            <p className="mb-4">{POLICIES.shipping.content}</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Orders placed before 12 PM IST are processed the same day.</li>
              <li>Delivery to metro cities usually takes 2-3 business days.</li>
              <li>Delivery to non-metro locations may take 4-7 business days.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-medium text-brand-charcoal mb-4">Returns & Exchanges (DEMO)</h2>
            <p className="mb-4">{POLICIES.returns.content}</p>
            <p className="mb-4 font-medium italic text-red-800">
              Note: This is a demo store. No real products will be shipped and no real returns will be processed.
            </p>
            <p className="mb-4">
              To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-medium text-brand-charcoal mb-4">Refunds</h2>
            <p className="mb-4">
              Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. If approved, your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment, within 5-7 business days.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
