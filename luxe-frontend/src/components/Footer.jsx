import { Link } from 'react-router-dom'
import { Instagram, Twitter, Linkedin, Github, Mail, Phone, MapPin } from 'lucide-react'

const footerLinks = {
  Shop: [
    { label: 'New Arrivals', path: '/shop?filter=new' },
    { label: 'Best Sellers', path: '/shop?filter=bestsellers' },
    { label: 'Sale', path: '/shop?filter=sale' },
    { label: 'All Products', path: '/shop' },
  ],
  Support: [
    { label: 'FAQ', path: '/faq' },
    { label: 'Shipping & Returns', path: '/shipping' },
    { label: 'Size Guide', path: '/size-guide' },
    { label: 'Contact Us', path: '/contact' },
  ],
  Company: [
    { label: 'About LUXE', path: '/about' },
    { label: 'Sustainability', path: '/sustainability' },
    { label: 'Careers', path: '/careers' },
    { label: 'Press', path: '/press' },
  ],
}

const socials = [
  {
    Icon: Instagram, href: 'https://www.instagram.com/waleedimran.07/', label: 'Instagram'
  },

  {
    Icon: Twitter, href: 'https://twitter.com/waleedimran07', label: 'Twitter'
  },

  {
    Icon: Linkedin, href: 'https://www.linkedin.com/in/waleed-imran-00ba01358/', label: 'Linkedin'
  },

  {
    Icon: Github, href: 'https://github.com/WaleedImran2007', label: 'Github'
  },
]

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-cream">

      {/* Newsletter Strip */}
      <div className="border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <p className="section-label text-amber-400 mb-2">Stay in the loop</p>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-cream">
                Get early access to new arrivals
              </h3>
              <p className="text-stone-400 text-sm mt-2">No spam. Unsubscribe anytime.</p>
            </div>
            <div className="flex w-full max-w-md gap-0">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-navy-800 border border-navy-700 text-cream placeholder-stone-500 px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
              <button className="bg-amber-500 hover:bg-amber-600 text-navy-900 font-semibold px-6 py-3 text-sm tracking-wide uppercase transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-amber-500 flex items-center justify-center">
                <span className="font-display text-navy-900 font-bold text-lg leading-none">L</span>
              </div>
              <span className="font-display text-2xl font-bold text-cream tracking-tight">LUXE</span>
            </Link>
            <p className="text-stone-400 text-sm leading-relaxed max-w-xs">
              Premium lifestyle products crafted for those who appreciate quality over quantity. Est. 2019.
            </p>
            <div className="mt-6 flex flex-col gap-3 text-sm text-stone-400">
              <a href="mailto:hello@luxestore.com" className="flex items-center gap-2 hover:text-amber-400 transition-colors">
                <Mail size={15} />
                hello@luxestore.com
              </a>
              <a href="tel:+18005550100" className="flex items-center gap-2 hover:text-amber-400 transition-colors">
                <Phone size={15} />
                +1 (800) 555-0100
              </a>
              <span className="flex items-center gap-2">
                <MapPin size={15} />
                New York, NY 10001
              </span>
            </div>
            <div className="flex items-center gap-4 mt-7">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 border border-navy-700 flex items-center justify-center text-stone-400 hover:text-amber-400 hover:border-amber-400 transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-amber-400 mb-5">
                {heading}
              </h4>
              <ul className="flex flex-col gap-3">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm text-stone-400 hover:text-cream transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <span>© {new Date().getFullYear()} LUXE Store. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-stone-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-stone-300 transition-colors">Terms of Service</Link>
          </div>
          {/* Payment Icons */}
          <div className="flex items-center gap-2">
            {['VISA', 'MC', 'AMEX', 'PayPal'].map(brand => (
              <span key={brand} className="px-2 py-1 border border-navy-700 text-[10px] font-bold text-stone-500 tracking-wider">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
