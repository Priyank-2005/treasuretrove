import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <>
      {/* 1. Premium Hero Banner - Full Bleed Editorial */}
      <section className="relative w-full h-[90vh] min-h-[600px] mt-16 md:mt-20 bg-base-dark">
        {/* Main hero image */}
        <div 
          className="absolute inset-0 bg-cover bg-[center_top_-5rem]"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1599643478524-fb66f7ca066b?q=80&w=2000')" }}
        ></div>
        
        {/* Stronger gradient overlay to make white text pop against the image */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>

        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto">
          <span className="eyebrow text-gold-highlight mb-6 block tracking-[0.4em]">The Signature Collection</span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-8 leading-[1.1] tracking-tight drop-shadow-sm">
            Radiant <br/>
            <span className="italic text-gold-highlight font-light">Elegance</span>
          </h1>
          <p className="font-sans text-sm md:text-base text-white/90 mb-10 max-w-md leading-relaxed drop-shadow-sm">
            Discover pieces crafted with uncompromising quality. Designed to be the golden thread in your everyday story.
          </p>
          <Link href="/shop" className="btn-pill-light border-white bg-transparent text-white hover:bg-white hover:text-base-dark backdrop-blur-sm">
            Explore Collection
          </Link>
        </div>
      </section>

      {/* 2. Value Props / Trust Strip */}
      <section className="bg-base-light py-10 border-b border-gold-mid/30">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-24 text-center">
            <div className="flex flex-col items-center gap-3">
              <svg className="w-6 h-6 text-gold-mid" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              <span className="font-sans text-xs tracking-widest uppercase text-base-dark">Tarnish Free</span>
            </div>
            <div className="w-16 h-px md:w-px md:h-10 bg-gold-mid/30"></div>
            <div className="flex flex-col items-center gap-3">
              <svg className="w-6 h-6 text-gold-mid" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              <span className="font-sans text-xs tracking-widest uppercase text-base-dark">Hypoallergenic</span>
            </div>
            <div className="w-16 h-px md:w-px md:h-10 bg-gold-mid/30"></div>
            <div className="flex flex-col items-center gap-3">
              <svg className="w-6 h-6 text-gold-mid" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
              <span className="font-sans text-xs tracking-widest uppercase text-base-dark">Water Resistant</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Shop by Category - Delicate Circles */}
      <section className="py-24 md:py-32 bg-base-light relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-20 pointer-events-none"></div>
        <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
          
          {/* Subtle Star Motif */}
          <div className="flex justify-center mb-6">
            <svg className="w-5 h-5 text-gold-mid/60" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z"/>
            </svg>
          </div>

          <h2 className="font-serif text-3xl md:text-5xl text-base-dark mb-20 tracking-wide font-light">Shop by Category</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-5xl mx-auto">
            
            <Link href="/shop/necklaces" className="group flex flex-col items-center gap-6">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden relative shadow-sm group-hover:shadow-soft transition-all duration-500 border border-gold-mid p-2">
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1599643478524-fb66f7ca066b?q=80&w=400')" }}
                  ></div>
                </div>
              </div>
              <span className="font-sans text-xs tracking-[0.2em] uppercase text-text-light-muted group-hover:text-base-dark transition-colors">Necklaces</span>
            </Link>
            
            <Link href="/shop/earrings" className="group flex flex-col items-center gap-6">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden relative shadow-sm group-hover:shadow-soft transition-all duration-500 border border-gold-mid p-2">
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400')" }}
                  ></div>
                </div>
              </div>
              <span className="font-sans text-xs tracking-[0.2em] uppercase text-text-light-muted group-hover:text-base-dark transition-colors">Earrings</span>
            </Link>
            
            <Link href="/shop/rings" className="group flex flex-col items-center gap-6">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden relative shadow-sm group-hover:shadow-soft transition-all duration-500 border border-gold-mid p-2">
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1605100804763-247f6612d540?q=80&w=400')" }}
                  ></div>
                </div>
              </div>
              <span className="font-sans text-xs tracking-[0.2em] uppercase text-text-light-muted group-hover:text-base-dark transition-colors">Rings</span>
            </Link>
            
            <Link href="/shop/bracelets" className="group flex flex-col items-center gap-6">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden relative shadow-sm group-hover:shadow-soft transition-all duration-500 border border-gold-mid p-2">
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=400')" }}
                  ></div>
                </div>
              </div>
              <span className="font-sans text-xs tracking-[0.2em] uppercase text-text-light-muted group-hover:text-base-dark transition-colors">Bracelets</span>
            </Link>
            
          </div>
        </div>
      </section>

      {/* 4. Best Sellers Grid (High Contrast Dark Section) */}
      <section className="py-24 md:py-32 bg-base-dark text-base-light">
        <div className="container mx-auto px-6 md:px-12">
          
          <div className="flex justify-center mb-6">
            <svg className="w-5 h-5 text-gold-mid/60" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z"/>
            </svg>
          </div>

          <div className="flex flex-col items-center text-center mb-20">
            <h2 className="font-serif text-3xl md:text-5xl text-base-light mb-6 tracking-wide font-light">Most Loved</h2>
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

      {/* 4.5 Moving Reels / The Daily Stack */}
      <section className="py-20 overflow-hidden bg-base-light">
        <div className="container mx-auto px-6 mb-12 text-center md:text-left flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl text-base-dark tracking-wide font-light mb-2">In Motion</h2>
            <p className="font-sans text-sm text-text-light-muted">
              Tag @treasuretrove to be featured on our feed.
            </p>
          </div>
          <Link href="#" className="text-xs uppercase tracking-[0.25em] text-text-light-muted hover:text-base-dark transition-colors border-b border-transparent hover:border-base-dark pb-1">
            Follow Us
          </Link>
        </div>

        {/* Infinite Marquee Container */}
        <div className="relative flex overflow-x-hidden w-full group">
          <div className="flex animate-marquee whitespace-nowrap gap-4 md:gap-6 px-2 w-[200%] md:w-max">
            {[
              "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=400&h=700&fit=crop",
              "https://images.unsplash.com/photo-1599643478524-fb66f7ca066b?q=80&w=400&h=700&fit=crop",
              "https://images.unsplash.com/photo-1605100804763-247f6612d540?q=80&w=400&h=700&fit=crop",
              "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400&h=700&fit=crop",
              "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=400&h=700&fit=crop",
              "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=400&h=700&fit=crop",
              "https://images.unsplash.com/photo-1599643478524-fb66f7ca066b?q=80&w=400&h=700&fit=crop",
              "https://images.unsplash.com/photo-1605100804763-247f6612d540?q=80&w=400&h=700&fit=crop",
              "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400&h=700&fit=crop",
              "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=400&h=700&fit=crop",
            ].map((img, i) => (
              <div key={i} className="relative w-48 md:w-72 aspect-[9/16] rounded-xl overflow-hidden shrink-0 cursor-pointer shadow-soft group/reel">
                <div 
                  className="absolute inset-0 bg-cover bg-center group-hover/reel:scale-105 transition-transform duration-700"
                  style={{ backgroundImage: `url('${img}')` }}
                ></div>
                {/* Play icon overlay */}
                <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm rounded-full p-2">
                  <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
                  <span className="text-white font-sans text-[10px] md:text-xs flex items-center gap-2">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/></svg>
                    Shop Look
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Brand Story Split */}
      <section className="py-24 md:py-32 bg-gold-metallic text-base-dark">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-16 md:gap-20 items-center max-w-6xl mx-auto">
            <div className="relative aspect-[4/5] overflow-hidden border border-base-dark/20 rounded-tl-[120px] rounded-br-[120px] shadow-soft">
              <div 
                className="absolute inset-0 bg-cover bg-center hover:scale-105 transition-transform duration-1000"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800')" }}
              ></div>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left md:pl-12">
              <div className="flex justify-center mb-6">
                <svg className="w-5 h-5 text-base-dark/60" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z"/>
                </svg>
              </div>
              <span className="eyebrow mb-6 block text-base-light tracking-[0.4em]">Our Story</span>
              <h2 className="font-serif text-4xl md:text-6xl text-base-dark mb-8 leading-tight font-light">
                Designed for the <br/><span className="italic text-base-light">everyday</span>, crafted for <br/> a lifetime.
              </h2>
              <p className="font-sans text-base-dark/80 mb-12 text-sm md:text-base leading-relaxed max-w-md">
                At Treasure Trove by Gurasim, we believe fine jewelry shouldn't be locked away for special occasions. We craft high-quality, tarnish-resistant pieces designed to live with you—through showers, workouts, and whatever the day brings.
              </p>
              <Link href="/about" className="btn-pill-light border-base-dark bg-transparent text-base-dark hover:bg-base-dark hover:text-base-light px-10 py-4">
                Read More
              </Link>
            </div>
          </div>
        </div>
      </section>


    </>
  );
}
