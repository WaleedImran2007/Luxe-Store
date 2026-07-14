import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
    {
        q: "How long does shipping take?",
        a: "Orders are typically processed within 1-2 business days and delivered within 3-7 business days nationwide, depending on your location.",
    },
    {
        q: "What payment methods do you accept?",
        a: "We accept Cash on Delivery as well as secure card payments through Stripe. You can choose your preferred method at checkout.",
    },
    {
        q: "Can I returnp- or exchange an item?",
        a: "Yes. Unused items in their original condition can be returned within 14 days of delivery. Visit our Shipping & Returns page for full details.",
    },
    {
        q: "How do I track my order?",
        a: "Once your order is placed, you can view its status anytime from the 'My Orders' section of your account.",
    },
    {
        q: "How do I change or cancel my order?",
        a: "Reach out to our support team as soon as possible via the Contact page. We can make changes as long as the order hasn't shipped yet.",
    },
    {
        q: "Do you offer international shipping?",
        a: "Currently we only ship within Pakistan. We're working on expanding to more regions soon.",
    },
    {
        q: "Is my payment information secure?",
        a: "Yes. All card payments are processed securely through Stripe — we never store your card details on our servers.",
    },
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <div className="min-h-screen bg-cream py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <p className="text-amber-500 text-xs tracking-[0.2em] uppercase font-medium mb-3">
                        Support
                    </p>
                    <h1 className="font-display text-4xl sm:text-5xl font-bold text-navy-900">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-stone-500 mt-4">
                        Can't find what you're looking for?{" "}
                        <a href="/contact" className="text-amber-600 hover:text-amber-700 font-medium">
                            Contact our team
                        </a>
                        .
                    </p>
                </div>

                <div className="space-y-3">
                    {faqs.map((item, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={item.q}
                                className="bg-white rounded-xl border border-stone-200 overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? -1 : index)}  
                                    className="w-full flex items-center justify-between gap-4 text-left px-5 sm:px-6 py-5"
                                >
                                    <span className="font-semibold text-navy-900">{item.q}</span>
                                    <ChevronDown
                                        size={20}
                                        className={`shrink-0 text-stone-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-amber-500" : ""
                                            }`}
                                    />
                                </button>

                                <div
                                    className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                        }`}
                                >
                                    <div className="overflow-hidden">
                                        <p className="px-5 sm:px-6 pb-5 text-stone-600 leading-relaxed text-sm sm:text-base">
                                            {item.a}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default FAQ;
