import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div id='contact' className="contact-container">
      <div className="contact-info">
        <h2>Contact Us</h2>
        <p>
          <b>Email:</b> <a href="mailto:support@sunhealth.com">support@sunhealth.com</a>
        </p>
        <p>
          <b>Phone:</b> <a href="tel:+911234567890">+91 12345 67890</a>
        </p>
        <p>
          We’re here to help you with your health insurance queries. Fill out the form and our team will get back to you soon!
        </p>
      </div>
      <form className="contact-form" onSubmit={handleSubmit}>
        <label>
          Name
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Your Name"
          />
        </label>
        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="you@email.com"
          />
        </label>
        <label>
          Message
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            placeholder="How can we help you?"
            rows={5}
          ></textarea>
        </label>
        <button type="submit">Send Message</button>
        {submitted && <div className="contact-success">Thank you! Your message has been sent.</div>}
      </form>
    </div>
  );
};

export default Contact;
