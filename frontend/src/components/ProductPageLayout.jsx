
import React from "react";
import { Link } from "react-router-dom";

import NavbarOne from "./NavbarOne";
import FooterOne from "./FooterOne";


import "./ProductPageLayout.css";

const ProductPageLayout = ({
  children,
  title = "Product Details",
  breadcrumb = [],
}) => {
  return (
    <div className="ve-public-layout">

      {/* Existing Vector Engineers Header */}
      <NavbarOne />

      {/* Product Page Banner */}
      <section className="ve-inner-hero">
        <div className="container">
          <div className="ve-inner-hero-content">
            <span className="ve-inner-hero-eyebrow">
              VECTOR ENGINEERS
            </span>

            <h1>{title}</h1>

            <nav aria-label="Breadcrumb">
              <ol className="ve-inner-breadcrumb">
                <li>
                  <Link to="/">Home</Link>
                </li>

                <li>
                  <Link to="/products">Products</Link>
                </li>

                {breadcrumb.map((item, index) => (
                  <li key={index}>
                    {item.to ? (
                      <Link to={item.to}>
                        {item.label}
                      </Link>
                    ) : (
                      <span>{item.label}</span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>
      </section>

      {/* Page Content */}
      <main className="ve-inner-main">
        {children}
      </main>

      {/* Existing Vector Engineers Footer */}
      <FooterOne />


    </div>
  );
};

export default ProductPageLayout;
