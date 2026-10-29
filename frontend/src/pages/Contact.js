
import React, { Fragment, Suspense, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp,
  FaCheckCircle,
  FaPaperPlane,
} from "react-icons/fa";

import Preloader from "../elements/Preloader";

const FooterBottomOne = React.lazy(() =>
  import("../components/FooterBottomOne")
);
const FooterOne = React.lazy(() =>
  import("../components/FooterOne")
);
const NavbarOne = React.lazy(() =>
  import("../components/NavbarOne")
);
const SearchPopup = React.lazy(() =>
  import("../elements/SearchPopup")
);

const officeAddress =
  "#102, Plot No. 51, Road No. 7, TMC, Mahindra Hills, East Marredpally, Secunderabad - 500026, Telangana, India";

const contactNumber = "919491073449";

const initialForm = {
  name: "",
  company: "",
  email: "",
  phone: "",
  enquiryType: "",
  message: "",
};

const Contact = () => {
  const [form, setForm] = useState(initialForm);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const enquiry = [
      "Hello Vector Engineers,",
      "",
      "I would like to enquire about electrical products or solutions.",
      "",
      `Name: ${form.name}`,
      `Company: ${form.company || "Not provided"}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      `Enquiry Type: ${form.enquiryType}`,
      "",
      "Requirement:",
      form.message,
    ].join("\n");

    const whatsappUrl =
      `https://wa.me/${contactNumber}?text=` +
      encodeURIComponent(enquiry);

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <Fragment>
      <Suspense fallback={<Preloader />}>
        <SearchPopup />
        <NavbarOne />

        {/* =========================================
            CONTACT PAGE BANNER
        ========================================= */}
        
{/* ==========================================
    VECTOR ENGINEERS - CONTACT PAGE BANNER
========================================== */}

<div
  className="breadcrumb-area bg-overlay-2 ve-about-banner"
  style={{
    backgroundImage:
      'url("/assets/img/contact-banner.jpg")',
  }}
>
  <div className="container">
    <div className="row justify-content-center">
      <div className="col-lg-12">

        <div className="breadcrumb-inner">
          <div className="section-title mb-0">

            {/* PAGE TITLE */}
            <h1 className="page-title">
              Contact Us
            </h1>

            {/* BREADCRUMB */}
            <ul className="page-list">
              <li>
                <Link to="/">Home</Link>
              </li>

              <li className="ps-0">
                Contact Us
              </li>
            </ul>

          </div>
        </div>

      </div>
    </div>
  </div>
</div>

{/* CONTACT PAGE BANNER END */}

        {/* =========================================
            CONTACT INTRO + CONTACT INFORMATION
        ========================================= */}
        <section className="ve-contact-intro-section">
          <div className="container">

            <div className="row align-items-end gy-4">
              <div className="col-lg-7">

                <div className="ve-contact-eyebrow">
                  <span />
                  WE'RE HERE TO HELP
                </div>

                <h2 className="ve-contact-section-title">
                  The Right Electrical Solutions
                  <span> Start with a Conversation.</span>
                </h2>

              </div>

              <div className="col-lg-5">
                <p className="ve-contact-intro-text">
                  Whether you are exploring electrical
                  products, planning an installation or
                  sourcing products for an ongoing project,
                  we're here to understand your requirements.
                </p>
              </div>
            </div>

            {/* CONTACT DETAILS */}
            <div className="row gy-4 ve-contact-info-row">

              <div className="col-lg-5 col-md-6">
                <div className="ve-contact-info-item">

                  <div className="ve-contact-info-icon">
                    <FaMapMarkerAlt />
                  </div>

                  <div>
                    <span className="ve-contact-info-label">
                      OUR OFFICE
                    </span>

                    <h3>Visit Our Office</h3>

                    <p>
                      {officeAddress}
                    </p>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        officeAddress
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Get Directions <FaArrowRight />
                    </a>
                  </div>

                </div>
              </div>

              <div className="col-lg-4 col-md-6">
                <div className="ve-contact-info-item">

                  <div className="ve-contact-info-icon">
                    <FaPhoneAlt />
                  </div>

                  <div>
                    <span className="ve-contact-info-label">
                      CALL OUR TEAM
                    </span>

                    <h3>Talk to Us Directly</h3>

                    <a
                      className="ve-contact-phone"
                      href="tel:+919491073449"
                    >
                      +91 94910 73449
                    </a>

                    <a
                      className="ve-contact-phone"
                      href="tel:+919100426268"
                    >
                      +91 91004 26268
                    </a>

                  </div>

                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="ve-contact-info-item">

                  <div className="ve-contact-info-icon">
                    <FaWhatsapp />
                  </div>

                  <div>
                    <span className="ve-contact-info-label">
                      QUICK ENQUIRY
                    </span>

                    <h3>WhatsApp Enquiry</h3>

                    <p>
                      Share your product or project
                      requirements with our team.
                    </p>

                    <a
                      href={`https://wa.me/${contactNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Start Conversation <FaArrowRight />
                    </a>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </section>

        {/* =========================================
            PROJECT ENQUIRY SECTION
        ========================================= */}
        <section className="ve-contact-enquiry-section">
          <div className="container">

            <div className="row g-0 ve-contact-enquiry-layout">

              {/* LEFT PHOTOGRAPH PANEL */}
              <div className="col-lg-5">
                <div className="ve-contact-enquiry-visual">

                  <img
                    src="/assets/img/contact-01.jpg"
                    alt="Industrial electrical engineering equipment"
                    loading="lazy"
                  />

                  <div className="ve-contact-enquiry-visual-content">

                    <span className="ve-contact-image-label">
                      YOUR ELECTRICAL SOLUTIONS PARTNER
                    </span>

                    <h2>
                      Every Great Project
                      Begins with the
                      Right Connection.
                    </h2>

                    <p>
                      Supporting electrical product
                      requirements across industrial,
                      commercial and residential projects.
                    </p>

                    <div className="ve-contact-visual-line" />

                    <div className="ve-contact-visual-points">
                      <span>
                        <FaCheckCircle />
                        Product Enquiries
                      </span>
                      <span>
                        <FaCheckCircle />
                        Project Requirements
                      </span>
                      <span>
                        <FaCheckCircle />
                        Technical Product Guidance
                      </span>
                    </div>

                  </div>
                </div>
              </div>

              {/* RIGHT ENQUIRY FORM */}
              <div className="col-lg-7">
                <div className="ve-contact-form-panel">

                  <span className="ve-contact-form-label">
                    PROJECT & PRODUCT ENQUIRIES
                  </span>

                  <h2>Tell Us What You Need.</h2>

                  <p className="ve-contact-form-description">
                    Fill in your details and share your
                    electrical product or project requirements.
                    We'll prepare your enquiry for WhatsApp.
                  </p>

                  <form onSubmit={handleSubmit}>

                    <div className="row g-3">

                      <div className="col-md-6">
                        <label htmlFor="ve-name">
                          Full Name *
                        </label>
                        <input
                          id="ve-name"
                          type="text"
                          name="name"
                          placeholder="Enter your full name"
                          autoComplete="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label htmlFor="ve-company">
                          Company / Organization
                        </label>
                        <input
                          id="ve-company"
                          type="text"
                          name="company"
                          placeholder="Company name"
                          autoComplete="organization"
                          value={form.company}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-6">
                        <label htmlFor="ve-email">
                          Email Address *
                        </label>
                        <input
                          id="ve-email"
                          type="email"
                          name="email"
                          placeholder="Enter your email"
                          autoComplete="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label htmlFor="ve-phone">
                          Phone Number *
                        </label>
                        <input
                          id="ve-phone"
                          type="tel"
                          name="phone"
                          placeholder="Enter your phone number"
                          autoComplete="tel"
                          value={form.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-12">
                        <label htmlFor="ve-enquiry-type">
                          Enquiry Type *
                        </label>

                        <select
                          id="ve-enquiry-type"
                          name="enquiryType"
                          value={form.enquiryType}
                          onChange={handleChange}
                          required
                        >
                          <option value="">
                            Select enquiry type
                          </option>

                          <option value="Product Enquiry">
                            Product Enquiry
                          </option>

                          <option value="Industrial Requirement">
                            Industrial Requirement
                          </option>

                          <option value="Commercial Project">
                            Commercial Project
                          </option>

                          <option value="Residential Project">
                            Residential Project
                          </option>

                          <option value="Technical Assistance">
                            Technical Assistance
                          </option>

                          <option value="Other">
                            Other
                          </option>
                        </select>
                      </div>

                      <div className="col-12">
                        <label htmlFor="ve-message">
                          Your Requirements *
                        </label>

                        <textarea
                          id="ve-message"
                          name="message"
                          rows="5"
                          placeholder="Tell us about the products or electrical solutions you're looking for..."
                          value={form.message}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-12">
                        <button
                          type="submit"
                          className="ve-contact-submit-btn"
                        >
                          <FaPaperPlane />
                          Continue on WhatsApp
                          <FaArrowRight />
                        </button>

                        <p className="ve-contact-form-note">
                          This opens WhatsApp with your enquiry
                          pre-filled. Please press Send in
                          WhatsApp to complete your enquiry.
                        </p>
                      </div>

                    </div>

                  </form>

                </div>
              </div>

            </div>

          </div>
        </section>

        {/* =========================================
            MAP SECTION
        ========================================= */}
        <section className="ve-contact-location-section">

          <div className="container">

            <div className="ve-contact-location-heading">
              <div>
                <div className="ve-contact-eyebrow">
                  <span />
                  OUR LOCATION
                </div>

                <h2>
                  Find Us in <span>Secunderabad.</span>
                </h2>

                <p>
                  Visit Vector Engineers for business and
                  product-related discussions.
                </p>
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  officeAddress
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ve-contact-map-link"
              >
                Open in Google Maps
                <FaArrowRight />
              </a>
            </div>

          </div>

          <div className="ve-contact-map">
            <iframe
              title="Vector Engineers Office Location"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                officeAddress
              )}&output=embed`}
              width="100%"
              height="420"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

        </section>

        {/* FOOTERS */}
        <FooterOne />

      </Suspense>
    </Fragment>
  );
};

export default Contact;
