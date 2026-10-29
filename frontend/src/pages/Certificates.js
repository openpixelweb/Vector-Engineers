
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FaFilePdf,
  FaDownload,
  FaExternalLinkAlt,
  FaSearch,
  FaTimes,
  FaFolderOpen,
  FaChevronDown,
} from "react-icons/fa";

import NavbarOne from "../components/NavbarOne";
import FooterOne from "../components/FooterOne";
import FooterBottomOne from "../components/FooterBottomOne";
import SearchPopup from "../elements/SearchPopup";


/* ========================================
   VECTOR ENGINEERS - ORIGINAL DOWNLOADS

   Document names and PDF paths follow
   the existing vectorengineers.com
   downloads.html page.

   Some original PDFs may be unavailable.
======================================== */

const BASE = "/assets/certificates/";
const fileUrl = `${BASE}${document.file}`;

const downloadGroups = [
  {
    id: "cs",
    title: "C & S",
    documents: [
      {
        id: "cs-01",
        title: "C & S",
        file: "Final-Distribution-Products.pdf",
      },
    ],
  },
  {
    id: "neptune",
    title: "Neptune",
    documents: [
      {
        id: "neptune-01",
        title: "Neptune",
        file: "Neptune-Company-Profile-2025.pdf",
      },
    ],
  },
  {
    id: "powerflex",
    title: "Powerflex",
    documents: [
      {
        id: "powerflex-01",
        title: "Powerflex",
        file: "POWER-FLEX-CATALOG.pdf",
      },
    ],
  },
  {
    id: "vector",
    title: "Vector Brochure",
    documents: [
      {
        id: "vector-01",
        title: "Vector Brochure",
        file: "Vector-Brochure-2025.pdf",
      },
    ],
  },
  {
    id: "elmeasure",
    title: "Elmeasure",
    documents: [
      {
        id: "elmeasure-01",
        title: "ACCL",
        file: "ACCL.pdf",
      },
      {
        id: "elmeasure-02",
        title: "ATEs",
        file: "ATEs.pdf",
      },
      {
        id: "elmeasure-03",
        title: "BASIC METER",
        file: "BASIC_METER.pdf",
      },
      {
        id: "elmeasure-04",
        title: "DC ENERGY METERS",
        file: "DC_ENERGY_METERS.pdf",
      },
      {
        id: "elmeasure-05",
        title: "IELR CATALOG",
        file: "IELR_CATALOG.pdf",
      },
      {
        id: "elmeasure-06",
        title: "MULTIFUNCTIONAL ENERGY METERS",
        file: "MULTIFUNCTIONAL_ENERGY_METERS.pdf",
      },
      {
        id: "elmeasure-07",
        title: "Smart Meter",
        file: "Smart_Meter.pdf",
      },
    ],
  },
  {
    id: "trinity",
    title: "Trinity Touch",
    documents: [
      {
        id: "trinity-01",
        title: "Enclosures",
        file: "Enclosures.pdf",
      },
      {
        id: "trinity-02",
        title: "Trinity Touch Wiring Duct",
        file: "Trinity-Touch-Wiring-Duct-Catalogue.pdf",
      },
    ],
  },
  {
    id: "vguard",
    title: "V-Guard",
    documents: [
      {
        id: "vguard-01",
        title: "Matteo Catalogue",
        file: "Matteo-Catalogue.pdf",
      },
      {
        id: "vguard-02",
        title: "VGUARD INVIDIA",
        file: "VGUARD-INVIDIA.pdf",
      },
      {
        id: "vguard-03",
        title: "V-Guard Fans",
        file: "V-Guard_Fans.pdf",
      },
      {
        id: "vguard-04",
        title: "V-Guard Electric Water Heaters",
        file: "V-Guard-Electric-Water-Heaters.pdf",
      },
      {
        id: "vguard-05",
        title: "V-Guard Heat Pump DHP CHP",
        file: "V-Guard-Heat-pump-DHP-CHP.pdf",
      },
    ],
  },
];

const allDocumentCount = downloadGroups.reduce(
  (total, group) => total + group.documents.length,
  0
);

/* ========================================
   DOWNLOAD DOCUMENT ITEM
======================================== */


const DocumentItem = ({ document }) => {
  const fileUrl = `/assets/certificates/${encodeURIComponent(
    document.file
  )}`;

  return (
    <article className="ve-dl-document">

      {/* PDF ICON */}
      <div className="ve-dl-document-icon">
        <FaFilePdf aria-hidden="true" />
      </div>

      {/* DOCUMENT INFORMATION */}
      <div className="ve-dl-document-info">
        <h3>{document.title}</h3>
        <span>PDF Document</span>
      </div>

      {/* ACTION BUTTONS */}
      <div className="ve-dl-document-actions">

        {/* VIEW PDF */}
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ve-dl-view"
          aria-label={`View ${document.title}`}
        >
          <FaExternalLinkAlt />
          <span>View PDF</span>
        </a>

        {/* DOWNLOAD PDF */}
        <a
          href={fileUrl}
          download={document.file}
          className="ve-dl-download"
          aria-label={`Download ${document.title}`}
        >
          <FaDownload />
          <span>Download</span>
        </a>

      </div>

    </article>
  );
};


