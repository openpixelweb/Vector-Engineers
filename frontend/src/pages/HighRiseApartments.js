
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import {
  FaArrowRight,
  FaBolt,
  FaChartLine,
  FaShieldAlt,
  FaExchangeAlt,
  FaPlug,
  FaBuilding,
  FaHome,
  FaTint,
  FaCogs,
} from "react-icons/fa";

import NavbarOne from "../components/NavbarOne";
import FooterOne from "../components/FooterOne";
import FooterBottomOne from "../components/FooterBottomOne";
import SearchPopup from "../elements/SearchPopup";


/* ==========================================
   HIGH-RISE ELECTRICAL SOLUTIONS
========================================== */

const electricalSolutions = [
  {
    number: "01",
    title: "Individual Apartment Metering",
    icon: FaBolt,
    description:
      "Energy metering solutions for monitoring electricity consumption at individual apartment levels.",
    products:
      "Digital Energy Meters, Smart Meters and Prepaid Energy Meters",
  },
  {
    number: "02",
    title: "Common-Area Energy Monitoring",
    icon: FaChartLine,
    description:
      "Monitoring products for shared electrical loads, common facilities and building services.",
    products:
      "Multifunction Meters, Maximum Demand Controllers and Power Quality Meters",
  },
  {
    number: "03",
    title: "Power Distribution Systems",
    icon: FaBuilding,
    description:
      "Switching and distribution products for apartment buildings and shared electrical infrastructure.",
    products:
      "ACBs, MCCBs, MCBs and Distribution Boards",
  },
  {
    number: "04",
    title: "Electrical Safety & Protection",
    icon: FaShieldAlt,
    description:
      "Electrical protection products supporting fault detection and appropriate circuit protection.",
    products:
      "Earth Leakage Relays, CBCTs, RCCBs, RCBOs and Circuit Breakers",
  },
  {
    number: "05",
    title: "Automatic Power Source Changeover",
    icon: FaExchangeAlt,
    description:
      "Source switching products for electrical installations with alternate power supply arrangements.",
    products:
      "Automatic Transfer Switches, Manual Transfer Switches and ACCL Devices",
  },
  {
    number: "06",
    title: "Electrical Wiring & Connectivity",
    icon: FaPlug,
    description:
      "Wiring and cable products for residential distribution, building services and other applicable installations.",
    products:
      "PVC-FR Wires, FR-LSH Wires, HFFR Cables and Fire Alarm Cables",
  },
];

const applicationAreas = [
  {
    icon: FaHome,
    title: "Individual Apartments",
    description:
      "Energy metering, circuit protection and electrical distribution products for individual residences.",
  },
  {
    icon: FaBuilding,
    title: "Common Facilities",
    description:
      "Monitoring and distribution products for shared spaces and electrical loads.",
  },
  {
    icon: FaTint,
    title: "Water Pumping Systems",
    description:
      "Switching, motor protection and control components for applicable pump installations.",
  },
  {
    icon: FaCogs,
    title: "Building Power Infrastructure",
    description:
      "Electrical distribution, monitoring and source changeover components for building services.",
  },
];

