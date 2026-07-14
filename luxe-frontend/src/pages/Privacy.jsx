const sections = [
    {
        title: "1. Information We Collect",
        body: "When you create an account, place an order, or contact us, we collect information such as your name, email address, phone number, shipping address, and payment details. We also automatically collect basic usage data to help us improve the site.",
    },
    {
        title: "2. How We Use Your Information",
        body: "We use your information to process orders, provide customer support, personalize your shopping experience, and communicate updates about your account or orders. We do not sell your personal information to third parties.",
    },
    {
        title: "3. Payment Information",
        body: "Card payments are processed securely through Stripe. LUXE Store does not store your full card number or CVV on its servers.",
    },
    {
        title: "4. Cookies",
        body: "We use cookies and similar technologies to keep you logged in, remember your cart, and understand how the site is used so we can improve it over time.",
    },
    {
        title: "5. Data Sharing",
        body: "We may share information with trusted service providers (such as payment processors and delivery partners) solely to fulfill your orders, and only to the extent necessary.",
    },
    {
        title: "6. Your Rights",
        body: "You can review and update your personal information at any time from your Profile page. You may also request account deletion by contacting our support team.",
    },
    {
        title: "7. Changes to This Policy",
        body: "We may update this policy from time to time. Continued use of LUXE Store after changes are posted constitutes acceptance of the updated policy.",
    },
];

const Privacy = () => {
    return (
        <div className="min-h-screen bg-cream py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-12">
                    <p className="text-amber-500 text-xs tracking-[0.2em] uppercase font-medium mb-3">
                        Legal
                    </p>
                    <h1 className="font-display text-4xl sm:text-5xl font-bold text-navy-900">
                        Privacy Policy
                    </h1>
                    <p className="text-stone-500 mt-4">
                        Last updated: January 2026. This policy explains how LUXE Store
                        collects, uses, and protects your information.
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

export default Privacy;
