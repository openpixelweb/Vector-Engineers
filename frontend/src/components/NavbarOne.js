
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaChevronDown,
  FaBars,
  FaTimes,
  FaArrowRight,
  FaEnvelope,
} from "react-icons/fa";



const menuItems = [
  {
    title: "Home",
    path: "/",
  },
  {
    title: "About Us",
    path: "/about",
  },
  {
    title: "Industries",
    path: "#",
  },
  {
    title: "Products",
    path: "#",
  },
  {
    title: "Applications",
    path: "#",
  },
  {
    title: "Residential Solutions",
    path: "#",
    children: [
      {
        title: "Villas",
        path: "#",
      },
      {
        title: "High-Rise Apartments",
        path: "#",
      },
    ],
  },
  {
    title: "Brands",
    path: "/brands",
  },

];


const NavbarOne = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [sticky, setSticky] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 60);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  const toggleDropdown = (title) => {
    setActiveDropdown((previous) =>
      previous === title ? null : title
    );
  };

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";

    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  };

  return (
    <header className={`ve-header ${sticky ? "ve-sticky" : ""}`}>



      {/* MAIN NAVIGATION */}
      <div className="ve-navbar">
        <div className="container ve-navbar-inner">

{/* OFFICIAL VECTOR ENGINEERS LOGO */}
<Link
  to="/"
  className="ve-logo"
  onClick={() => setMobileOpen(false)}
  aria-label="Vector Engineers Home"
>
  <img
    src="/assets/img/logo.png"
    alt="Vector Engineers"
    className="ve-official-logo"
  />
</Link>


          {/* DESKTOP NAVIGATION */}
          <nav className="ve-desktop-nav" aria-label="Main navigation">
            <ul className="ve-menu">

              {menuItems.map((item) => (
                <li
                  key={item.title}
                  className={`ve-menu-item ${
                    item.children ? "ve-has-dropdown" : ""
                  }`}
                >
                  <div className="ve-menu-heading">
                    <Link
                      to={item.path}
                      className={isActive(item.path) ? "ve-active" : ""}
                    >
                      {item.title}
                    </Link>

                    {item.children && (
                      <button
                        type="button"
                        className="ve-dropdown-toggle"
                        aria-label={`Toggle ${item.title} menu`}
                        aria-expanded={activeDropdown === item.title}
                        onClick={() => toggleDropdown(item.title)}
                      >
                        <FaChevronDown />
                      </button>
                    )}
                  </div>

                  {item.children && (
                    <ul
                      className={`ve-dropdown ${
                        activeDropdown === item.title ? "ve-dropdown-open" : ""
                      }`}
                    >
                      {item.children.map((subItem) => (
                        <li key={subItem.path}>
                          <Link
                            to={subItem.path}
                            onClick={() => setActiveDropdown(null)}
                          >
                            {subItem.title}
                            <FaArrowRight className="ve-sub-arrow" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}

            </ul>
          </nav>

          {/* HEADER ACTIONS */}
          <div className="ve-header-actions">

            <Link to="/contact" className="ve-quote-btn">
              Get in Touch
              <FaArrowRight />
            </Link>

            <button
              type="button"
              className="ve-mobile-toggle"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="ve-mobile-navigation"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <FaTimes /> : <FaBars />}
            </button>

          </div>

        </div>
      </div>

      {/* MOBILE NAVIGATION */}
      <nav
        id="ve-mobile-navigation"
        className={`ve-mobile-nav ${mobileOpen ? "ve-mobile-open" : ""}`}
        aria-label="Mobile navigation"
        aria-hidden={!mobileOpen}
      >
        <div className="ve-mobile-menu">

          {menuItems.map((item) => (
            <div className="ve-mobile-item" key={item.title}>

              <div className="ve-mobile-heading">

                <Link
                  to={item.path}
                  className={isActive(item.path) ? "ve-active" : ""}
                  onClick={() => setMobileOpen(false)}
                  tabIndex={mobileOpen ? 0 : -1}
                >
                  {item.title}
                </Link>

                {item.children && (
                  <button
                    type="button"
                    onClick={() => toggleDropdown(item.title)}
                    aria-expanded={activeDropdown === item.title}
                    aria-label={`Expand ${item.title}`}
                    tabIndex={mobileOpen ? 0 : -1}
                    className={
                      activeDropdown === item.title ? "ve-rotate" : ""
                    }
                  >
                    <FaChevronDown />
                  </button>
                )}

              </div>

              {item.children && activeDropdown === item.title && (
                <div className="ve-mobile-submenu">
                  {item.children.map((subItem) => (
                    <Link
                      key={subItem.path}
                      to={subItem.path}
                      onClick={() => setMobileOpen(false)}
                      tabIndex={mobileOpen ? 0 : -1}
                    >
                      {subItem.title}
                    </Link>
                  ))}
                </div>
              )}

            </div>
          ))}

          <Link
            to="/contact"
            className="ve-mobile-quote"
            onClick={() => setMobileOpen(false)}
            tabIndex={mobileOpen ? 0 : -1}
          >
            Request a Quote <FaArrowRight />
          </Link>

          <div className="ve-mobile-contact">
            <a href="tel:+919491073449" tabIndex={mobileOpen ? 0 : -1}>
              <FaPhoneAlt /> +91 94910 73449
            </a>
          </div>

        </div>
      </nav>

    </header>
  );
};

export default NavbarOne;