const HighRiseApartments = () => {
  const pageRef = useRef(null);

  useEffect(() => {
    document.title =
      "High-Rise Apartments | Vector Engineers";

    const root = pageRef.current;
    if (!root) return;

    const elements = root.querySelectorAll(
      ".ve-hr-reveal"
    );

    if (!("IntersectionObserver" in window)) {
      elements.forEach((item) =>
        item.classList.add("is-visible")
      );
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
        threshold: 0.1,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    elements.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <SearchPopup />
      <NavbarOne />

      {/* ======================================
          COMMON PAGE BANNER
      ====================================== */}

      <div
        className="breadcrumb-area bg-overlay-2 ve-about-banner"
        style={{
          backgroundImage:
            'url("/assets/img/highrise-appartment-banner.jpg")',
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="breadcrumb-inner">
                <div className="section-title mb-0">
                  <h1 className="page-title">
                    High-Rise Apartments
                  </h1>

                  <ul className="page-list">
                    <li>
                      <Link to="/">Home</Link>
                    </li>
                    <li className="ps-0">
                      High-Rise Apartments
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="ve-highrise-page" ref={pageRef}>

        {/* ======================================
            01 - INTRODUCTION
        ====================================== */}

        <section className="ve-hr-intro">
          <div className="container">

            <div className="ve-hr-intro-layout">

              <div className="ve-hr-intro-content ve-hr-reveal">
                <span className="ve-hr-eyebrow">
                  RESIDENTIAL SOLUTIONS / HIGH-RISE APARTMENTS
                </span>

                <h2>
                  Powering Every Floor.
                  <span> Supporting Every Home.</span>
                </h2>

                <p className="ve-hr-intro-lead">
                  Dependable electrical products for
                  modern apartment communities.
                </p>

                <p>
                  High-rise residential developments
                  require effective electrical distribution,
                  energy monitoring and suitable protection
                  across individual apartments, common
                  areas and essential building services.
                </p>

                <p>
                  Vector Engineers offers electrical
                  products for metering, power distribution,
                  protection, monitoring and source
                  changeover to support a wide range
                  of residential project requirements.
                </p>

                <div className="ve-hr-intro-signature">
                  <span />
                  <strong>
                    Reliable Products for Connected Communities.
                  </strong>
                </div>
              </div>

              <div className="ve-hr-intro-image ve-hr-reveal">
                <img
                  src="/assets/img/highrise-appartment-01.jpg"
                  alt="Modern high-rise residential apartment buildings"
                  loading="lazy"
                />

                <div className="ve-hr-image-caption">
                  <span>RESIDENTIAL INFRASTRUCTURE</span>
                  <strong>
                    Solutions for Modern Apartment Living
                  </strong>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ======================================
            02 - SIX ELECTRICAL SOLUTIONS
        ====================================== */}

        <section className="ve-hr-solutions">
          <div className="container">

            <div className="ve-hr-section-heading ve-hr-reveal">
              <span className="ve-hr-eyebrow">
                OUR ELECTRICAL SOLUTIONS
              </span>

              <h2>
                Essential Electrical Products
                <span> for High-Rise Living.</span>
              </h2>

              <p>
                Explore products supporting individual
                metering, common-area monitoring, power
                distribution, electrical protection,
                source changeover and wiring.
              </p>
            </div>

            <div className="ve-hr-solutions-grid">
              {electricalSolutions.map(
                (solution, index) => {
                  const IconComponent = solution.icon;

                  return (
                    <article
                      className="ve-hr-solution ve-hr-reveal"
                      key={solution.number}
                      style={{
                        transitionDelay: `${
                          (index % 3) * 80
                        }ms`,
                      }}
                    >
                      <div className="ve-hr-solution-top">
                        

                        <span className="ve-hr-solution-icon">
                          <IconComponent aria-hidden="true" />
                        </span>
                      </div>

                      <h3>{solution.title}</h3>

                      <p>{solution.description}</p>

                      <div className="ve-hr-solution-products">
                        <span>RELEVANT PRODUCTS</span>
                        <strong>
                          {solution.products}
                        </strong>
                      </div>

                    </article>
                  );
                }
              )}
            </div>

          </div>
        </section>

        {/* ======================================
            03 - APPLICATION AREAS
        ====================================== */}

        <section className="ve-hr-areas">
          <div className="container">

            <div className="ve-hr-areas-layout">

              <div className="ve-hr-areas-image ve-hr-reveal">
                <img
                  src="/assets/img/highrise-appartment-02.jpg"
                  alt="Electrical distribution infrastructure for a multi-storey residential building"
                  loading="lazy"
                />

                <div className="ve-hr-areas-image-label">
                  <span>VECTOR ENGINEERS</span>
                  <strong>
                    Supporting Residential Infrastructure
                  </strong>
                </div>
              </div>

              <div className="ve-hr-areas-content ve-hr-reveal">

                <span className="ve-hr-eyebrow">
                  APPLICATION AREAS
                </span>

                <h2>
                  From Individual Apartments
                  <span> to Shared Infrastructure.</span>
                </h2>

                <p className="ve-hr-areas-description">
                  A high-rise residential development has
                  different electrical requirements across
                  individual residences, shared facilities
                  and building services. Our product range
                  supports suitable applications throughout
                  the development.
                </p>

                <div className="ve-hr-areas-list">
                  {applicationAreas.map((area) => {
                    const IconComponent = area.icon;

                    return (
                      <div
                        className="ve-hr-area-item"
                        key={area.title}
                      >
                        <span className="ve-hr-area-icon">
                          <IconComponent aria-hidden="true" />
                        </span>

                        <div>
                          <h3>{area.title}</h3>
                          <p>{area.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

            </div>

          </div>
        </section>


      </main>

      <FooterOne />
      <FooterBottomOne />
    </>
  );
};

export default HighRiseApartments;
