import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const PromoBanner = () => {
  return (
    <section className="bg-navy-900 py-20 md:py-28 relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-10">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=60"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="section-label text-amber-400 mb-4">Limited Time</p>
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-cream leading-tight mb-6">
          Summer Sale — up to
          <span className="text-amber-400"> 40% off</span>
        </h2>
        <p className="text-stone-400 text-lg mb-10 max-w-xl mx-auto">
          Selected items marked down. Free express shipping when you spend over $200.
        </p>
        <Link to="/shop?filter=sale" className="btn-primary text-base px-10 py-4">
          Shop the Sale <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  )
}

export default PromoBanner;