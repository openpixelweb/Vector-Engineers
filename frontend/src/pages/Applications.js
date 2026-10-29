
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  FaShieldAlt,
  FaChartLine,
  FaCogs,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

import NavbarOne from "../components/NavbarOne";
import FooterOne from "../components/FooterOne";
import SearchPopup from "../elements/SearchPopup";


/* ==========================================
   APPLICATION DATA
========================================== */

const applications = [
  {
    id: "01",
    title: "Energy Monitoring & Management",
    shortTitle: "Energy Monitoring",
    description:
      "Measure consumption, monitor electrical parameters and support better energy management.",
    products:
      "Energy Meters, Multifunction Meters and Power Quality Meters",
  },
  {
    id: "02",
    title: "Power Distribution & Control",
    shortTitle: "Power Distribution",
    description:
      "Support organized and dependable distribution of electrical power across installations.",
    products:
      "ACBs, MCCBs, MCBs and Distribution Boards",
  },
  {
    id: "03",
    title: "Electrical Protection & Safety",
    shortTitle: "Electrical Protection",
    description:
      "Support circuit protection, earth leakage detection and electrical installation safety.",
    products:
      "Protection Relays, CBCTs, RCCBs and RCBOs",
  },
  {
    id: "04",
    title: "Power Source Changeover",
    shortTitle: "Source Changeover",
    description:
      "Manage switching between alternate electrical supplies for different power requirements.",
    products:
      "ACCL, Automatic Transfer Switches and Manual Transfer Switches",
  },
  {
    id: "05",
    title: "Motor Control & Protection",
    shortTitle: "Motor Control",
    description:
      "Support switching, control and protection of industrial electrical motors.",
    products:
      "MPCBs, Power Contactors and Overload Relays",
  },
  {
    id: "06",
    title: "Electrical Wiring & Connectivity",
    shortTitle: "Wiring & Connectivity",
    description:
      "Provide wiring and connectivity solutions for electrical and instrumentation systems.",
    products:
      "FR Wires, HFFR Cables and Instrumentation Cables",
  },
  {
    id: "07",
    title: "Critical Power Monitoring",
    shortTitle: "Critical Power",
    description:
      "Monitor essential electrical parameters in connected and critical facilities.",
    products:
      "Power Quality Meters, Multifunction Meters and Protection Devices",
  },
  {
    id: "08",
    title: "Residential Power Management",
    shortTitle: "Residential Power",
    description:
      "Support metering, electrical distribution and protection in modern residential developments.",
    products:
      "Smart Meters, MCBs, RCCBs and Changeover Devices",
  },
];

/* ==========================================
   APPLICATION ITEM
========================================== */

const ApplicationItem = ({
  application,
  activeId,
  onActivate,
  direction,
}) => {
  const isActive = activeId === application.id;

  return (
    <button
      type="button"
      className={`ve-app-item ve-app-item-${direction} ${
        isActive ? "is-active" : ""
      }`}
      onMouseEnter={() => onActivate(application.id)}
      onFocus={() => onActivate(application.id)}
      onClick={() => onActivate(application.id)}
      aria-pressed={isActive}
    >
      <span className="ve-app-item-number">
        {application.id}
      </span>

      <span className="ve-app-item-body">
        <span className="ve-app-item-title">
          {application.title}
        </span>

        <span className="ve-app-item-description">
          {application.description}
        </span>
      </span>

      <span
        className="ve-app-item-line"
        aria-hidden="true"
      />
    </button>
  );
};

/* ==========================================
   MAIN APPLICATIONS PAGE
========================================== */

