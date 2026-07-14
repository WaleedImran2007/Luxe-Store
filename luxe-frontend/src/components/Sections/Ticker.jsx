const items = [
  'Free Returns', 'Ethically Sourced', 'Lifetime Guarantee', 'Sustainably Made',
  'Carbon Neutral Shipping', 'Expert Craftsmanship', 'Free Returns', 'Ethically Sourced',
  'Lifetime Guarantee', 'Sustainably Made', 'Carbon Neutral Shipping', 'Expert Craftsmanship',
]

export default function Ticker() {
  return (
    <div className="bg-amber-500 py-3 overflow-hidden">
      <div className="ticker-track">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center gap-6 px-6 text-navy-900 font-semibold text-xs tracking-widest uppercase whitespace-nowrap">
            {item}
            <span className="w-1 h-1 rounded-full bg-navy-900/40 inline-block" />
          </span>
        ))}
      </div>
    </div>
  )
}
