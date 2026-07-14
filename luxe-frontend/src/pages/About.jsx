import { Link } from "react-router-dom";
import { ShieldCheck, Sparkles, Truck, Users } from "lucide-react";
import Reveal from "../components/Reveal.jsx";

const values = [
    {
        icon: Sparkles,
        title: "Curated Quality",
        desc: "Every product in our catalog is hand-picked for craftsmanship, durability, and timeless design.",
    },
    {
        icon: ShieldCheck,
        title: "Trusted & Secure",
        desc: "Safe checkout, transparent pricing, and a team that stands behind every order.",
    },
    {
        icon: Truck,
        title: "Reliable Delivery",
        desc: "Nationwide shipping with tracking, so you always know where your order is.",
    },
    {
        icon: Users,
        title: "Customer First",
        desc: "Our support team is here to help before, during, and after your purchase.",
    },
];

const About = () => {
    return (
        <div className="min-h-screen bg-cream">
            {/* Hero */}
            <Reveal>
                <div className="bg-navy-900 text-cream">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
                        <p className="section-label text-amber-400 mb-3 text-xs tracking-[0.2em] uppercase font-medium">
                            Our Story
                        </p>
                        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
                            Premium lifestyle,
                            <br className="hidden sm:block" /> made accessible.
                        </h1>
                        <p className="text-stone-300 mt-6 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
                            LUXE Store was founded on a simple idea: quality shouldn't be
                            complicated to find. Since 2019, we've been sourcing premium
                            apparel, tech, and accessories for people who appreciate the
                            details.
                        </p>
                    </div>
                </div>
            </Reveal>

            {/* Values */}
            <Reveal>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {values.map(({ icon: Icon, title, desc }) => (
                            <div
                                key={title}
                                className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 hover:shadow-lg transition-shadow"
                            >
                                <div className="w-12 h-12 rounded-xl bg-navy-900 flex items-center justify-center mb-5">
                                    <Icon size={20} className="text-amber-400" />
                                </div>
                                <h3 className="font-display text-lg font-bold text-navy-900 mb-2">
                                    {title}
                                </h3>
                                <p className="text-sm text-stone-600 leading-relaxed">
                                    {desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </Reveal>

            {/* Mission */}
            <Reveal>
                <div className="border-t border-stone-200 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
                        <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-900 mb-5">
                            Our Mission
                        </h2>
                        <p className="text-stone-600 leading-relaxed text-base sm:text-lg">
                            We believe great products shouldn't require compromise. From the
                            moment you browse to the moment your order arrives, we work to
                            make every step feel effortless — thoughtfully designed
                            products, honest pricing, and support you can actually reach.
                        </p>
                        <Link
                            to="/shop"
                            className="inline-block mt-8 px-8 py-3 bg-navy-900 text-cream rounded-md font-medium hover:bg-amber-500 hover:text-navy-900 transition-colors"
                        >
                            Explore the Shop
                        </Link>
                    </div>
                </div>
            </Reveal>


        </div >
    );
};

export default About;
