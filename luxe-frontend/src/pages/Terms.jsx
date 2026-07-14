const sections = [
    {
        title: "1. Acceptance of Terms",
        body: "By accessing or using LUXE Store, you agree to be bound by these Terms of Service. If you do not agree, please do not use our site.",
    },
    {
        title: "2. Accounts",
        body: "You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. Please notify us immediately of any unauthorized use.",
    },
    {
        title: "3. Orders & Pricing",
        body: "All prices are listed in PKR and are subject to change without notice. We reserve the right to refuse or cancel any order, including in cases of pricing errors or suspected fraud.",
    },
    {
        title: "4. Payments",
        body: "We accept Cash on Delivery and secure card payments. By placing an order, you confirm that you are authorized to use the selected payment method.",
    },
    {
        title: "5. Shipping & Returns",
        body: "Shipping timelines and return eligibility are outlined on our Shipping & Returns page, which forms part of these Terms.",
    },
    {
        title: "6. Intellectual Property",
        body: "All content on LUXE Store, including text, graphics, logos, and images, is the property of LUXE Store and may not be used without permission.",
    },
    {
        title: "7. Limitation of Liability",
        body: "LUXE Store is not liable for any indirect, incidental, or consequential damages arising from your use of the site or products purchased through it.",
    },
    {
        title: "8. Changes to These Terms",
        body: "We may revise these Terms from time to time. Continued use of the site after changes take effect constitutes your acceptance of the revised Terms.",
    },
];

const Terms = () => {
    return (
        <div className="min-h-screen bg-cream py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-12">
                    <p className="text-amber-500 text-xs tracking-[0.2em] uppercase font-medium mb-3">
                        Legal
                    </p>
                    <h1 className="font-display text-4xl sm:text-5xl font-bold text-navy-900">
                        Terms of Service
                    </h1>
                    <p className="text-stone-500 mt-4">
                        Last updated: January 2026. Please read these terms carefully
                        before using LUXE Store.
                    </p>
                </div>

                <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-10 space-y-8">
                    {sections.map(({ title, body }) => (
                        <div key={title}>
                            <h2 className="font-display text-lg sm:text-xl font-bold text-navy-900 mb-2">
                                {title}
                            </h2>
                            <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
                                {body}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Terms;
