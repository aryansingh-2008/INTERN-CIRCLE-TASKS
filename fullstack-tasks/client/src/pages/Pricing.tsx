import React, { useState } from 'react';
import { Check, Sparkles, HelpCircle, ArrowRight, ShieldCheck, X } from 'lucide-react';

export const Pricing: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [checkoutDone, setCheckoutDone] = useState(false);

  const plans = [
    {
      id: 'basic',
      name: 'Starter',
      badge: 'Individual',
      monthlyPrice: 15,
      yearlyPrice: 12,
      desc: 'Essential developer tools for students and individuals building side projects.',
      features: [
        'Up to 5 active repositories',
        'Standard build speed & bandwidth',
        'Basic community support',
        '100GB monthly data transfer',
        'Community forum access'
      ],
      notIncluded: [
        'Custom domain SSL certificates',
        'Dedicated API access & webhooks',
        '24/7 priority engineer support'
      ]
    },
    {
      id: 'pro',
      name: 'Professional',
      badge: 'Most Popular',
      recommended: true,
      monthlyPrice: 39,
      yearlyPrice: 31,
      desc: 'Complete power suite for professional fullstack engineers and startups.',
      features: [
        'Unlimited active repositories',
        'High-speed CI/CD pipelines',
        'Custom domain with auto-SSL',
        '500GB monthly bandwidth',
        'Automated daily database backups',
        'Priority email & ticket support',
        'Advanced API rate limit tier'
      ],
      notIncluded: []
    },
    {
      id: 'premium',
      name: 'Enterprise',
      badge: 'Teams & Scale',
      monthlyPrice: 99,
      yearlyPrice: 79,
      desc: 'Enterprise governance, custom SLAs, audit logs, and dedicated engineering assistance.',
      features: [
        'Everything in Professional',
        'Unlimited team collaborators',
        'Dedicated private SQLite/Postgres instances',
        '99.99% uptime guarantee SLA',
        'SOC2 & HIPAA compliance logs',
        '24/7 phone & Slack support',
        'Dedicated solutions architect'
      ],
      notIncluded: []
    }
  ];

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'INTERN20') {
      setDiscountApplied(true);
    } else {
      alert('Invalid promo code. Try "INTERN20" for an extra 20% discount!');
    }
  };

  const getPrice = (monthly: number, yearly: number) => {
    let p = isYearly ? yearly : monthly;
    if (discountApplied) p = p * 0.8;
    return Math.round(p);
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE]">
          <Sparkles className="w-3.5 h-3.5" /> PROJECT 03 — TRANSPARENT PRICING
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[#172033]">
          Simple, Predictable Plans for Developers
        </h1>
        <p className="text-xs text-[#64748B] max-w-lg mx-auto leading-relaxed">
          Start for free, scale with confidence. No surprise overage fees or hidden lock-ins.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3 pt-3">
          <span className={`text-xs font-medium ${!isYearly ? 'text-[#172033]' : 'text-slate-400'}`}>
            Monthly Billing
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className="w-12 h-6 bg-slate-200 rounded-full p-0.5 transition-colors focus:outline-none relative flex items-center"
          >
            <div
              className={`w-5 h-5 bg-[#2563EB] rounded-full transition-transform ${
                isYearly ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-xs font-medium flex items-center gap-1.5 ${isYearly ? 'text-[#172033]' : 'text-slate-400'}`}>
            Annual Billing
            <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded">
              Save ~20%
            </span>
          </span>
        </div>
      </div>

      {/* 3 Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const price = getPrice(plan.monthlyPrice, plan.yearlyPrice);
          return (
            <div
              key={plan.id}
              className={`scamshield-card p-6 flex flex-col justify-between relative transition-all ${
                plan.recommended
                  ? 'border-[#2563EB] shadow-md ring-1 ring-[#2563EB]/20 bg-white'
                  : 'bg-white hover:border-slate-300'
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2563EB] text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                  Recommended
                </div>
              )}

              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-[#172033]">{plan.name}</h3>
                    <div className="text-[11px] text-[#64748B]">{plan.badge}</div>
                  </div>
                </div>

                <div className="py-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-[#172033] font-mono">${price}</span>
                    <span className="text-xs text-slate-400">/ month</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {isYearly ? `Billed annually ($${price * 12}/yr)` : 'Billed monthly'}
                  </div>
                  <p className="text-xs text-[#64748B] mt-3 leading-relaxed">{plan.desc}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="text-[11px] font-semibold text-slate-800 uppercase tracking-wider">
                    Included Features:
                  </div>
                  <ul className="space-y-2 text-xs text-[#64748B]">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                    {plan.notIncluded.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-slate-300 line-through">
                        <X className="w-3.5 h-3.5 text-slate-300 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <button
                  onClick={() => {
                    setSelectedPlan(plan.name);
                    setCheckoutDone(false);
                  }}
                  className={`w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    plan.recommended
                      ? 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm'
                      : 'bg-white hover:bg-slate-50 text-[#172033] border border-[#E5E7EB]'
                  }`}
                >
                  <span>Select {plan.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature Comparison Matrix Table */}
      <section className="scamshield-card p-6 space-y-4">
        <h2 className="text-sm font-semibold text-[#172033] uppercase tracking-wider">
          Feature Comparison Matrix
        </h2>
        <div className="border border-slate-100 rounded-lg overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11px] text-slate-500 font-semibold uppercase">
                <th className="p-3">Capability</th>
                <th className="p-3 text-center">Starter</th>
                <th className="p-3 text-center text-blue-600 font-bold bg-blue-50/40">Professional</th>
                <th className="p-3 text-center">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-3 text-slate-800 font-medium">Monthly Bandwidth</td>
                <td className="p-3 text-center text-slate-500">100 GB</td>
                <td className="p-3 text-center font-semibold text-slate-800 bg-blue-50/20">500 GB</td>
                <td className="p-3 text-center text-slate-800">Unlimited</td>
              </tr>
              <tr>
                <td className="p-3 text-slate-800 font-medium">Custom Domains</td>
                <td className="p-3 text-center text-slate-400">1 Domain</td>
                <td className="p-3 text-center font-semibold text-slate-800 bg-blue-50/20">Unlimited</td>
                <td className="p-3 text-center text-slate-800">Unlimited + Dedicated IP</td>
              </tr>
              <tr>
                <td className="p-3 text-slate-800 font-medium">Automated Database Backups</td>
                <td className="p-3 text-center text-slate-400">Weekly</td>
                <td className="p-3 text-center font-semibold text-slate-800 bg-blue-50/20">Daily</td>
                <td className="p-3 text-center text-slate-800">Hourly Continuous</td>
              </tr>
              <tr>
                <td className="p-3 text-slate-800 font-medium">Support SLA</td>
                <td className="p-3 text-center text-slate-400">Community</td>
                <td className="p-3 text-center font-semibold text-slate-800 bg-blue-50/20">4hr Email SLA</td>
                <td className="p-3 text-center text-slate-800">15min 24/7 Phone SLA</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Interactive Checkout Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="scamshield-card p-6 bg-white max-w-md w-full space-y-5 relative shadow-xl">
            <button
              onClick={() => setSelectedPlan(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>

            {checkoutDone ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Subscription Confirmed!</h3>
                <p className="text-xs text-slate-500">
                  Your <strong className="text-slate-800">{selectedPlan}</strong> plan has been activated successfully.
                </p>
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="bg-[#2563EB] text-white text-xs font-semibold px-4 py-2 rounded-lg"
                >
                  Return to Dashboard
                </button>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Confirm {selectedPlan} Plan</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isYearly ? 'Annual Billing with ~20% discount' : 'Standard Monthly Billing'}
                  </p>
                </div>

                <div className="p-3.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Plan:</span>
                    <strong className="text-slate-900">{selectedPlan}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Billing Cycle:</span>
                    <span className="font-medium text-slate-900">{isYearly ? 'Annual (12 Months)' : 'Monthly'}</span>
                  </div>
                  {discountApplied && (
                    <div className="flex items-center justify-between text-emerald-600 font-medium">
                      <span>Promo Discount (INTERN20):</span>
                      <span>-20% Extra Off</span>
                    </div>
                  )}
                </div>

                {/* Promo Code Input */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">Promo Code (Optional)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="e.g. INTERN20"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 bg-white border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-xs uppercase font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setCheckoutDone(true)}
                  className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold py-2.5 rounded-lg transition-colors shadow-sm"
                >
                  Complete Checkout & Activate Plan
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
