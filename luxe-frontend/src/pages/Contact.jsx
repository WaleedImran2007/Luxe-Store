import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";

const contactInfo = [
    { icon: Mail, label: "hello@luxestore.com", href: "mailto:hello@luxestore.com" },
    { icon: Phone, label: "+1 (800) 555-0100", href: "tel:+18005550100" },
    { icon: MapPin, label: "New York, NY 10001", href: null },
];

const Contact = () => {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [errors, setErrors] = useState({});
    const [isSending, setIsSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSent(false);

        const newErrors = {};
        if (!form.name.trim()) newErrors.name = "Name is required";
        if (!form.email.trim()) newErrors.email = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Enter a valid email";
        if (!form.message.trim()) newErrors.message = "Message is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSending(true);

        // Opens the user's email client with the message pre-filled,
        // addressed to our support inbox.
        const subject = encodeURIComponent(`Message from ${form.name} via LUXE Store`);
        const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);

        setTimeout(() => {
            window.location.href = `mailto:hello@luxestore.com?subject=${subject}&body=${body}`;
            setIsSending(false);
            setSent(true);
            setForm({ name: "", email: "", message: "" });
        }, 600);
    };

    return (
        <div className="min-h-screen bg-cream py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <p className="text-amber-500 text-xs tracking-[0.2em] uppercase font-medium mb-3">
                        Get in Touch
                    </p>
                    <h1 className="font-display text-4xl sm:text-5xl font-bold text-navy-900">
                        Contact Us
                    </h1>
                    <p className="text-stone-500 mt-4 max-w-xl mx-auto">
                        Questions about an order, a product, or anything else? We'd love
                        to hear from you.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
                    {/* Info column */}
                    <div className="lg:col-span-2 space-y-4">
                        {contactInfo.map(({ icon: Icon, label, href }) => {
                            const content = (
                                <div className="flex items-center gap-4 bg-white rounded-xl border border-stone-200 p-5">
                                    <div className="w-11 h-11 rounded-full bg-navy-900 flex items-center justify-center shrink-0">
                                        <Icon size={18} className="text-amber-400" />
                                    </div>
                                    <span className="text-navy-900 font-medium break-all">{label}</span>
                                </div>
                            );

                            return href ? (
                                <a key={label} href={href} className="block hover:shadow-md transition-shadow rounded-xl">
                                    {content}
                                </a>
                            ) : (
                                <div key={label}>{content}</div>
                            );
                        })}

                        <div className="bg-navy-900 rounded-xl p-5 text-cream">
                            <h3 className="font-semibold mb-1">Support Hours</h3>
                            <p className="text-stone-300 text-sm">
                                Monday – Friday, 9:00 AM – 6:00 PM (PKT)
                            </p>
                        </div>
                    </div>

                    {/* Form column */}
                    <div className="lg:col-span-3 bg-white rounded-2xl border border-stone-200 p-6 sm:p-8">
                        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-navy-900">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Your name"
                                    className={`w-full px-4 py-3 rounded-lg border outline-none focus:ring-2 focus:ring-amber-200 transition ${errors.name ? "border-red-500" : "border-stone-300 focus:border-amber-500"
                                        }`}
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-navy-900">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className={`w-full px-4 py-3 rounded-lg border outline-none focus:ring-2 focus:ring-amber-200 transition ${errors.email ? "border-red-500" : "border-stone-300 focus:border-amber-500"
                                        }`}
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-navy-900">
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    rows="5"
                                    value={form.message}
                                    onChange={handleChange}
                                    placeholder="How can we help?"
                                    className={`w-full px-4 py-3 rounded-lg border outline-none resize-none focus:ring-2 focus:ring-amber-200 transition ${errors.message ? "border-red-500" : "border-stone-300 focus:border-amber-500"
                                        }`}
                                />
                                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                            </div>

                            {sent && (
                                <div className="flex items-center gap-2 text-green-600 text-sm">
                                    <CheckCircle2 size={16} />
                                    Your email client should now be open with your message ready to send.
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSending}
                                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg bg-navy-900 text-cream font-semibold hover:bg-amber-500 hover:text-navy-900 transition disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isSending ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-cream/40 border-t-cream rounded-full animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send size={16} />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
