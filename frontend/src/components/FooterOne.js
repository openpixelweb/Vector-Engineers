
import React from "react";
import {
  FaArrowRight,
  FaArrowUp,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaEnvelope,
  FaWhatsapp,
  FaBolt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const quickLinks = [
  { title: "Home", link: "/" },
  { title: "About Us", link: "#" },
  { title: "Industries", link: "#" },
  { title: "Applications", link: "#" },
  { title: "Our Brands", link: "#" },
  { title: "Contact Us", link: "#" },
];

const solutionLinks = [
  {
    title: "Energy Metering",
    link: "#",
  },
  {
    title: "Switchgear & Protection",
    link: "#",
  },
  {
    title: "Wires & Cables",
    link: "#",
  },
  {
    title: "Control & Automation",
    link: "#",
  },
  {
    title: "Villas",
    link: "#",
  },
  {
    title: "High-Rise Apartments",
    link: "#",
  },
];

const FooterOne = () => {
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <footer className="footer-area ve-footer">

        {/* TOP CTA SECTION */}
        <div className="ve-footer-cta">
          <div className="container">
            <div className="ve-footer-cta-inner">

              <div className="ve-footer-cta-content">
                <span className="ve-footer-eyebrow">
                  <FaBolt />
                  LET'S WORK TOGETHER
                </span>

                <h2>
                  Let's Power Your
                  <span> Next Project.</span>
                </h2>

                <p>
                  Looking for dependable electrical products
                  and solutions? Connect with our team to
                  discuss your project requirements.
                </p>
              </div>

              <Link
                to="#"
                className="ve-footer-cta-btn"
              >
                Get a Quote
                <FaArrowRight />
              </Link>

            </div>
          </div>
        </div>

        {/* MAIN FOOTER */}
        <div className="ve-footer-main">
          <div className="container">
            <div className="row gy-5">

              {/* COMPANY INFORMATION */}
              <div className="col-xl-4 col-lg-4 col-md-6">
                <div className="ve-footer-about">

                  <Link
                    to="/"
                    className="ve-footer-logo"
                    aria-label="Vector Engineers Homepage"
                  >
                    <img
                      src="/assets/img/logo.png"
                      alt="Vector Engineers"
                      loading="lazy"
                    />
                  </Link>

                  <p>
                    Vector Engineers provides electrical
                    products and application-focused solutions
                    for industrial, commercial and residential
                    requirements, supporting safer and more
                    efficient electrical systems.
                  </p>

                  <div className="ve-footer-tagline">
                    <span className="ve-footer-tagline-line" />
                    Powering Progress.
                    <br />
                    Engineering Reliability.
                  </div>

                  <a
                    href="https://wa.me/919491073449"
                    className="ve-footer-whatsapp"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Contact Vector Engineers on WhatsApp"
                  >
                    <FaWhatsapp />
                    Enquire on WhatsApp
                    <FaArrowRight />
                  </a>

                </div>
              </div>

              {/* QUICK LINKS */}
              <div className="col-xl-2 col-lg-2 col-md-6">
                <div className="ve-footer-widget">

                  <h4>Quick Links</h4>

                  <ul>
                    {quickLinks.map((item) => (
                      <li key={item.title}>
                        <Link to={item.link}>
                          <FaArrowRight />
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>

                </div>
              </div>

              {/* SOLUTIONS */}
              <div className="col-xl-3 col-lg-3 col-md-6">
                <div className="ve-footer-widget">

                  <h4>Our Solutions</h4>

                  <ul>
                    {solutionLinks.map((item) => (
                      <li key={item.title}>
                        <Link to={item.link}>
                          <FaArrowRight />
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/products"
                    className="ve-footer-all-products"
                  >
                    Explore All Products
                    <FaArrowRight />
                  </Link>

                </div>
              </div>

              {/* CONTACT DETAILS */}
              <div className="col-xl-3 col-lg-3 col-md-6">
                <div className="ve-footer-widget ve-footer-contact">

                  <h4>Get in Touch</h4>

                  <div className="ve-footer-contact-item">
                    <span className="ve-footer-contact-icon">
                      <FaMapMarkerAlt />
                    </span>

                    <div>
                      <h5>Office Address</h5>
                      <address>
                        #102, Plot No. 51, Road No. 7,
                        TMC, Mahindra Hills,
                        East Marredpally,
                        Secunderabad - 500026,
                        Telangana, India.
                      </address>
                    </div>
                  </div>

                  <div className="ve-footer-contact-item">
                    <span className="ve-footer-contact-icon">
                      <FaPhoneAlt />
                    </span>

                    <div>
                      <h5>Call Us</h5>

                      <a href="tel:+919491073449">
                        +91 94910 73449
                      </a>

                      <a href="tel:+919100426268">
                        +91 91004 26268
                      </a>
                    </div>
                  </div>

                  <div className="ve-footer-contact-item">
                    <span className="ve-footer-contact-icon">
                      <FaEnvelope />
                    </span>

                    <div>
                      <h5>Send an Enquiry</h5>
                      <Link to="/contact">
                        Contact Our Team
                      </Link>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>

        {/* FOOTER BOTTOM */}
        <div className="ve-footer-bottom">
          <div className="container">

            <div className="ve-footer-bottom-inner">

              <p>
                © {year} Vector Engineers.
                All Rights Reserved.
              </p>

              <div className="ve-footer-bottom-links">
                <Link to="/privacy-policy">
                  Privacy Policy
                </Link>

                <span className="ve-footer-separator" />

                <Link to="/terms-and-conditions">
                  Terms & Conditions
                </Link>
              </div>


            </div>

          </div>
        </div>

      </footer>
    </>
  );
};

export default FooterOne;
