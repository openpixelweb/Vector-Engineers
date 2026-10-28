
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaShieldAlt,
  FaCog,
  FaLeaf,
  FaRegCheckCircle,
  FaAward,
  FaHeadset,
  FaLayerGroup,
} from "react-icons/fa";


const products = [
  {
    number: "01",
    title: "Energy Metering & Management",
    description:
      "Smart solutions for accurate monitoring and energy efficiency.",
    image: "/assets/img/prod-hm-01.png",
    link: "#",
  },
  {
    number: "02",
    title: "Switchgear & Protection",
    description:
      "Reliable protection for safer and smarter power systems.",
    image: "/assets/img/prod-hm-02.png",
    link: "#",
    featured: true,
  },
  {
    number: "03",
    title: "Control & Automation",
    description:
      "Advanced control components for efficient operations.",
    image: "/assets/img/prod-hm-03.png",
    link: "#",
  },
  {
    number: "04",
    title: "Wires & Cables",
    description:
      "High-performance cables for every application.",
    image: "/assets/img/prod-hm-04.png",
    link: "#",
  },
  {
    number: "05",
    title: "Electrical Distribution",
    description:
      "Dependable distribution solutions for modern infrastructure.",
    image: "/assets/img/prod-hm-05.png",
    link: "#",
  },
  {
    number: "06",
    title: "Switches & Wiring Accessories",
    description:
      "Modern designs for comfortable and connected spaces.",
    image: "/assets/img/prod-hm-06.png",
    link: "#",
  },
];

const highlights = [
  {
    icon: <FaShieldAlt />,
    title: "Safety",
    description: "Compliant Products",
  },
  {
    icon: <FaCog />,
    title: "Reliable",
    description: "Long-Lasting Performance",
  },
  {
    icon: <FaLeaf />,
    title: "Efficient",
    description: "Energy Optimised Solutions",
  },
  {
    icon: <FaRegCheckCircle />,
    title: "Versatile",
    description: "For Every Application",
  },
];

const ProductsOne = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const elements = section.querySelectorAll(
      ".ve-product-reveal"
    );

    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      elements.forEach((element) => {
        element.classList.add("visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="ve-products-section"
      ref={sectionRef}
      aria-labelledby="ve-products-heading"
    >
      <div className="ve-products-container">

        {/* TOP SHOWCASE AREA */}
        <div className="ve-products-top">

          {/* LEFT CONTENT */}
          <div className="ve-products-intro ve-product-reveal">

            <div className="ve-products-subtitle">
              <span className="ve-products-line" />
              OUR PRODUCTS
            </div>

            <h2 id="ve-products-heading">
              Complete Electrical
              <br />
              Solutions for a
              <br />
              <span>Smarter Tomorrow</span>
            </h2>

            <p>
              We offer a comprehensive range of
              high-quality electrical products from
              trusted brands, designed to deliver
              safety, efficiency and reliability
              across every application.
            </p>

            <Link
              to="#"
              className="ve-products-main-btn"
            >
              Explore All Products
              <FaArrowRight />
            </Link>

          </div>

          {/* RIGHT INDUSTRIAL IMAGE */}
          <div className="ve-products-showcase">
            <div className="ve-products-hero-image">
              <img
                src="/assets/img/prod-hm-bg.jpg"
                alt="Industrial electrical distribution panels"
                loading="lazy"
                decoding="async"
              />
            </div>

            

            {/* FLOATING BENEFITS PANEL */}
            <div className="ve-products-benefits ve-product-reveal">

              <div className="ve-products-benefits-line" />

              <h3>
                Trusted Products.
                <br />
                Reliable Performance.
              </h3>

              <div className="ve-products-benefit-item">
                <span className="ve-products-benefit-icon">
                  <FaAward />
                </span>
                <div>
                  <h4>Global Brands</h4>
                  <p>From leading manufacturers</p>
                </div>
              </div>

              <div className="ve-products-benefit-item">
                <span className="ve-products-benefit-icon">
                  <FaLayerGroup />
                </span>
                <div>
                  <h4>Wide Product Range</h4>
                  <p>For diverse industry needs</p>
                </div>
              </div>

              <div className="ve-products-benefit-item">
                <span className="ve-products-benefit-icon">
                  <FaHeadset />
                </span>
                <div>
                  <h4>Technical Support</h4>
                  <p>Product selection guidance</p>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* PRODUCT CARDS */}
        <div className="ve-products-grid">

          {products.map((product, index) => (
            <Link
              to={product.link}
              key={product.number}
              className={`ve-product-card ve-product-reveal ${
                product.featured ? "ve-product-featured" : ""
              }`}
              style={{
                "--card-delay": `${(index % 3) * 90}ms`,
              }}
            >

              <div className="ve-product-card-top">

                <span className="ve-product-number">
                  {product.number}
                </span>

                <h3>{product.title}</h3>

                <p>{product.description}</p>

              </div>

              <div className="ve-product-card-image">
                <img
                  src={product.image}
                  alt={product.title}
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <span className="ve-product-card-arrow">
                <FaArrowRight />
              </span>

            </Link>
          ))}

        </div>

        {/* BOTTOM BENEFITS STRIP */}
        <div className="ve-products-bottom ve-product-reveal">

          <div className="ve-products-bottom-heading">
            <h3>
              Powering Industries
              <br />
              <span>with World-Class Products</span>
            </h3>
          </div>

          <div className="ve-products-bottom-features">

            {highlights.map((item) => (
              <div
                className="ve-products-bottom-item"
                key={item.title}
              >

                <span className="ve-products-bottom-icon">
                  {item.icon}
                </span>

                <div>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>

              </div>
            ))}

          </div>

        </div>

      </div>
    </section>
  );
};

export default ProductsOne;
