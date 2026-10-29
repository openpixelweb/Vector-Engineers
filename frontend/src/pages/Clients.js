
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import NavbarOne from "../components/NavbarOne";
import FooterOne from "../components/FooterOne";
import SearchPopup from "../elements/SearchPopup";



/* CLIENT LOGOS
   Existing files: 1.jpg to 15.jpg
*/

const clients = Array.from({ length: 15 }, (_, index) => ({
  id: index + 1,
  image: `/assets/img/${index + 1}.jpg`,
  alt: `Client logo ${index + 1}`,
}));

const ITEMS_PER_PAGE = 15;

const Clients = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(
    clients.length / ITEMS_PER_PAGE
  );

  const currentClients = clients.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    document.title = "Our Clients | Vector Engineers";
  }, []);

  const changePage = (page) => {
    setCurrentPage(page);

    document
      .getElementById("ve-clients-list")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  return (
    <>
      <SearchPopup />
      <NavbarOne />

      {/* ==================================
          COMMON PAGE BANNER
      ================================== */}

      <div
        className="breadcrumb-area bg-overlay-2 ve-about-banner"
        style={{
          backgroundImage:
            'url("/assets/img/clients-banner.jpg")',
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="breadcrumb-inner">
                <div className="section-title mb-0">

                  <h1 className="page-title">
                    Our Clients
                  </h1>

                  <ul className="page-list">
                    <li>
                      <Link to="/">Home</Link>
                    </li>

                    <li className="ps-0">
                      Our Clients
                    </li>
                  </ul>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================
          CLIENT LOGOS
      ================================== */}

      <section
        className="ve-clients-page"
        id="ve-clients-list"
      >
        <div className="container">

          <div className="ve-clients-page-heading">
            <span className="ve-clients-page-label">
              OUR VALUED CLIENTS
            </span>

            <h2>
              Relationships Built on{" "}
              <span>Trust.</span>
            </h2>

            <p>
              We value the relationships we build
              with our clients across industrial,
              commercial and infrastructure projects.
              Our focus is on reliable electrical
              products, responsive service and
              long-term collaboration.
            </p>
          </div>

          {/* CLIENT LOGO GRID */}

          <div className="ve-clients-logo-grid">
            {currentClients.map((client, index) => (
              <div
                className="ve-client-logo-item"
                key={client.id}
                style={{
                  animationDelay: `${index * 45}ms`,
                }}
              >
                <img
                  src={client.image}
                  alt={client.alt}
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          {/* PAGINATION */}

          {totalPages > 1 && (
            <nav
              className="ve-clients-pagination"
              aria-label="Client logo pages"
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
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  type="button"
                  className={
                    currentPage === page
                      ? "active"
                      : ""
                  }
                  aria-label={`Page ${page}`}
                  aria-current={
                    currentPage === page
                      ? "page"
                      : undefined
                  }
                  onClick={() => changePage(page)}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage === totalPages}
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
    </>
  );
};

export default Clients;