const Applications = () => {
  const [activeId, setActiveId] = useState("01");

  const activeApplication =
    applications.find((item) => item.id === activeId) ||
    applications[0];

  useEffect(() => {
    document.title =
      "Electrical Applications | Vector Engineers";
  }, []);

  return (
    <>
      <SearchPopup />
      <NavbarOne />

      {/* ======================================
          PAGE BANNER
          SAME AS ABOUT / CONTACT / PRODUCTS
      ====================================== */}

      <div
        className="breadcrumb-area bg-overlay-2 ve-about-banner"
        style={{
          backgroundImage:
            'url("/assets/img/applications-banner.jpg")',
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="breadcrumb-inner">
                <div className="section-title mb-0">

                  <h1 className="page-title">
                    Our Applications
                  </h1>

                  <ul className="page-list">
                    <li>
                      <Link to="/">Home</Link>
                    </li>

                    <li className="ps-0">
                      Applications
                    </li>
                  </ul>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================
          EIGHT APPLICATIONS SECTION
          4 LEFT - 1 IMAGE - 4 RIGHT
      ====================================== */}

      <section className="ve-applications-section">
        <div className="container">

          {/* SECTION INTRO */}

          <div className="ve-applications-heading">
            <span className="ve-applications-eyebrow">
              WHERE OUR PRODUCTS MAKE A DIFFERENCE
            </span>

            <h2>
              Practical Electrical Solutions
              <br />
              <span>for Every Application.</span>
            </h2>

            <p>
              From energy monitoring and power distribution
              to electrical protection and control,
              Vector Engineers provides products suited
              to different electrical applications.
              Explore how our product range supports
              everyday operations and project needs.
            </p>
          </div>

          {/* THREE COLUMN LAYOUT */}

          <div className="ve-applications-layout">

            {/* LEFT FOUR APPLICATIONS */}

            <div className="ve-applications-column ve-applications-left">
              {applications.slice(0, 4).map((application) => (
                <ApplicationItem
                  key={application.id}
                  application={application}
                  activeId={activeId}
                  onActivate={setActiveId}
                  direction="left"
                />
              ))}
            </div>

            {/* CENTER MAIN IMAGE */}

            <div className="ve-applications-center">
              <div className="ve-applications-photo">

                <img
                  src="/assets/img/applications-main.jpg"
                  alt="Electrical engineer inspecting an industrial power distribution installation"
                />

                <div className="ve-applications-photo-shade" />

                <span className="ve-applications-photo-top">
                  VECTOR ENGINEERS
                  <span className="ve-photo-top-line" />
                  APPLICATIONS
                </span>

                {/* DYNAMIC HOVER CONTENT */}

                <div
                  className="ve-applications-photo-content"
                  key={activeApplication.id}
                  aria-live="off"
                >
                  <span className="ve-photo-application-number">
                    APPLICATION {activeApplication.id} / 08
                  </span>

                  <h3>
                    {activeApplication.title}
                  </h3>

                  <p>
                    {activeApplication.description}
                  </p>

                  <div className="ve-photo-products">
                    <strong>
                      Relevant Products
                    </strong>

                    <span>
                      {activeApplication.products}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT FOUR APPLICATIONS */}

            <div className="ve-applications-column ve-applications-right">
              {applications.slice(4, 8).map((application) => (
                <ApplicationItem
                  key={application.id}
                  application={application}
                  activeId={activeId}
                  onActivate={setActiveId}
                  direction="right"
                />
              ))}
            </div>

          </div>

          {/* BOTTOM DESCRIPTION */}

          <div className="ve-applications-bottom-note">
            <span className="ve-applications-note-line" />

            <p>
              Electrical applications vary by installation.
              Product suitability depends on the operating
              conditions and technical requirements of
              each project.
            </p>

            <span className="ve-applications-note-line" />
          </div>

        </div>
      </section>

      {/* ======================================
          EXISTING FEATURE THREE DESIGN
          STRUCTURE PRESERVED
      ====================================== */}

      <section className="ve-applications-feature">
        <div className="features-area style-02">
          <div className="container">
            <div className="row justify-content-start">

              {/* LEFT CONTENT */}

              <div className="col-lg-4 offset-lg-1 d-flex">
                <div className="section-title white text-left m-auto">

                  <span className="subtitles">
                    WHY VECTOR ENGINEERS
                  </span>

                  <h2 className="title active">
                    The Right Products
                    <br />
                    for the Right
                    <br />
                    Applications.
                  </h2>

                  <p className="des">
                    Every electrical installation has
                    different operating requirements.
                    Choosing suitable components helps
                    support system performance,
                    effective monitoring and electrical
                    safety.
                  </p>

                  <div className="btn-wrapper animated fadeInUpBig text-left">
                    <Link
                      to="/contact"
                      className="boxed-btn btn-bounce mt-3"
                    >
                      Contact Us
                      <FaArrowRight
                        style={{ marginLeft: "12px" }}
                      />
                    </Link>
                  </div>

                </div>
              </div>

              {/* RIGHT FEATURE BOXES */}

              <div className="col-lg-6">
                <div className="features-item">
                  <div className="row">

                    <div className="col-lg-6">

                      <div className="single-features-item">
                        <div className="icon">
                          <FaShieldAlt />
                        </div>

                        <h4>
                          Safety & Protection
                        </h4>
                      </div>

                      <div className="single-features-item">
                        <div className="icon">
                          <FaChartLine />
                        </div>

                        <h4>
                          Monitoring & Visibility
                        </h4>
                      </div>

                    </div>

                    <div className="col-lg-6 mg-top-60">

                      <div className="single-features-item">
                        <div className="icon">
                          <FaCogs />
                        </div>

                        <h4>
                          Operational Control
                        </h4>
                      </div>

                      <div className="single-features-item">
                        <div className="icon">
                          <FaCheckCircle />
                        </div>

                        <h4>
                          Application Suitability
                        </h4>
                      </div>

                    </div>

                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <FooterOne />
    </>
  );
};

export default Applications;