/* ========================================
   CERTIFICATES / DOWNLOADS PAGE
======================================== */

const Certificates = () => {
  const [search, setSearch] = useState("");
  const [activeGroup, setActiveGroup] = useState("all");

  const [collapsedGroups, setCollapsedGroups] =
    useState([]);

  useEffect(() => {
    document.title =
      "Certificates & Downloads | Vector Engineers";
  }, []);

  const query = search.trim().toLowerCase();

  const filteredGroups = downloadGroups
    .filter(
      (group) =>
        activeGroup === "all" ||
        group.id === activeGroup
    )
    .map((group) => ({
      ...group,
      documents: group.documents.filter((document) =>
        `${group.title} ${document.title}`
          .toLowerCase()
          .includes(query)
      ),
    }))
    .filter((group) => group.documents.length > 0);

  const visibleDocumentCount = filteredGroups.reduce(
    (total, group) =>
      total + group.documents.length,
    0
  );

  const toggleGroup = (groupId) => {
    setCollapsedGroups((previous) =>
      previous.includes(groupId)
        ? previous.filter((id) => id !== groupId)
        : [...previous, groupId]
    );
  };

  const resetFilters = () => {
    setSearch("");
    setActiveGroup("all");
    setCollapsedGroups([]);
  };

  return (
    <>
      <SearchPopup />
      <NavbarOne />

      {/* =====================================
          SAME BANNER AS OTHER PAGES
      ===================================== */}

      <div
        className="breadcrumb-area bg-overlay-2 ve-about-banner"
        style={{
          backgroundImage:
            'url("/assets/img/certificates-banner.jpg")',
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="breadcrumb-inner">
                <div className="section-title mb-0">
                  <h1 className="page-title">
                    Certificates & Downloads
                  </h1>

                  <ul className="page-list">
                    <li>
                      <Link to="/">Home</Link>
                    </li>

                    <li className="ps-0">
                      Certificates & Downloads
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="ve-downloads-page">

        {/* =====================================
            INTRODUCTION
        ===================================== */}

        <section className="ve-dl-intro">
          <div className="container">
            <div className="ve-dl-intro-layout">
              <div>
                <span className="ve-dl-eyebrow">
                  VECTOR ENGINEERS
                </span>

                <h2>
                  Product Catalogues
                  <span> & Downloads.</span>
                </h2>
              </div>

              
            </div>
          </div>
        </section>

        {/* =====================================
            FILTER / SEARCH
        ===================================== */}

        <section className="ve-dl-library">
          <div className="container">

            

            {/* FILTER TOOLBAR */}

            <div className="ve-dl-toolbar">
              <div className="ve-dl-search">
                <FaSearch aria-hidden="true" />

                <input
                  type="search"
                  placeholder="Search brochures or catalogues..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  aria-label="Search downloads"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>

            {/* MANUFACTURER TABS */}

            <div className="ve-dl-filters">
              <button
                type="button"
                className={
                  activeGroup === "all"
                    ? "is-active"
                    : ""
                }
                onClick={() => setActiveGroup("all")}
              >
                All Downloads
              </button>

              {downloadGroups.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  className={
                    activeGroup === group.id
                      ? "is-active"
                      : ""
                  }
                  onClick={() =>
                    setActiveGroup(group.id)
                  }
                >
                  {group.title}
                </button>
              ))}
            </div>

            {/* =====================================
                DOWNLOAD GROUPS
            ===================================== */}

            {filteredGroups.length > 0 ? (
              <div className="ve-dl-groups">
                {filteredGroups.map((group, index) => {
                  const collapsed =
                    collapsedGroups.includes(group.id);

                  return (
                    <section
                      className="ve-dl-group"
                      key={group.id}
                    >
                      <button
                        type="button"
                        className="ve-dl-group-heading"
                        onClick={() =>
                          toggleGroup(group.id)
                        }
                        aria-expanded={!collapsed}
                      >
                        <span className="ve-dl-group-index">
                          {String(index + 1).padStart(
                            2,
                            "0"
                          )}
                        </span>

                        <span className="ve-dl-group-name">
                          {group.title}
                        </span>

                        <span className="ve-dl-group-quantity">
                          {group.documents.length}{" "}
                          {group.documents.length === 1
                            ? "Document"
                            : "Documents"}
                        </span>

                        <FaChevronDown
                          className={
                            collapsed ? "is-closed" : ""
                          }
                          aria-hidden="true"
                        />
                      </button>

                      {!collapsed && (
                        <div className="ve-dl-document-grid">
                          {group.documents.map(
                            (document) => (
                              <DocumentItem
                                key={document.id}
                                document={document}
                              />
                            )
                          )}
                        </div>
                      )}
                    </section>
                  );
                })}
              </div>
            ) : (
              <div className="ve-dl-empty">
                <FaSearch aria-hidden="true" />

                <h3>No matching documents</h3>

                <p>
                  Try searching for another manufacturer
                  or product catalogue.
                </p>

                <button
                  type="button"
                  onClick={resetFilters}
                >
                  View All Downloads
                </button>
              </div>
            )}

          </div>
        </section>

      </main>

      <FooterOne />
      <FooterBottomOne />
    </>
  );
};

export default Certificates;
