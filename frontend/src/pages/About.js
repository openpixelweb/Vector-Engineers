
import React, { Fragment, Suspense } from "react";
import { Link } from "react-router-dom";

import {
  FaArrowRight,
  FaBolt,
  FaShieldAlt,
  FaCogs,
  FaHeadset,
  FaCheck,
} from "react-icons/fa";

import Preloader from "../elements/Preloader";



const FooterOne = React.lazy(() =>
  import("../components/FooterOne")
);

const NavbarOne = React.lazy(() =>
  import("../components/NavbarOne")
);

const SearchPopup = React.lazy(() =>
  import("../elements/SearchPopup")
);

const About = () => {


  const strengths = [
    {
      icon: <FaBolt />,
      title: "Electrical Product Expertise",
      description:
        "Practical guidance for selecting suitable electrical products.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Quality & Reliability",
      description:
        "Dependable products for safe and efficient electrical systems.",
    },
    {
      icon: <FaCogs />,
      title: "Comprehensive Solutions",
      description:
        "Products for industrial, commercial and residential needs.",
    },
    {
      icon: <FaHeadset />,
      title: "Customer-Focused Support",
      description:
        "Responsive assistance for project-specific requirements.",
    },
  ];

  return (
    <Fragment>
      <Suspense fallback={<Preloader />}>

        {/* Search Popup */}
        <SearchPopup />

        {/* Navbar */}
        <NavbarOne />

        {/* =====================================
            ABOUT PAGE BANNER
        ===================================== */}

        
{/* ==========================================
    VECTOR ENGINEERS - ABOUT PAGE BANNER
========================================== */}

<div
  className="breadcrumb-area bg-overlay-2 ve-about-banner"
  style={{
    backgroundImage:
      'url("/assets/img/about-banner.jpg")',
  }}
>
  <div className="container">
    <div className="row justify-content-center">
      <div className="col-lg-12">

        <div className="breadcrumb-inner">
          <div className="section-title mb-0">

            {/* PAGE TITLE */}
            <h1 className="page-title">
              About Us
            </h1>

            {/* BREADCRUMB */}
            <ul className="page-list">
              <li>
                <Link to="/">Home</Link>
              </li>

              <li className="ps-0">
                About Us
              </li>
            </ul>

          </div>
        </div>

      </div>
    </div>
  </div>
</div>

{/* ABOUT BANNER END */}


        {/* =====================================
            SECTION 02 - WHO WE ARE
        ===================================== */}

        <section className="ve-about-company">
          <div className="container">
            <div className="row align-items-center gy-5">

              {/* LEFT IMAGES */}
              <div className="col-lg-6">
                <div className="ve-about-company-visual">

                  <div className="ve-about-main-photo">
                    <img
                      src="/assets/img/about-engineering.jpg"
                      alt="Electrical engineering installation"
                      loading="lazy"
                    />
                  </div>

                  <div className="ve-about-secondary-photo">
                    <img
                      src="/assets/img/about-switchgear.jpg"
                      alt="Electrical switchgear equipment"
                      loading="lazy"
                    />
                  </div>

                  <div className="ve-about-visual-label">
                    <span className="ve-about-label-icon">
                      <FaBolt />
                    </span>

                    <span>
                      <strong>Electrical Expertise</strong>
                      <small>
                        Solutions for Every Requirement
                      </small>
                    </span>
                  </div>

                </div>
              </div>

              {/* RIGHT CONTENT */}
              <div className="col-lg-6">
                <div className="ve-about-company-content">

                  <div className="ve-about-section-label">
                    <span />
                    WHO WE ARE
                  </div>

                  <h2>
                    Built on Trust.
                    <br />
                    <span>Driven by Expertise.</span>
                  </h2>

                  <p className="ve-about-intro">
                    Vector Engineers provides reliable
                    electrical products and solutions for
                    industrial, commercial and residential
                    requirements.
                  </p>

                  <p className="ve-about-description">
                    With a focus on product quality, technical
                    knowledge and customer satisfaction, we
                    help businesses, contractors and project
                    developers identify electrical products
                    suited to their specific needs.
                  </p>

                  <p className="ve-about-description">
                    Our product portfolio supports power
                    distribution, energy metering, electrical
                    protection, control, automation and other
                    essential electrical infrastructure
                    applications.
                  </p>

                  {/* CORE STRENGTHS */}
                  <div className="ve-about-strengths">
                    {strengths.map((item, index) => (
                      <div
                        className="ve-about-strength"
                        key={index}
                      >
                        <div className="ve-about-strength-icon">
                          {item.icon}
                        </div>

                        <div>
                          <h4>{item.title}</h4>
                          <p>{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="ve-about-commitment">
                    <FaCheck />
                    <span>
                      Your Requirements. Our Expertise.
                      Reliable Solutions.
                    </span>
                  </div>

                  <Link
                    to="/contact"
                    className="ve-about-company-btn"
                  >
                    Talk to Our Team
                    <FaArrowRight />
                  </Link>

                </div>
              </div>

            </div>
          </div>
        </section>




        
{/* =============================================
    SECTION 03 - OUR VISION & MISSION
============================================= */}

<section className="ve-purpose-section">
  <div className="container">

    {/* SECTION INTRODUCTION */}
    <div className="row align-items-end ve-purpose-heading">
      <div className="col-lg-7">
        <div className="ve-purpose-label">
          <span className="ve-purpose-label-line"></span>
          OUR PURPOSE & COMMITMENT
        </div>

        <h2>
          Driven by Purpose.
          <br />
          <span>Committed to Excellence.</span>
        </h2>
      </div>

      <div className="col-lg-5">
        
      </div>
    </div>

    {/* MAIN SPLIT LAYOUT */}
    <div className="row g-0 ve-purpose-main">

      {/* LEFT PHOTOGRAPH */}
      <div className="col-lg-5">
        <div className="ve-purpose-visual">

          <img
            src="/assets/img/vision-mission.jpg"
            alt="Electrical engineering and power distribution infrastructure"
            loading="lazy"
          />

          <div className="ve-purpose-photo-overlay">
            <span className="ve-purpose-photo-line"></span>
            <p>
              Supporting progress through dependable
              electrical technologies.
            </p>
          </div>

        </div>
      </div>

      {/* RIGHT CONTENT */}
      <div className="col-lg-7">
        <div className="ve-purpose-content">

          {/* VISION */}
          <div className="ve-purpose-item">
            <div className="ve-purpose-number">
              01
            </div>

            <div className="ve-purpose-item-body">
              <span className="ve-purpose-item-label">
                WHERE WE ASPIRE TO BE
              </span>

              <h3>Our Vision</h3>

              <p>
                To become a trusted and preferred
                electrical solutions partner, empowering
                industries, businesses and residential
                developments with safe, efficient and
                reliable electrical technologies.
              </p>
            </div>
          </div>

          {/* DIVIDER */}
          <div className="ve-purpose-item-divider"></div>

          {/* MISSION */}
          <div className="ve-purpose-item">
            <div className="ve-purpose-number">
              02
            </div>

            <div className="ve-purpose-item-body">
              <span className="ve-purpose-item-label">
                HOW WE DELIVER VALUE
              </span>

              <h3>Our Mission</h3>

              <p>
                To provide quality electrical products
                and application-focused solutions by
                combining technical knowledge,
                dependable product choices and
                responsive customer support, helping
                customers achieve their project
                requirements with confidence.
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>

    {/* BOTTOM COMMITMENT STRIP */}
    <div className="ve-purpose-bottom">
      <div className="ve-purpose-bottom-content">
        <span>OUR COMMITMENT</span>

        <h4>
          Reliable Products.
          <span> Practical Solutions.</span>
          Lasting Partnerships.
        </h4>
      </div>

      <div className="ve-purpose-bottom-mark">
        VE
      </div>
    </div>

  </div>
</section>


        {/* Footer */}
        <FooterOne />

      </Suspense>
    </Fragment>
  );
};

export default About;
