import { Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react'

const features = [
  {
    Icon: Truck,
    title: 'Free Shipping',
    description: 'On all orders over $150. Express options available.',
  },
  {
    Icon: RotateCcw,
    title: '30-Day Returns',
    description: 'Not happy? Return anything within 30 days, no questions asked.',
  },
  {
    Icon: ShieldCheck,
    title: 'Lifetime Guarantee',
    description: 'Every product backed by our lifetime craftsmanship guarantee.',
  },
  {
    Icon: Headphones,
    title: 'Concierge Support',
    description: 'Real humans, available 7 days a week for personalized help.',
  },
]

const TrustBar = () => {
  return (
    <section className="border-t border-b border-stone-200 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-stone-200">
          {features.map(({ Icon, title, description }) => (
            <div key={title} className="flex items-start gap-4 lg:px-8 first:pl-0 last:pr-0">
              <div className="shrink-0 w-10 h-10 bg-amber-500/10 flex items-center justify-center">
                <Icon size={20} className="text-amber-500" />
              </div>
              <div>
                <h4 className="font-semibold text-navy-900 text-sm mb-1">{title}</h4>
                <p className="text-stone-500 text-xs leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustBar;