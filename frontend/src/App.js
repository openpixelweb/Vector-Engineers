
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import AOS from "aos";
import "aos/dist/aos.css";
import ScrollToTop from "react-scroll-to-top";

import RouteScrollToTop from "./elements/RouteScrollToTop";

// Existing pages
import HomeOne from "./pages/HomeOne";
import HomeTwo from "./pages/HomeTwo";
import HomeThree from "./pages/HomeThree";
import HomeFour from "./pages/HomeFour";
import HomeFive from "./pages/HomeFive";

import About from "./pages/About";
import Service from "./pages/Service";
import ServiceDetails from "./pages/ServiceDetails";
import Blog from "./pages/Blog";
import BlogDetails from "./pages/BlogDetails";
import Pricing from "./pages/Pricing";
import Faq from "./pages/Faq";
import Contact from "./pages/Contact";

// Vector Engineers pages
import Brands from "./pages/Brands";
import Industries from "./pages/Industries";
import Clients from "./pages/Clients";
import Products from "./pages/Products";
import Applications from "./pages/Applications";
import Villas from "./pages/Villas";
import HighRiseApartments from "./pages/HighRiseApartments";
import Certificates from "./pages/Certificates";

// Live Product and Model Details
import {
  LiveProductDetails,
  LiveModelDetails,
} from "./pages/LiveProductDetails";

function App() {
  useEffect(() => {
    AOS.init({
      offset: 0,
      easing: "ease",
      duration: 700,
      once: true,
    });
  }, []);

  return (
    <BrowserRouter>
      <RouteScrollToTop />

      <Routes>
        {/* Home Pages */}
        <Route path="/" element={<HomeOne />} />
        <Route path="/home-2" element={<HomeTwo />} />
        <Route path="/home-3" element={<HomeThree />} />
        <Route path="/home-4" element={<HomeFour />} />
        <Route path="/home-5" element={<HomeFive />} />

        {/* Existing Pages */}
        <Route path="/about" element={<About />} />
        <Route path="/service" element={<Service />} />
        <Route path="/service-details" element={<ServiceDetails />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog-details" element={<BlogDetails />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contact" element={<Contact />} />

        {/* Vector Engineers Pages */}
        <Route path="/brands" element={<Brands />} />
        <Route path="/industries" element={<Industries />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/products" element={<Products />} />
        <Route path="/applications" element={<Applications />} />

        {/* Residential Solutions */}
        <Route path="/residential/villas" element={<Villas />} />
        <Route
          path="/residential/high-rise-apartments"
          element={<HighRiseApartments />}
        />

        {/* Certificates */}
        <Route path="/certificates" element={<Certificates />} />

        {/* Product Details */}
        <Route
          path="/products/:id"
          element={<LiveProductDetails />}
        />

        {/* Individual Product Model Details */}
        <Route
          path="/products/models/:id"
          element={<LiveModelDetails />}
        />
      </Routes>

      <ScrollToTop
        smooth
        color="#0879C4"
      />
    </BrowserRouter>
  );
}

export default App;
