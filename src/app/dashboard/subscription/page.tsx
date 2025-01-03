'use client';

import { CreditCard, Check } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for getting started',
    features: [
      '5 video analyses per month',
      'Basic summaries',
      'Key takeaways',
    ],
    current: true,
  },
  {
    name: 'Pro',
    price: '$19.99',
    period: '/month',
    description: 'For power users who want unlimited access',
    features: [
      'Unlimited video summaries',
      'Advanced AI analysis',
      'Summaries',
      'Flashcards & quizzes',
      'Custom learning paths',
      'Export to PDF/Word',
    ],
    current: false,
  },
];

export default function SubscriptionPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <h1 className="text-2xl font-bold text-white">Subscription</h1>
        <p className="mt-2 text-gray-400">Choose the plan that works best for you</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-lg p-6 shadow-lg ${
                plan.current
                  ? 'bg-blue-600 ring-2 ring-blue-500'
                  : 'bg-gray-800'
              }`}
            >
              {plan.current && (
                <span className="absolute -top-2 -right-2 rounded-full bg-blue-500 px-3 py-0.5 text-xs font-medium text-white">
                  Current Plan
                </span>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className={`mt-1 text-sm ${plan.current ? 'text-blue-100' : 'text-gray-400'}`}>
                    {plan.description}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">{plan.price}</p>
                  <p className={`text-sm ${plan.current ? 'text-blue-100' : 'text-gray-400'}`}>
                    {plan.period}
                  </p>
                </div>
              </div>
              <ul className="mt-6 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className={`h-5 w-5 flex-shrink-0 ${plan.current ? 'text-blue-300' : 'text-blue-500'}`} />
                    <span className={`ml-3 text-sm ${plan.current ? 'text-blue-100' : 'text-gray-300'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                className={`mt-8 w-full rounded-lg px-4 py-2 text-sm font-medium ${
                  plan.current
                    ? 'bg-white text-blue-600 hover:bg-blue-50'
                    : 'bg-blue-600 text-white hover:bg-blue-500'
                }`}
              >
                {plan.current ? 'Current Plan' : 'Upgrade to Pro'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
