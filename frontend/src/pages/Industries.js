
import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

import NavbarOne from "../components/NavbarOne";
import FooterOne from "../components/FooterOne";
import SearchPopup from "../elements/SearchPopup";


const industries = [
  {
    id: "01",
    title: "Manufacturing & Industrial",
    image: "/assets/img/indus-ve-01.jpg",
    description:
      "Electrical solutions for industrial operations, power distribution and equipment protection.",
  },
  {
    id: "02",
    title: "Commercial Buildings",
    image: "/assets/img/indus-ve-02.jpg",
    description:
      "Reliable electrical infrastructure for offices, retail spaces and commercial developments.",
  },
  {
    id: "03",
    title: "Infrastructure & Utilities",
    image: "/assets/img/indus-ve-03.jpg",
    description:
      "Dependable electrical products supporting infrastructure and utility requirements.",
  },
  {
    id: "04",
    title: "Healthcare & Hospitality",
    image: "/assets/img/indus-ve-04.jpg",
    description:
      "Electrical distribution and protection solutions for healthcare and hospitality facilities.",
  },
  {
    id: "05",
    title: "IT & Data Infrastructure",
    image: "/assets/img/indus-ve-05.jpg",
    description:
      "Power monitoring, distribution and protection for connected facilities.",
  },
  {
    id: "06",
    title: "Renewable Energy",
    image: "/assets/img/indus-ve-06.jpg",
    description:
      "Energy monitoring and electrical components for renewable energy applications.",
  },
];

const Industries = () => {
  return (
    <>
      <SearchPopup />
      <NavbarOne />

      {/* ================================
          INDUSTRIES PAGE BANNER
          SAME AS ABOUT PAGE
      ================================= */}

      <div
        className="breadcrumb-area bg-overlay-2 ve-about-banner"
        style={{
          backgroundImage:
            'url("/assets/img/industries-banner.jpg")',
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="breadcrumb-inner">
                <div className="section-title mb-0">
                  <h1 className="page-title">
                    Industries We Serve
                  </h1>

                  <ul className="page-list">
                    <li>
                      <Link to="/">Home</Link>
                    </li>
                    <li className="ps-0">
                      Industries
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================
          INDUSTRIES INTRODUCTION
      ================================= */}

      <section className="ve-industries-page">
        <div className="container">

          <div className="ve-industries-heading">
            <span className="ve-industries-eyebrow">
              INDUSTRIES WE SERVE
            </span>

            <h2>
              Electrical Solutions for{" "}
              <span>Every Industry.</span>
            </h2>

            <p>
              Vector Engineers provides reliable electrical
              products and solutions to support industrial,
              commercial and infrastructure requirements.
              Our focus is on safety, performance and
              practical solutions for diverse applications.
            </p>
          </div>

          {/* INDUSTRY IMAGE GRID */}


{/* INDUSTRY IMAGE GRID - NO LINKS */}

<div className="ve-industries-grid">
  {industries.map((industry, index) => (
    <div
      key={industry.id}
      className="ve-industry-tile"
      style={{
        animationDelay: `${index * 0.08}s`,
      }}
    >
      {/* INDUSTRY IMAGE */}
      <img
        src={industry.image}
        alt={industry.title}
        loading="lazy"
      />

      {/* IMAGE OVERLAY */}
      <div className="ve-industry-tile-overlay" />

      {/* INDUSTRY CONTENT */}
      <div className="ve-industry-tile-content">
        <div className="ve-industry-tile-text">
          <h3>{industry.title}</h3>
          <p>{industry.description}</p>
        </div>
      </div>
    </div>
  ))}
</div>


        </div>
      </section>


      <FooterOne />
    </>
  );
};

export default Industries;
