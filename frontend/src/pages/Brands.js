
import React, {
  Fragment,
  Suspense,
  useState,
  useEffect,
} from "react";

import { Link } from "react-router-dom";
import { FaExternalLinkAlt } from "react-icons/fa";

import Preloader from "../elements/Preloader";

const NavbarOne = React.lazy(() =>
  import("../components/NavbarOne")
);

const SearchPopup = React.lazy(() =>
  import("../elements/SearchPopup")
);

const FooterOne = React.lazy(() =>
  import("../components/FooterOne")
);

const FooterBottomOne = React.lazy(() =>
  import("../components/FooterBottomOne")
);

/* =====================================
   ADD ALL YOUR BRANDS HERE
===================================== */

const brands = [
  {
    id: 1,
    name: "Elmeasure",
    logo: "/assets/img/1.jpg",
    link: "https://www.elmeasure.com/",
  },
  {
    id: 2,
    name: "C&S Electric",
    logo: "/assets/img/2.jpg",
    link: "https://cselectric.co.in/",
  },
  {
    id: 3,
    name: "Powerflex",
    logo: "/assets/img/brands/powerflex.png",
    link: "https://powerflex.co.in/",
  },
  {
    id: 4,
    name: "V-Guard",
    logo: "/assets/img/brands/vguard.png",
    link: "https://vguard.com/",
  },
  {
    id: 5,
    name: "Neptune India",
    logo: "/assets/img/brands/neptune.png",
    link: "https://www.neptuneindia.com/",
  },
  {
    id: 6,
    name: "Trinity Touch",
    logo: "/assets/img/brands/trinity-touch.png",
    link: "https://www.trinitytouch.com/",
  },
];

const BRANDS_PER_PAGE = 12;

const Brands = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(
    brands.length / BRANDS_PER_PAGE
  );

  const startIndex =
    (currentPage - 1) * BRANDS_PER_PAGE;

  const visibleBrands = brands.slice(
    startIndex,
    startIndex + BRANDS_PER_PAGE
  );

  useEffect(() => {
    document.title =
      "Our Brands | Vector Engineers";
  }, []);

  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <Fragment>
      <Suspense fallback={<Preloader />}>

        <SearchPopup />
        <NavbarOne />

        {/* PAGE BANNER */}
        <section
          className="ve-brands-banner"
          style={{
            backgroundImage:
              'url("/assets/img/banner/brands-banner.jpg")',
          }}
        >
          <div className="container">
            <div className="ve-brands-banner-inner">

              <span className="ve-brands-banner-tag">
                OUR ELECTRICAL BRANDS
              </span>

              <h1>
                Trusted Brands.
                <br />
                <span>Reliable Solutions.</span>
              </h1>

              <p>
                Explore established electrical brands
                offering products for power distribution,
                energy management, protection and
                industrial applications.
              </p>

              <nav aria-label="Breadcrumb">
                <ul className="ve-brands-breadcrumb">
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li aria-current="page">Brands</li>
                </ul>
              </nav>

            </div>
          </div>
        </section>

        {/* COMPACT BRANDS GRID */}
        <section className="ve-compact-brands">
          <div className="container">

            <div className="ve-compact-brands-head">
              <div>
                <span>OUR BRAND PORTFOLIO</span>
                <h2>
                  Brands <strong>We Work With</strong>
                </h2>
              </div>

              <p>
                Explore our electrical brand portfolio
                and visit manufacturer websites for
                detailed product information.
              </p>
            </div>

            <div className="ve-compact-brands-grid">
              {visibleBrands.map((brand) => (
                <a
                  key={brand.id}
                  href={brand.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ve-compact-brand-card"
                  title={`Visit ${brand.name}`}
                >
                  <div className="ve-compact-brand-logo">
                    <img
                      src={brand.logo}
                      alt={`${brand.name} logo`}
                      loading="lazy"
                    />
                  </div>

                  <div className="ve-compact-brand-name">
                    <span>{brand.name}</span>
                    <FaExternalLinkAlt />
                  </div>
                </a>
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <nav
                className="ve-brands-pagination"
                aria-label="Brand pages"
              >
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    changePage(currentPage - 1)
                  }
                >
                  Previous
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => {
                    const page = index + 1;

                    return (
                      <button
                        type="button"
                        key={page}
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
                        onClick={() =>
                          changePage(page)
                        }
                      >
                        {page}
                      </button>
                    );
                  }
                )}

                <button
                  type="button"
                  disabled={
                    currentPage === totalPages
                  }
                  onClick={() =>
                    changePage(currentPage + 1)
                  }
                >
                  Next
                </button>
              </nav>
            )}

          </div>
        </section>

        <FooterOne />
        <FooterBottomOne />

      </Suspense>
    </Fragment>
  );
};

export default Brands;
