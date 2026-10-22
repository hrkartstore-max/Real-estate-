"use client";

import { useMemo, useState } from "react";

const inr = value => new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
}).format(Number.isFinite(value) ? value : 0);

export default function MortgageCalculator({ priceLakh = 0 }) {
  const [downPayment, setDownPayment] = useState(20);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);
  const price = Math.max(0, Number(priceLakh) || 0) * 100000;
  const down = price * downPayment / 100;
  const principal = Math.max(0, price - down);
  const months = years * 12;
  const monthlyRate = rate / 1200;
  const emi = useMemo(() => {
    if (!principal || !months) return 0;
    if (!monthlyRate) return principal / months;
    const factor = Math.pow(1 + monthlyRate, months);
    return principal * monthlyRate * factor / (factor - 1);
  }, [principal, months, monthlyRate]);
  const totalPayment = emi * months;
  const totalInterest = Math.max(0, totalPayment - principal);

  return <section className="mortgage-calculator" aria-labelledby="mortgage-title">
    <div className="mortgage-heading">
      <p className="eyebrow dark">PLAN YOUR BUDGET</p>
      <h2 id="mortgage-title">Home loan <em>estimator.</em></h2>
      <p>Estimate your monthly EMI using the property asking price. Actual bank terms and eligibility may differ.</p>
    </div>
    <div className="mortgage-layout">
      <div className="mortgage-controls">
        <label className="mortgage-control">
          <span>Down payment <strong>{downPayment}%</strong></span>
          <input type="range" min="10" max="80" step="5" value={downPayment} onChange={e => setDownPayment(Number(e.target.value))} />
          <small>{inr(down)} down payment</small>
        </label>
        <label className="mortgage-control">
          <span>Interest rate <strong>{rate.toFixed(1)}% p.a.</strong></span>
          <input type="range" min="6" max="15" step="0.25" value={rate} onChange={e => setRate(Number(e.target.value))} />
          <small>Adjust to match a lender's quoted rate</small>
        </label>
        <label className="mortgage-control">
          <span>Loan tenure <strong>{years} years</strong></span>
          <input type="range" min="5" max="30" step="5" value={years} onChange={e => setYears(Number(e.target.value))} />
          <small>{months} monthly instalments</small>
        </label>
      </div>
      <div className="mortgage-result">
        <small>ESTIMATED MONTHLY EMI</small>
        <strong className="mortgage-emi">{inr(emi)}</strong>
        <div className="mortgage-result-row"><span>Property asking price</span><b>{inr(price)}</b></div>
        <div className="mortgage-result-row"><span>Loan amount</span><b>{inr(principal)}</b></div>
        <div className="mortgage-result-row"><span>Total interest</span><b>{inr(totalInterest)}</b></div>
        <div className="mortgage-result-row mortgage-total"><span>Total paid over tenure</span><b>{inr(totalPayment + down)}</b></div>
        <a className="button mortgage-cta" href="#enquiry">Ask about this property <span>↗</span></a>
      </div>
    </div>
    <p className="mortgage-disclaimer">Illustration only, not a loan offer or financial advice. Excludes stamp duty, registration, insurance, taxes and lender fees.</p>
  </section>;
}
