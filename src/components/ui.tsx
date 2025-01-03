import { Check, Star } from 'lucide-react';
import Link from 'next/link';

export function FeatureCard({ icon: Icon, title, description }: { 
  icon: any, 
  title: string, 
  description: string 
}) {
  return (
    <div className="p-6 rounded-2xl bg-gray-800/50 hover:bg-gray-800/70 transition-colors">
      <Icon className="w-12 h-12 text-blue-500 mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

export function Benefit({ icon: Icon, title, description }: {
  icon: any,
  title: string,
  description: string
}) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0">
        <Icon className="w-8 h-8 text-blue-500" />
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  );
}

export function PricingCard({ title, price, features, ctaText, ctaLink, popular }: {
  title: string,
  price: string,
  features: string[],
  ctaText: string,
  ctaLink: string,
  popular: boolean
}) {
  return (
    <div className={`p-8 rounded-2xl ${popular ? 'bg-blue-600' : 'bg-gray-800/50'} relative`}>
      {popular && (
        <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-sm font-semibold px-3 py-1 rounded-full">
          Most Popular
        </span>
      )}
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold">{price}</span>
        {price !== "Custom" && <span className="text-gray-400">/month</span>}
      </div>
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <Check className="w-5 h-5 text-blue-500" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Link
        href={ctaLink}
        className={`block text-center py-3 rounded-full font-semibold transition-colors ${
          popular
            ? 'bg-white text-blue-600 hover:bg-gray-100'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {ctaText}
      </Link>
    </div>
  );
}

export function Testimonial({ quote, author, role, rating }: {
  quote: string,
  author: string,
  role: string,
  rating: number
}) {
  return (
    <div className="p-6 rounded-2xl bg-gray-800/50">
      <div className="flex gap-1 mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
        ))}
      </div>
      <p className="text-gray-300 mb-4">{quote}</p>
      <div>
        <p className="font-semibold">{author}</p>
        <p className="text-gray-400 text-sm">{role}</p>
      </div>
    </div>
  );
}

export function Stat({ number, label }: { number: string, label: string }) {
  return (
    <div>
      <p className="text-3xl font-bold text-blue-500 mb-1">{number}</p>
      <p className="text-gray-400">{label}</p>
    </div>
  );
}
