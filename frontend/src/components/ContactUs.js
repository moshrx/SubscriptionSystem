import React from 'react';
import '../styles/contactUs.css';

const ContactUs = () => {
  return (
    <div className="contact-us">
      <h2>Contact Us</h2>
      <p>If you have any questions, concerns, or feedback, feel free to get in touch with us. We are here to help!</p>

      <div className="contact-info">
        <h3>Email Us</h3>
        <p>For general inquiries or support, email us at:</p>
        <p><a href="mailto:moshrxz@gmail.com">snailmail123@gmail.com</a></p>

        <h3>Call Us</h3>
        <p>Our customer service team is available by phone:</p>
        <p><a href="tel:+6479131487">+1 647 913 1234</a></p>

        <h3>Visit Us</h3>
        <p>If you prefer to visit us in person, you can find us at:</p>
        <p><strong>Queens College in Lambton College, Mississauga</strong></p>
      </div>

      <p>We look forward to hearing from you!</p>
    </div>
  );
};

export default ContactUs;
