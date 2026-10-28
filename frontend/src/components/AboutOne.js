
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCheck,
  FaBolt,
} from "react-icons/fa";


const highlights = [
  "Electrical Product Expertise",
  "Industrial & Commercial Applications",
  "Established Electrical Brands",
  "Project-Focused Guidance",
];

const AboutOne = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const elements = section.querySelectorAll(
      ".ve-home-about-reveal"
    );

    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      elements.forEach((el) =>
        el.classList.add("is-visible")
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
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px",
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="ve-home-about"
      ref={sectionRef}
      aria-labelledby="ve-home-about-title"
    >
      <div className="container">

        <div className="row align-items-center gy-5">

          {/* LEFT - INDUSTRIAL PHOTOGRAPH */}
          <div className="col-lg-6">

            <div className="ve-home-about-visual ve-home-about-reveal">

              <div className="ve-home-about-image">
                <img
                  src="/assets/img/hm-about-01.jpg"
                  alt="Industrial electrical switchgear and power distribution equipment"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              {/* SMALL CORPORATE PHOTO CAPTION */}
              <div className="ve-home-about-photo-caption">

                <div className="ve-home-about-caption-icon">
                  <FaBolt />
                </div>

                <div>
                  <span>ENGINEERING RELIABILITY</span>

                  <p>
                    Electrical solutions for modern
                    industries and infrastructure.
                  </p>
                </div>

              </div>

              {/* PHOTO ACCENT */}
              <span
                className="ve-home-about-image-accent"
                aria-hidden="true"
              />

            </div>

          </div>

          {/* RIGHT - COMPANY INTRODUCTION */}
          <div className="col-lg-6">

            <div className="ve-home-about-content">

              <div className="ve-home-about-eyebrow ve-home-about-reveal">
                <span />
                ABOUT VECTOR ENGINEERS
              </div>

              <h2
                className="ve-home-about-title ve-home-about-reveal"
                id="ve-home-about-title"
              >
                Powering Progress Through
                <span> Reliable Electrical Solutions.</span>
              </h2>

              <p className="ve-home-about-lead ve-home-about-reveal">
                Vector Engineers provides electrical
                products and application-focused solutions
                for industrial, commercial and residential
                requirements.
              </p>

              <p className="ve-home-about-description ve-home-about-reveal">
                With a focus on quality products, technical
                knowledge and customer requirements, we
                support businesses, contractors and project
                developers in selecting electrical solutions
                suited to their applications.
              </p>

              <p className="ve-home-about-description ve-home-about-reveal">
                Our portfolio covers energy metering,
                switchgear and protection, power
                distribution, control systems, wires and
                cables, and other essential electrical
                products.
              </p>

              {/* PRODUCT-FOCUSED HIGHLIGHTS */}
              <div className="ve-home-about-highlights ve-home-about-reveal">

                {highlights.map((item) => (
                  <div
                    className="ve-home-about-highlight"
                    key={item}
                  >
                    <span className="ve-home-about-check">
                      <FaCheck />
                    </span>

                    <span>{item}</span>
                  </div>
                ))}

              </div>

              {/* ACTION */}
              <div className="ve-home-about-action ve-home-about-reveal">

                <Link
                  to="/about"
                  className="ve-home-about-button"
                >
                  More About Us
                  <FaArrowRight />
                </Link>

                <span className="ve-home-about-action-text">
                  Your requirements.
                  <br />
                  Our expertise.
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutOne;
