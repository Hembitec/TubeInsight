import { Check } from 'lucide-react';
import Link from 'next/link';

interface PricingCardProps {
  title: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
  popular?: boolean;
}

export function PricingCard({
  title,
  price,
  period,
  description,
  features,
  ctaText,
  ctaLink,
  popular = false,
}: PricingCardProps) {
  return (
    <div className={`relative rounded-2xl ${popular ? 'border-2 border-blue-500' : 'border border-gray-800'}`}>
      {popular && (
        <div className="absolute -top-5 left-0 right-0 flex justify-center">
          <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
            Most Popular
          </div>
        </div>
      )}
      
      <div className="p-8">
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400 mb-4">{description}</p>
        
        <div className="flex items-baseline gap-1 mb-6">
          <span className="text-4xl font-bold text-white">{price}</span>
          {period && <span className="text-gray-400">{period}</span>}
        </div>
        
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3">
              <div className="flex-shrink-0 w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-blue-500" />
              </div>
              <span className="text-gray-300 text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        
        <Link
          href={ctaLink}
          className={`block w-full text-center py-3 px-4 rounded-lg font-medium transition-all duration-200
            ${popular 
              ? 'bg-blue-600 text-white hover:bg-blue-500' 
              : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
        >
          {ctaText}
        </Link>
      </div>
    </div>
  );
}
