import React from 'react'
import './Services.css'

const Services = () => {
  return (
    <>
    <section id='services'>
    <div  className='services'>
        <div className="service-card cashless">
          <h2>Cashless Claim</h2>
          <ol>
            <li>Visit a network hospital and show your health card.</li>
            <li>The hospital sends pre-authorization to the insurer.</li>
            <li>Insurer approves the claim and settles bills directly with the hospital.</li>
            <li>You pay only non-covered expenses (if any).</li>
          </ol>
        </div>
        <div className="service-card reimbursement">
          <h2>Reimbursement Claim</h2>
          <ol>
            <li>Get treated at any hospital of your choice.</li>
            <li>Pay all medical bills at discharge.</li>
            <li>Submit claim form and documents to the insurer.</li>
            <li>Insurer verifies and reimburses eligible expenses to your account.</li>
          </ol>
        </div>
      </div>
      </section>
    </>
  )
}

export default Services