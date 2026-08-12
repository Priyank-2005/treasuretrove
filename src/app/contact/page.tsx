import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { BRAND } from "@/config/brand";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact Us" }]} />
      
      <h1 className="font-serif text-4xl md:text-5xl font-medium mb-12 text-center">
        Get in Touch
      </h1>
      
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h2 className="font-serif text-2xl font-medium mb-6 border-b border-brand-champagne pb-2">Send us a message</h2>
          <form className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-medium uppercase tracking-wider text-gray-500">Name</label>
              <input type="text" id="name" className="p-3 border border-gray-300 focus:outline-none focus:border-brand-charcoal bg-transparent" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium uppercase tracking-wider text-gray-500">Email</label>
              <input type="email" id="email" className="p-3 border border-gray-300 focus:outline-none focus:border-brand-charcoal bg-transparent" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-sm font-medium uppercase tracking-wider text-gray-500">Message</label>
              <textarea id="message" rows={5} className="p-3 border border-gray-300 focus:outline-none focus:border-brand-charcoal bg-transparent"></textarea>
            </div>
            <button type="submit" className="btn-primary self-start">Send Message</button>
          </form>
        </div>
        
        <div className="bg-brand-champagne p-8 md:p-12 flex flex-col gap-8">
          <div>
            <h3 className="font-medium uppercase tracking-wider text-sm mb-2 text-gray-500">Customer Support</h3>
            <p className="text-lg font-medium">{BRAND.contact.email}</p>
            <p className="text-lg font-medium">{BRAND.contact.phone}</p>
          </div>
          <div>
            <h3 className="font-medium uppercase tracking-wider text-sm mb-2 text-gray-500">Business Hours</h3>
            <p className="text-gray-700">{BRAND.businessHours}</p>
          </div>
          <div>
            <h3 className="font-medium uppercase tracking-wider text-sm mb-2 text-gray-500">Studio (Appointment Only)</h3>
            <p className="text-gray-700">{BRAND.contact.address}</p>
          </div>
          <div className="mt-auto pt-8 border-t border-brand-charcoal/10">
            <p className="text-sm italic text-gray-500">
              Note: This is a demo contact page. Messages will not be delivered.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
