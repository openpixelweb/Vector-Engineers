
import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
} from "react";

import { Link } from "react-router-dom";
import {
  FaSearch,
  FaTimes,
  FaBolt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import NavbarOne from "../components/NavbarOne";
import FooterOne from "../components/FooterOne";
import SearchPopup from "../elements/SearchPopup";

import {
  products,
  productCategories,
} from "../data/products";


const PER_PAGE = 9;

const ProductCard = ({ product }) => {
  const [imageFailed, setImageFailed] =
    useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [product.image]);

  return (
    <article className="ve-product-card">

      <div className="ve-product-image">
        <span className="ve-product-image-placeholder">
          <FaBolt aria-hidden="true" />
        </span>

        {!imageFailed && product.image && (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        )}
      </div>

      <div className="ve-product-info">
        <span className="ve-product-category">
          {
            productCategories.find(
              (item) => item.id === product.category
            )?.name
          }
        </span>

        <h3>{product.name}</h3>
        <p>{product.description}</p>
      </div>

    </article>
  );
};

const Products = () => {
  const [activeCategory, setActiveCategory] =
    useState("all");

  const [searchQuery, setSearchQuery] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const productSectionRef = useRef(null);

  useEffect(() => {
    document.title =
      "Electrical Products | Vector Engineers";
  }, []);

  const filteredProducts = useMemo(() => {
    const query = searchQuery
      .trim()
      .toLowerCase();

    return products.filter((product) => {
      const categoryMatch =
        activeCategory === "all" ||
        product.category === activeCategory;

      const categoryName =
        productCategories.find(
          (item) => item.id === product.category
        )?.name || "";

      const searchMatch =
        !query ||
        [
          product.name,
          product.description,
          categoryName,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      return categoryMatch && searchMatch;
    });
  }, [activeCategory, searchQuery]);

  const totalPages = Math.ceil(
    filteredProducts.length / PER_PAGE
  );

  const visibleProducts = filteredProducts.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  const selectCategory = (category) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const updateSearch = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setActiveCategory("all");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);

    productSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    const elements = document.querySelectorAll(
      ".ve-products-page .ve-reveal"
    );

    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) =>
        el.classList.add("is-visible")
      );
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(
              "is-visible"
            );
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -25px 0px",
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [visibleProducts]);

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
            'url("/assets/img/products-banner.jpg")',
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="breadcrumb-inner">
                <div className="section-title mb-0">

                  <h1 className="page-title">
                    Our Products
                  </h1>

                  <ul className="page-list">
                    <li>
                      <Link to="/">Home</Link>
                    </li>

                    <li className="ps-0">
                      Our Products
                    </li>
                  </ul>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================
          INTRODUCTION
      =================================== */}

      <main className="ve-products-page">

        <section className="ve-products-intro">
          <div className="container">

            <div className="ve-products-intro-inner ve-reveal">
              <div>
                <span className="ve-products-eyebrow">
                  OUR PRODUCT PORTFOLIO
                </span>

                <h2>
                  Products for Reliable
                  <br />
                  <span>
                    Electrical Performance.
                  </span>
                </h2>
              </div>

              <p>
                Explore our electrical product portfolio
                covering energy metering, power distribution,
                electrical protection, switching, control,
                wires and cables. Find suitable products
                for industrial, commercial and
                infrastructure applications.
              </p>
            </div>

          </div>
        </section>

        {/* ===================================
            PRODUCT BROWSER
        =================================== */}

        <section
          className="ve-products-browser"
          ref={productSectionRef}
        >
          <div className="container">

            {/* HEADER */}

            

            {/* SEARCH */}

            <div className="ve-products-toolbar">
              <div className="ve-products-search">
                <FaSearch aria-hidden="true" />

                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) =>
                    updateSearch(e.target.value)
                  }
                  placeholder="Search electrical products..."
                  aria-label="Search products"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => updateSearch("")}
                    aria-label="Clear search"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>

              <span className="ve-products-total">
                {filteredProducts.length} Products
              </span>
            </div>

            {/* CATEGORY TABS */}

            <div
              className="ve-products-categories"
              aria-label="Product categories"
            >
              <button
                type="button"
                onClick={() =>
                  selectCategory("all")
                }
                className={
                  activeCategory === "all"
                    ? "active"
                    : ""
                }
                aria-pressed={
                  activeCategory === "all"
                }
              >
                All Products
              </button>

              {productCategories.map(
                (category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() =>
                      selectCategory(category.id)
                    }
                    className={
                      activeCategory === category.id
                        ? "active"
                        : ""
                    }
                    aria-pressed={
                      activeCategory === category.id
                    }
                  >
                    {category.name}
                  </button>
                )
              )}
            </div>

            {/* RESULT LABEL */}

            <div className="ve-products-result-row">
              <p>
                Showing{" "}
                <strong>
                  {filteredProducts.length === 0
                    ? 0
                    : (currentPage - 1) *
                        PER_PAGE +
                      1}
                  -
                  {Math.min(
                    currentPage * PER_PAGE,
                    filteredProducts.length
                  )}
                </strong>{" "}
                of{" "}
                <strong>
                  {filteredProducts.length}
                </strong>{" "}
                products
              </p>
            </div>

            {/* PRODUCT GRID */}

            {visibleProducts.length > 0 ? (
              <div className="ve-products-grid">
                {visibleProducts.map((product) => (
                  <div
                    className="ve-reveal"
                    key={product.id}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="ve-products-empty">
                <FaSearch aria-hidden="true" />

                <h3>No products found</h3>

                <p>
                  Try searching with a different
                  product name or category.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                >
                  View All Products
                </button>
              </div>
            )}

            {/* PAGINATION */}

            {totalPages > 1 && (
              <nav
                className="ve-products-pagination"
                aria-label="Product pages"
              >
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    changePage(currentPage - 1)
                  }
                  aria-label="Previous page"
                >
                  <FaChevronLeft />
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() =>
                      changePage(page)
                    }
                    className={
                      currentPage === page
                        ? "active"
                        : ""
                    }
                    aria-current={
                      currentPage === page
                        ? "page"
                        : undefined
                    }
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={
                    currentPage === totalPages
                  }
                  onClick={() =>
                    changePage(currentPage + 1)
                  }
                  aria-label="Next page"
                >
                  <FaChevronRight />
                </button>
              </nav>
            )}

          </div>
        </section>



      </main>

      <FooterOne />
    </>
  );
};

export default Products;
