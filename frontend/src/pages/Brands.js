
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
    logo: "/assets/img/brands-ve-01.png",
    link: "https://www.elmeasure.com/",
  },
  {
    id: 2,
    name: "C&S Electric",
    logo: "/assets/img/brands-ve-02.png",
    link: "https://cselectric.co.in/",
  },
  {
    id: 3,
    name: "Powerflex",
    logo: "/assets/img/brands-ve-07.png",
    link: "https://powerflex.co.in/",
  },
  {
    id: 4,
    name: "V-Guard",
    logo: "/assets/img/brands-ve-03.png",
    link: "https://vguard.com/",
  },
  {
    id: 5,
    name: "Neptune India",
    logo: "/assets/img/brands-ve-04.png",
    link: "https://www.neptuneindia.com/",
  },
  {
    id: 6,
    name: "Trinity Touch",
    logo: "/assets/img/brands-ve-05.png",
    link: "https://www.trinitytouch.com/",
  },
  {
    id: 7,
    name: "Precision Pipes",
    logo: "/assets/img/brands-ve-06.png",
    link: "https://precisionpipes.com/",
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
        
{/* ==========================================
    VECTOR ENGINEERS - BRANDS PAGE BANNER
========================================== */}

<div
  className="breadcrumb-area bg-overlay-2 ve-about-banner"
  style={{
    backgroundImage:
      'url("/assets/img/brands-banner.jpg")',
  }}
>
  <div className="container">
    <div className="row justify-content-center">
      <div className="col-lg-12">

        <div className="breadcrumb-inner">
          <div className="section-title mb-0">

            {/* PAGE TITLE */}
            <h1 className="page-title">
              Our Brands
            </h1>

            {/* BREADCRUMB */}
            <ul className="page-list">
              <li>
                <Link to="/">Home</Link>
              </li>

              <li className="ps-0">
                Our Brands
              </li>
            </ul>

          </div>
        </div>

      </div>
    </div>
  </div>
</div>

{/* BRANDS PAGE BANNER END */}

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

      </Suspense>
    </Fragment>
  );
};

export default Brands;
