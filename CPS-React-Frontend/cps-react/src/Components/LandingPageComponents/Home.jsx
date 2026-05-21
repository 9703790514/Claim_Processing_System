import React from 'react'
import './Home.css'
import Family from '../../assets/Family.jpg'

const Home = () => {
  return (
    <>


<div id='home' className="home">

  <div className="banner">
    <div className="banner-text">
      <h1>India's First Standalone Health Insurance Company</h1>
      <p>
        Trusted by millions, we provide comprehensive health coverage and a seamless claim experience across India.
      </p>
    </div>
    <div className="banner-image">
      <img src={Family} />
    </div>
  </div>

  <div className="highlights">
    <div className="highlight-cards">
      <div className="highlight-card">
        <h3>Pan India Presence</h3>
        <p>Serving customers nationwide with a robust network and seamless access to health services.</p>
      </div>
      <div className="highlight-card">
        <h3>6000+ Hospital Network</h3>
        <p>Avail cashless hospitalization and reimbursement at over 6000 hospitals across India.</p>
      </div>
      <div className="highlight-card">
        <h3>Award-Winning Claims Service</h3>
        <p>Recognized as "Claims Service Company of the Year" for hassle-free, customer-friendly settlements.</p>
      </div>
      <div className="highlight-card">
        <h3>24x7 Medical Advice</h3>
        <p>Get free medical advice and expert doctor consultation anytime, anywhere.</p>
      </div>
    </div>
  </div>

</div>


    
    </>
  )
}

export default Home



