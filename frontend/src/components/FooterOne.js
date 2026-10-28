
import React, { useEffect, useRef, useState } from "react";

import {
  FaArrowRight,
  FaArrowUp,
  FaPhoneAlt,
  FaEnvelope,
  FaWhatsapp,
  FaBolt,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

import { Link } from "react-router-dom";

/* ==========================================
   VECTOR ENGINEERS - FOOTER DATA
========================================== */

const quickLinks = [
  { title: "Home", link: "/" },
  { title: "About Us", link: "/about" },
  { title: "Industries", link: "/industries" },
  { title: "Applications", link: "/applications" },
  { title: "Our Brands", link: "/brands" },
  { title: "Contact Us", link: "/contact" },
];

const solutionLinks = [
  {
    title: "Energy Metering",
    link: "/products/energy-metering",
  },
  {
    title: "Switchgear & Protection",
    link: "/products/switchgear-protection",
  },
  {
    title: "Wires & Cables",
    link: "/products/wires-cables",
  },
  {
    title: "Control & Automation",
    link: "/products/control-automation",
  },
  {
    title: "Villas",
    link: "/residential/villas",
  },
  {
    title: "High-Rise Apartments",
    link: "/residential/high-rise-apartments",
  },
];

/*
  Enter the actual company social URLs below.
  Icons without a configured URL remain visible
  but are not clickable.
*/


const socialLinks = [
  {
    name: "Facebook",
    icon: <FaFacebookF />,
    url: "",
    className: "facebook",
  },
  {
    name: "Instagram",
    icon: <FaInstagram />,
    url: "",
    className: "instagram",
  },
  {
    name: "LinkedIn",
    icon: <FaLinkedinIn />,
    url: "",
    className: "linkedin",
  },
  {
    name: "YouTube",
    icon: <FaYoutube />,
    url: "",
    className: "youtube",
  },
];


const contact = {
  phone1: "+91 94910 73449",
  phone2: "+91 91004 26268",

  // Confirm this address before publishing.
  email: "info@vectorengineers.com",

  // Confirm this number is enabled on WhatsApp.
  whatsapp: "919491073449",
};

/* ==========================================
   MAIN FOOTER
========================================== */

const FooterOne = () => {
  const year = new Date().getFullYear();

  const footerRef = useRef(null);

  const [footerVisible, setFooterVisible] = useState(false);
  const [showBackTop, setShowBackTop] = useState(false);

  /* ==========================================
     SCROLL REVEAL ANIMATION
  ========================================== */

  useEffect(() => {
    const element = footerRef.current;

    if (!element) return;

    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      setFooterVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFooterVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.05,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  /* ==========================================
     BACK TO TOP VISIBILITY
  ========================================== */

  useEffect(() => {
    const handleScroll = () => {
      setShowBackTop(window.scrollY > 350);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* ==========================================
     SCROLL TO TOP
  ========================================== */

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  const whatsappMessage =
    "Hello Vector Engineers, I would like to enquire about your electrical products and solutions.";

  const whatsappUrl =
    `https://wa.me/${contact.whatsapp}?text=` +
    encodeURIComponent(whatsappMessage);

  return (
    <>
      {/* ==========================================
          VECTOR ENGINEERS - FOOTER
      ========================================== */}

      <footer
        ref={footerRef}
        className={`footer-area ve-footer ${
          footerVisible ? "ve-footer-visible" : ""
        }`}
      >

        {/* ======================================
            TOP CTA SECTION
        ====================================== */}

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
                to="/contact"
                className="ve-footer-cta-btn"
              >
                Get a Quote
                <FaArrowRight />
              </Link>

            </div>
          </div>
        </div>

        {/* ======================================
            MAIN FOOTER
        ====================================== */}

        <div className="ve-footer-main">
          <div className="container">
            <div className="row gy-5">

              {/* COMPANY INFORMATION */}

              <div className="col-xl-4 col-lg-4 col-md-6">
                <div className="ve-footer-about ve-footer-reveal">

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

                    <span>
                      Powering Progress.
                      <br />
                      Engineering Reliability.
                    </span>
                  </div>

                </div>
              </div>

              {/* QUICK LINKS */}

              <div className="col-xl-2 col-lg-2 col-md-6">
                <div className="ve-footer-widget ve-footer-reveal">

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

              {/* OUR SOLUTIONS */}

              <div className="col-xl-3 col-lg-3 col-md-6">
                <div className="ve-footer-widget ve-footer-reveal">

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

              {/* ==================================
                  GET IN TOUCH - UPDATED
              ================================== */}

              <div className="col-xl-3 col-lg-3 col-md-6">
                <div className="ve-footer-widget ve-footer-contact ve-footer-reveal">

                  <h4>Get in Touch</h4>

                  {/* PHONE NUMBERS */}

                  <div className="ve-footer-contact-item">
                    <span className="ve-footer-contact-icon">
                      <FaPhoneAlt />
                    </span>

                    <div>
                      <h5>Call Us</h5>

                      <a href="tel:+919491073449">
                        {contact.phone1}
                      </a>

                      <a href="tel:+919100426268">
                        {contact.phone2}
                      </a>
                    </div>
                  </div>

                  {/* EMAIL */}

                  <div className="ve-footer-contact-item">
                    <span className="ve-footer-contact-icon">
                      <FaEnvelope />
                    </span>

                    <div>
                      <h5>Email Us</h5>

                      <a href={`mailto:${contact.email}`}>
                        {contact.email}
                      </a>
                    </div>
                  </div>

                  {/* SOCIAL MEDIA */}

                  
{/* SOCIAL MEDIA */}

<div className="ve-footer-social-block">
  <h5>Follow Us</h5>

  <div className="ve-footer-social-links">

    {socialLinks.map((social) =>
      social.url ? (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`ve-footer-social-icon ${social.className}`}
          aria-label={`Visit our ${social.name} page`}
          title={social.name}
        >
          {social.icon}
        </a>
      ) : (
        <span
          key={social.name}
          className={`ve-footer-social-icon ${social.className}`}
          title={`${social.name} profile coming soon`}
          aria-label={`${social.name} profile coming soon`}
        >
          {social.icon}
        </span>
      )
    )}

  </div>
</div>


                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ======================================
            FOOTER BOTTOM
        ====================================== */}

        <div className="ve-footer-bottom">
          <div className="container">

            <div className="ve-footer-bottom-inner">

              <p>
                © {year} Vector Engineers.
                All Rights Reserved.
              </p>

              <div className="ve-footer-bottom-links">

                <Link to="#">
                  Privacy Policy
                </Link>

                <span className="ve-footer-separator" />

                <Link to="#">
                  Terms & Conditions
                </Link>

              </div>

            </div>
          </div>
        </div>

      </footer>

      {/* ==========================================
          FLOATING WHATSAPP BUTTON
      ========================================== */}

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="ve-floating-whatsapp"
        aria-label="Enquire with Vector Engineers on WhatsApp"
        title="Chat on WhatsApp"
      >
        <FaWhatsapp />

        <span className="ve-whatsapp-tooltip">
          Chat with Us
        </span>
      </a>

      {/* ==========================================
          SEPARATE BACK TO TOP BUTTON
      ========================================== */}


    </>
  );
};

export default FooterOne;
