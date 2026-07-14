import { Truck, RotateCcw, Clock, ShieldCheck } from "lucide-react";

const sections = [
    {
        icon: Truck,
        title: "Shipping",
        points: [
            "Orders are processed within 1-2 business days.",
            "Standard delivery takes 3-7 business days depending on your location within Pakistan.",
            "Free shipping on all orders over Rs. 15,000 — use code LUXE20 for an additional 20% off.",
            "You'll receive order status updates from your 'My Orders' page once your order ships.",
        ],
    },
    {
        icon: RotateCcw,
        title: "Returns & Exchanges",
        points: [
            "Items can be returned within 14 days of delivery if unused and in original packaging.",
            "To start a return, contact our support team with your order number.",
            "Exchanges are subject to stock availability at the time of request.",
            "Sale items are final sale and not eligible for return unless defective.",
        ],
    },
    {
        icon: Clock,
        title: "Refunds",
        points: [
            "Approved refunds for card payments are issued to your original payment method within 5-10 business days.",
            "Cash on Delivery orders are refunded via bank transfer after the returned item is received and inspected.",
        ],
    },
    {
        icon: ShieldCheck,
        title: "Damaged or Incorrect Items",
        points: [
            "If your order arrives damaged or incorrect, contact us within 48 hours of delivery.",
            "Please include photos of the item and packaging so we can resolve it quickly.",
        ],
    },
];

const Shipping = () => {
    return (
        <div className="min-h-screen bg-cream py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <p className="text-amber-500 text-xs tracking-[0.2em] uppercase font-medium mb-3">
                        Support
                    </p>
                    <h1 className="font-display text-4xl sm:text-5xl font-bold text-navy-900">
                        Shipping &amp; Returns
                    </h1>
                    <p className="text-stone-500 mt-4">
                        Everything you need to know about delivery, returns, and refunds.
                    </p>
                </div>

                <div className="space-y-6">
                    {sections.map(({ icon: Icon, title, points }) => (
                        <div
                            key={title}
                            className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8"
                        >
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-full bg-navy-900 flex items-center justify-center shrink-0">
                                    <Icon size={18} className="text-amber-400" />
                                </div>
                                <h2 className="font-display text-xl sm:text-2xl font-bold text-navy-900">
                                    {title}
                                </h2>
                            </div>

                            <ul className="space-y-3">
                                {points.map((point) => (
                                    <li key={point} className="flex gap-3 text-sm sm:text-base text-stone-600 leading-relaxed">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Shipping;
