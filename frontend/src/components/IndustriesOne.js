
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";



const industries = [
  {
    id: "01",
    title: "Manufacturing & Industrial",
    description:
      "Electrical solutions for industrial operations, power distribution and equipment protection.",
    image: "/assets/img/indus-hm-01.jpg",
  },
  {
    id: "02",
    title: "Commercial Buildings",
    description:
      "Reliable electrical infrastructure for offices, retail spaces and commercial developments.",
    image: "/assets/img/indus-hm-02.jpg",
  },
  {
    id: "03",
    title: "Infrastructure & Utilities",
    description:
      "Dependable electrical products supporting infrastructure and utility requirements.",
    image: "/assets/img/indus-hm-03.jpg",
  },
  {
    id: "04",
    title: "Healthcare & Hospitality",
    description:
      "Electrical distribution and protection solutions for healthcare and hospitality facilities.",
    image: "/assets/img/indus-hm-04.jpg",
  },
  {
    id: "05",
    title: "IT & Data Infrastructure",
    description:
      "Power monitoring, distribution and protection for connected facilities.",
    image: "/assets/img/indus-hm-05.jpg",
  },
  {
    id: "06",
    title: "Renewable Energy",
    description:
      "Energy monitoring and electrical components for renewable energy applications.",
    image: "/assets/img/indus-hm-06.jpg",
  },
];

const IndustriesOne = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const items = section.querySelectorAll(".ve-circle-reveal");

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
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
        rootMargin: "0px 0px 30px 0px",
      }
    );

    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="ve-circle-industries"
      ref={sectionRef}
      aria-labelledby="ve-circle-heading"
    >
      <div className="container">

        {/* SECTION HEADING */}
        <div className="ve-circle-header ve-circle-reveal">

          <div>
            <span className="ve-circle-subtitle">
              INDUSTRIES WE SERVE
            </span>

            <h2 id="ve-circle-heading">
              Powering Industries.
              <span> Enabling Progress.</span>
            </h2>
          </div>

          <div className="ve-circle-header-right">
         

            <Link to="#">
              Explore All Industries
              <FaArrowRight />
            </Link>
          </div>

        </div>

        {/* CIRCULAR INDUSTRIES */}
        <div className="ve-circle-industries-list">

          {industries.map((industry, index) => (
            <div
              className="ve-circle-industry ve-circle-reveal"
              key={industry.id}
              style={{
                "--circle-delay": `${index * 80}ms`,
              }}
            >

              <div className="ve-circle-photo-outer">

                <div className="ve-circle-photo">
                  <img
                    src={industry.image}
                    alt={industry.title}
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <span
                  className="ve-circle-number"
                  aria-hidden="true"
                >
                  {industry.id}
                </span>

              </div>

              <h3>{industry.title}</h3>

              <p>{industry.description}</p>

            </div>
          ))}

        </div>


      </div>
    </section>
  );
};

export default IndustriesOne;
