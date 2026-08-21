import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <>
      {/* 1. Premium Hero Banner */}
      <section className="relative w-full max-w-[1800px] mx-auto md:mt-12 md:px-6 mb-10">
        <div className="relative h-[70vh] md:h-[80vh] w-full md:rounded-2xl overflow-hidden shadow-sm flex items-center justify-center">
          
          {/* Main hero image */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599643478524-fb66f7ca066b?q=80&w=1600')] bg-cover bg-[center_top_-5rem] hover:scale-105 transition-transform duration-1000"></div>
          
          {/* Subtle gradient overlay to make text pop if needed, but keeping it light */}
          <div className="absolute inset-0 bg-base-light/40 backdrop-blur-[2px]"></div>

          {/* Elegant Inner Frame */}
          <div className="absolute inset-4 md:inset-8 border border-base-dark/20 pointer-events-none z-10"></div>
          
          <div className="relative z-20 text-center flex flex-col items-center px-6 py-12 bg-base-light/80 backdrop-blur-md rounded-xl max-w-2xl border border-base-dark/10 shadow-lg">
            <span className="eyebrow text-gold-deep mb-4 block tracking-[0.4em]">The Signature Collection</span>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-7xl text-base-dark mb-6 leading-[1.1] tracking-tight">
              Radiant <br/>
              <span className="italic text-gold-accent font-light">Elegance</span>
            </h1>
            <p className="font-sans text-sm md:text-base text-text-light-muted mb-8 max-w-sm leading-relaxed">
              Discover pieces crafted with uncompromising quality. Designed to be the golden thread in your everyday story.
            </p>
            <Link href="/shop" className="btn-pill">
              Explore Collection
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Value Props / Trust Strip */}
      <section className="bg-base-light py-10 border-b border-gold-mid/30">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-center items-center gap-10 md:gap-24 text-center">
            <div className="flex flex-col items-center gap-3">
              <svg className="w-6 h-6 text-gold-mid" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              <span className="font-sans text-xs tracking-widest uppercase text-base-dark">Tarnish Free</span>
            </div>
            <div className="hidden md:block w-px h-10 bg-gold-mid/30"></div>
            <div className="flex flex-col items-center gap-3">
              <svg className="w-6 h-6 text-gold-mid" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              <span className="font-sans text-xs tracking-widest uppercase text-base-dark">Hypoallergenic</span>
            </div>
            <div className="hidden md:block w-px h-10 bg-gold-mid/30"></div>
            <div className="flex flex-col items-center gap-3">
              <svg className="w-6 h-6 text-gold-mid" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
              <span className="font-sans text-xs tracking-widest uppercase text-base-dark">Water Resistant</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Shop by Category - Delicate Circles */}
      <section className="py-20 md:py-28 bg-base-light relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-20 pointer-events-none"></div>
        <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
          <h2 className="font-serif text-3xl md:text-4xl text-base-dark mb-16 tracking-wide font-light">Shop by Category</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-5xl mx-auto">
            
            <Link href="/shop/necklaces" className="group flex flex-col items-center gap-6">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden relative shadow-sm group-hover:shadow-soft transition-all duration-500 border border-gold-mid p-2">
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599643478524-fb66f7ca066b?q=80&w=400')] bg-cover bg-center group-hover:scale-110 transition-transform duration-700"></div>
                </div>
              </div>
              <span className="font-sans text-xs tracking-[0.2em] uppercase text-text-light-muted group-hover:text-base-dark transition-colors">Necklaces</span>
            </Link>
            
            <Link href="/shop/earrings" className="group flex flex-col items-center gap-6">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden relative shadow-sm group-hover:shadow-soft transition-all duration-500 border border-gold-mid p-2">
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400')] bg-cover bg-center group-hover:scale-110 transition-transform duration-700"></div>
                </div>
              </div>
              <span className="font-sans text-xs tracking-[0.2em] uppercase text-text-light-muted group-hover:text-base-dark transition-colors">Earrings</span>
            </Link>
            
            <Link href="/shop/rings" className="group flex flex-col items-center gap-6">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden relative shadow-sm group-hover:shadow-soft transition-all duration-500 border border-gold-mid p-2">
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1605100804763-247f6612d540?q=80&w=400')] bg-cover bg-center group-hover:scale-110 transition-transform duration-700"></div>
                </div>
              </div>
              <span className="font-sans text-xs tracking-[0.2em] uppercase text-text-light-muted group-hover:text-base-dark transition-colors">Rings</span>
            </Link>
            
            <Link href="/shop/bracelets" className="group flex flex-col items-center gap-6">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden relative shadow-sm group-hover:shadow-soft transition-all duration-500 border border-gold-mid p-2">
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=400')] bg-cover bg-center group-hover:scale-110 transition-transform duration-700"></div>
                </div>
              </div>
              <span className="font-sans text-xs tracking-[0.2em] uppercase text-text-light-muted group-hover:text-base-dark transition-colors">Bracelets</span>
            </Link>
            
          </div>
        </div>
      </section>

      {/* 4. Best Sellers Grid (High Contrast Dark Section) */}
      <section className="py-20 md:py-28 bg-base-dark text-base-light">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl text-base-light mb-4 tracking-wide font-light">Most Loved</h2>
            <Link href="/shop?filter=best-seller" className="text-xs uppercase tracking-[0.25em] text-gold-mid hover:text-gold-highlight transition-colors border-b border-transparent hover:border-gold-highlight pb-1">
              Shop All
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
            {[
              { name: "The Classic Pearl Drop", price: "$65.00", img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400" },
              { name: "Everyday Gold Hoops", price: "$48.00", img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=400" },
              { name: "Vintage Dome Ring", price: "$55.00", img: "https://images.unsplash.com/photo-1605100804763-247f6612d540?q=80&w=400" },
              { name: "Herringbone Chain", price: "$72.00", img: "https://images.unsplash.com/photo-1599643478524-fb66f7ca066b?q=80&w=400" }
            ].map((product, i) => (
              <div key={i} className="group cursor-pointer flex flex-col">
                <div className="relative aspect-[3/4] bg-base-light mb-4 overflow-hidden shadow-soft rounded-sm border border-gold-mid/30">
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                    style={{ backgroundImage: `url('${product.img}')` }}
                  ></div>
                  {/* Subtle Add to Cart overlay on desktop */}
                  <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hidden md:block">
                    <button className="w-full bg-base-dark/95 backdrop-blur-md text-base-light text-xs uppercase tracking-widest py-3 hover:bg-gold-metallic hover:text-base-dark transition-all border border-gold-mid/30 shadow-md">Add to Cart</button>
                  </div>
                </div>
                <div className="flex flex-col items-center text-center px-2">
                  <h3 className="font-serif text-lg text-base-light mb-1 group-hover:text-gold-highlight transition-colors">{product.name}</h3>
                  <span className="font-sans text-sm text-gold-mid">{product.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Brand Story Split */}
      <section className="py-20 bg-gold-metallic text-base-dark">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="relative aspect-[4/5] overflow-hidden border border-base-dark/20 rounded-tl-[100px] rounded-br-[100px] shadow-soft">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800')] bg-cover bg-center hover:scale-105 transition-transform duration-1000"></div>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left md:pl-12">
              <span className="eyebrow mb-6 block text-base-light">Our Story</span>
              <h2 className="font-serif text-4xl md:text-5xl text-base-dark mb-6 leading-tight font-light">
                Designed for the <br/><span className="italic text-base-light">everyday</span>, crafted for <br/> a lifetime.
              </h2>
              <p className="font-sans text-base-dark/80 mb-10 text-sm leading-relaxed max-w-md">
                At Treasure Trove by Gurasim, we believe fine jewelry shouldn't be locked away for special occasions. We craft high-quality, tarnish-resistant pieces designed to live with you—through showers, workouts, and whatever the day brings.
              </p>
              <Link href="/about" className="btn-pill-light border-base-dark bg-transparent text-base-dark hover:bg-base-dark hover:text-base-light">
                Read More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Newsletter CTA - Minimal */}
      <section className="py-28 bg-base-light relative overflow-hidden">
        <div className="absolute inset-0 border-y border-gold-mid/30 pointer-events-none"></div>
        <div className="container mx-auto px-6 flex flex-col items-center text-center relative z-10">
          <h2 className="font-serif text-3xl md:text-4xl text-base-dark mb-4 tracking-wide font-light">Join the Club</h2>
          <p className="text-text-light-muted font-sans text-sm mb-10 max-w-sm">
            Sign up for early access to new collections, exclusive events, and 10% off your first order.
          </p>
          
          <form className="w-full max-w-md flex flex-col sm:flex-row gap-4" action="#">
            <input 
              type="email" 
              placeholder="Email address" 
              className="flex-1 bg-transparent border-b border-base-dark/30 pb-3 text-base-dark placeholder:text-text-light-muted font-sans text-sm focus:outline-none focus:border-gold-mid transition-colors"
              required
            />
            <button type="submit" className="text-xs tracking-[0.25em] uppercase text-base-dark font-medium hover:text-gold-mid transition-colors mt-2 sm:mt-0 whitespace-nowrap border-b border-transparent hover:border-gold-mid pb-3">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
