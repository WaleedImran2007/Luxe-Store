import { Link } from "react-router-dom";
import { ArrowRight } from 'lucide-react'

const Hero = () => {
    return <>
        <section className="relative bg-navy-900 overflow-hidden min-h-[85vh] flex items-center">
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600&q=80"
                    alt="Hero background"
                    className="w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-navy-900/95 via-navy-900/70 to-navy-900/20" />
            </div>

            {/* Content */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
                <div className="max-w-2xl">
                    <p className="section-label text-amber-400 mb-5 animate-fade-up">
                        Summer Collection 2025
                    </p>

                    <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-cream leading-[1.05] mb-6">
                        Dressed for
                        <span className="block italic text-amber-400">the moment.</span>
                    </h1>

                    <p className="text-stone-300 text-lg leading-relaxed mb-10 max-w-lg">
                        Premium pieces that transcend seasons. Crafted with intention, worn with purpose. Explore our curated edit of wardrobe essentials.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link to="/shop" className="btn-primary text-base px-8 py-4">
                            Shop the Collection
                            <ArrowRight size={18} />
                        </Link>
                        <Link to="/about" className="inline-flex items-center gap-2 text-cream hover:text-amber-400 transition-colors font-medium text-sm tracking-wide uppercase px-2 py-4">
                            Our Story
                            <ArrowRight size={16} />
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-8 mt-14 pt-8 border-t border-white/10">
                        {[
                            { value: '4.9★', label: 'Average Rating' },
                            { value: '12K+', label: 'Happy Customers' },
                            { value: '100%', label: 'Ethically Sourced' },
                        ].map(stat => (
                            <div key={stat.label}>
                                <p className="font-display text-2xl font-bold text-amber-400">{stat.value}</p>
                                <p className="text-xs text-stone-400 tracking-wide mt-0.5">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Decorative accent */}
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-amber-500 hidden lg:block" />
        </section>
    </>
}

export default Hero;