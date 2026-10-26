
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaArrowUp, FaArrowRight } from "react-icons/fa";

const industries = [
  {
    id: "01",
    title: "Manufacturing & Industrial",
    description:
      "Electrical solutions for industrial operations, power distribution and equipment protection.",
    image: "/assets/img/indus-hm-01.jpg",
    link: "#",
  },
  {
    id: "02",
    title: "Commercial Buildings",
    description:
      "Reliable electrical infrastructure for offices, retail spaces and commercial developments.",
    image: "/assets/img/indus-hm-02.jpg",
    link: "#",
  },
  {
    id: "03",
    title: "Infrastructure & Utilities",
    description:
      "Dependable electrical products supporting infrastructure and utility requirements.",
    image: "/assets/img/indus-hm-03.jpg",
    link: "#",
  },
  {
    id: "04",
    title: "Healthcare & Hospitality",
    description:
      "Electrical distribution and protection solutions for healthcare and hospitality facilities.",
    image: "/assets/img/indus-hm-04.jpg",
    link: "#",
  },
  {
    id: "05",
    title: "IT & Data Infrastructure",
    description:
      "Power monitoring, distribution and protection for connected facilities.",
    image: "/assets/img/indus-hm-05.jpg",
    link: "#",
  },
  {
    id: "06",
    title: "Renewable Energy",
    description:
      "Energy monitoring and electrical components for renewable energy applications.",
    image: "/assets/img/indus-hm-06.jpg",
    link: "#",
  },
];

const IndustriesOne = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const elements = section.querySelectorAll(
      ".ve-ind-reveal"
    );

    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      elements.forEach((element) =>
        element.classList.add("ve-ind-visible")
      );
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(
              "ve-ind-visible"
            );

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px",
      }
    );

    elements.forEach((element) =>
      observer.observe(element)
    );

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="ve-industries"
      ref={sectionRef}
      aria-labelledby="ve-industries-title"
    >
      <div className="container">

        {/* SECTION HEADER */}
        <div className="ve-ind-header ve-ind-reveal">

          <div className="ve-ind-heading">

            <div className="ve-ind-eyebrow">
              <span className="ve-ind-line" />
              INDUSTRIES WE SERVE
            </div>

            <h2 id="ve-industries-title">
              Powering Industries.
              <br />
              <span>Enabling Progress.</span>
            </h2>

          </div>

          <div className="ve-ind-header-right">
            <p>
              Delivering dependable electrical products
              and solutions for industrial, commercial
              and infrastructure requirements.
            </p>

            <Link
              to="/industries"
              className="ve-ind-view-all"
            >
              Explore All Industries
              <FaArrowRight />
            </Link>
          </div>

        </div>

        {/* INDUSTRY GRID */}
        <div className="ve-ind-grid">

          {industries.map((industry, index) => (
            <Link
              key={industry.id}
              to={industry.link}
              className="ve-ind-card ve-ind-reveal"
              style={{
                "--reveal-delay": `${(index % 3) * 100}ms`,
              }}
              aria-label={`Explore ${industry.title}`}
            >

              {/* IMAGE */}
              <div className="ve-ind-image">

                <img
                  src={industry.image}
                  alt={industry.title}
                  loading="lazy"
                  decoding="async"
                />

                <div className="ve-ind-overlay" />

              </div>

              {/* CONTENT */}
              <div className="ve-ind-card-content">

                <span className="ve-ind-number">
                  {industry.id}
                </span>

                <div className="ve-ind-card-bottom">
                  <div className="ve-ind-card-text">

                    <h3>{industry.title}</h3>

                    <p>{industry.description}</p>

                  </div>

                  <span className="ve-ind-card-arrow">
                    <FaArrowUp />
                  </span>
                </div>

              </div>

            </Link>
          ))}

        </div>

        {/* BOTTOM NOTE */}
        <div className="ve-ind-footer ve-ind-reveal">
          <p>
            Looking for electrical solutions for your project?
          </p>

          <Link to="/contact">
            Discuss Your Requirements
            <FaArrowRight />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default IndustriesOne;
