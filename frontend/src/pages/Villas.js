
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaBolt,
  FaChartLine,
  FaShieldAlt,
  FaExchangeAlt,
  FaPlug,
} from "react-icons/fa";

import NavbarOne from "../components/NavbarOne";
import FooterOne from "../components/FooterOne";
import FooterBottomOne from "../components/FooterBottomOne";
import SearchPopup from "../elements/SearchPopup";


const villaSolutions = [
  {
    id: "01",
    title: "Reliable Power Distribution",
    short: "Power Distribution",
    icon: FaBolt,
    description:
      "Electrical distribution products for organizing and protecting circuits across modern villas.",
    products: "MCBs, MCCBs, Distribution Boards",
  },
  {
    id: "02",
    title: "Smart Energy Monitoring",
    short: "Energy Monitoring",
    icon: FaChartLine,
    description:
      "Digital metering options that help homeowners monitor electrical energy consumption.",
    products: "Digital Energy Meters, Smart Meters",
  },
  {
    id: "03",
    title: "Electrical Safety & Protection",
    short: "Safety & Protection",
    icon: FaShieldAlt,
    description:
      "Protective devices for appropriate circuit and residual-current protection applications.",
    products: "MCBs, RCCBs, RCBOs",
  },
  {
    id: "04",
    title: "Power Source Changeover",
    short: "Source Changeover",
    icon: FaExchangeAlt,
    description:
      "Switching products for residential installations with mains and alternate electrical supplies.",
    products: "Automatic Transfer Switches, Manual Transfer Switches",
  },
  {
    id: "05",
    title: "Quality Wiring Solutions",
    short: "Wires & Cables",
    icon: FaPlug,
    description:
      "Electrical wires and cables for different residential wiring and installation requirements.",
    products: "PVC-FR Wires, FR-LSH Wires, HFFR Cables",
  },
];

const Villas = () => {
  const [activeSolution, setActiveSolution] = useState(0);
  const sectionRef = useRef(null);

  const selected = villaSolutions[activeSolution];

  useEffect(() => {
    document.title =
      "Villas | Residential Solutions | Vector Engineers";
  }, []);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const elements = root.querySelectorAll(".ve-villa-reveal");

    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <SearchPopup />
      <NavbarOne />

      {/* ===================================
          COMMON PAGE BANNER
      =================================== */}

      <div
        className="breadcrumb-area bg-overlay-2 ve-about-banner"
        style={{
          backgroundImage:
            'url("/assets/img/villa-banner.jpg")',
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="breadcrumb-inner">
                <div className="section-title mb-0">
                  <h1 className="page-title">Villas</h1>

                  <ul className="page-list">
                    <li>
                      <Link to="/">Home</Link>
                    </li>
                    <li className="ps-0">
                      Villas
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="ve-villas-page" ref={sectionRef}>

        {/* ===================================
            SECTION 01 - VILLA INTRODUCTION
        =================================== */}

        <section className="ve-villa-intro">
          <div className="container">
            <div className="ve-villa-intro-layout">

              <div className="ve-villa-intro-content ve-villa-reveal">
                <span className="ve-villa-eyebrow">
                  RESIDENTIAL SOLUTIONS / VILLAS
                </span>

                <h2>
                  Smarter Electrical Solutions
                  <span> for Modern Villas.</span>
                </h2>

                <p className="ve-villa-lead">
                  Reliable power is an essential part of
                  comfortable, modern living.
                </p>

                <p>
                  From electrical distribution and circuit
                  protection to energy monitoring and
                  source changeover, Vector Engineers
                  offers electrical product options
                  for independent homes and villas.
                </p>

                <p>
                  Our focus is to help customers select
                  suitable electrical products for
                  residential installations based on
                  their requirements.
                </p>

                <div className="ve-villa-intro-line">
                  <span />
                  <strong>
                    Practical Products. Dependable Power.
                  </strong>
                </div>
              </div>

              <div className="ve-villa-intro-visual ve-villa-reveal">
                <div className="ve-villa-main-photo">
                  <img
                    src="/assets/img/villa.jpg"
                    alt="Modern independent villa with contemporary architecture"
                    loading="lazy"
                  />

                  <div className="ve-villa-photo-label">
                    <span>RESIDENTIAL SOLUTIONS</span>
                    <strong>Designed for Modern Living</strong>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ===================================
            SECTION 02 - FIVE SOLUTIONS
        =================================== */}

        <section className="ve-villa-solutions">
          <div className="container">

            <div className="ve-villa-section-heading ve-villa-reveal">
              <span className="ve-villa-eyebrow">
                ELECTRICAL APPLICATIONS FOR VILLAS
              </span>

              <h2>
                Essential Electrical Solutions
                <span> for Your Home.</span>
              </h2>

              <p>
                Explore electrical product applications
                supporting distribution, metering,
                protection, source switching and wiring
                in residential properties.
              </p>
            </div>

            <div className="ve-villa-solutions-layout">

              {/* LEFT - INTERACTIVE SOLUTION LIST */}

              <div className="ve-villa-solution-list ve-villa-reveal">
                {villaSolutions.map((solution, index) => {
                  const IconComponent = solution.icon;
                  const active = activeSolution === index;

                  return (
                    <button
                      key={solution.id}
                      type="button"
                      className={`ve-villa-solution-item ${
                        active ? "is-active" : ""
                      }`}
                      onMouseEnter={() => setActiveSolution(index)}
                      onFocus={() => setActiveSolution(index)}
                      onClick={() => setActiveSolution(index)}
                      aria-pressed={active}
                    >
                      <span className="ve-villa-solution-number">
                        {solution.id}
                      </span>

                      <span className="ve-villa-solution-icon">
                        <IconComponent aria-hidden="true" />
                      </span>

                      <span className="ve-villa-solution-text">
                        <strong>{solution.title}</strong>
                        <small>{solution.short}</small>
                      </span>

                      <FaArrowRight
                        className="ve-villa-solution-arrow"
                        aria-hidden="true"
                      />
                    </button>
                  );
                })}
              </div>

              {/* RIGHT - ONE PHOTOGRAPH + DYNAMIC DETAILS */}

              <div className="ve-villa-solution-visual ve-villa-reveal">
                <img
                  src="/assets/img/villa-01.jpg"
                  alt="Professional residential electrical distribution installation"
                  loading="lazy"
                />

                <div className="ve-villa-visual-shade" />

                <div className="ve-villa-visual-top">
                  <span>VECTOR ENGINEERS</span>
                  <span>RESIDENTIAL APPLICATIONS</span>
                </div>

                <div
                  className="ve-villa-visual-content"
                  key={selected.id}
                >
                  <span className="ve-villa-visual-number">
                    SOLUTION {selected.id} / 05
                  </span>

                  <h3>{selected.title}</h3>

                  <p>{selected.description}</p>

                  <div className="ve-villa-related-products">
                    <strong>RELEVANT PRODUCTS</strong>
                    <span>{selected.products}</span>
                  </div>
                </div>
              </div>

            </div>

            <p className="ve-villa-technical-note">
              Product selection and installation must be
              based on the property's electrical design,
              load requirements and applicable standards.
            </p>

          </div>
        </section>

      </main>

      <FooterOne />
      <FooterBottomOne />
    </>
  );
};

export default Villas;
