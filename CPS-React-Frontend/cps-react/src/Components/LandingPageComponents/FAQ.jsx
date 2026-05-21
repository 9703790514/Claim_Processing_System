import React, { useState } from 'react';
import './FAQ.css';

const questions = [
  {
    q: "What is a standalone health insurance company?",
    a: "A standalone health insurance company focuses exclusively on health insurance products and services, offering specialized expertise and a wider range of health plans."
  },
  {
    q: "How do I file a cashless claim?",
    a: "Visit a network hospital, present your health card, and the hospital will coordinate directly with us for pre-authorization and settlement."
  },
  {
    q: "What documents are needed for reimbursement claims?",
    a: "You'll need the claim form, hospital bills, discharge summary, prescriptions, and payment receipts. Submit these online or at our branch."
  },
  {
    q: "Is there a waiting period for pre-existing diseases?",
    a: "Yes, most policies have a waiting period (typically 2–4 years) for pre-existing conditions. Check your policy document for specific details."
  },
  {
    q: "Can senior citizens buy health insurance?",
    a: "Absolutely! Our Red Carpet plan is specially designed for senior citizens aged 60–69, with easy enrollment and no pre-policy medical tests."
  },
  {
    q: "How can I renew my policy?",
    a: "You can renew your policy online through our portal, via our mobile app, or at any of our branches across India."
  },
  {
    q: "What is the claim settlement ratio?",
    a: "Our claim settlement ratio is 69% (2013–14), reflecting our commitment to prompt and fair claim processing."
  },
  {
    q: "Are maternity expenses covered?",
    a: "Some plans offer maternity coverage after a waiting period. Please refer to your specific policy or contact support for details."
  },
  {
    q: "How do I contact customer support?",
    a: "You can call our 24x7 helpline, email support@sunhealth.com, or use the live chat feature on our website."
  },
  {
    q: "Can I buy insurance for my family?",
    a: "Yes, we offer family floater plans that provide comprehensive coverage for all family members under a single policy."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = idx => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div id='faq' className="faq-container">
      <h2 className="faq-title">Frequently Asked Questions</h2>
      <div className="faq-list">
        {questions.map((item, idx) => (
          <div
            className={`faq-item${openIndex === idx ? ' open' : ''}`}
            key={idx}
            onClick={() => toggle(idx)}
            tabIndex={0}
            onKeyPress={e => (e.key === "Enter" ? toggle(idx) : null)}
          >
            <div className="faq-question">
              <span>{item.q}</span>
              <span className="faq-icon">{openIndex === idx ? '−' : '+'}</span>
            </div>
            <div
              className="faq-answer"
              style={{
                maxHeight: openIndex === idx ? '200px' : '0px',
                opacity: openIndex === idx ? 1 : 0,
                padding: openIndex === idx ? '1rem' : '0 1rem'
              }}
            >
              {item.a}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
