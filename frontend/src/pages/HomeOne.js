import React, { Fragment, Suspense } from "react";
import Preloader from "../elements/Preloader";
const BannerOne = React.lazy(() => import("../components/BannerOne"));
const AboutOne = React.lazy(() => import("../components/AboutOne"));
const ProductsOne = React.lazy(() => import("../components/ProductsOne"));
const CounterOne = React.lazy(() => import("../components/CounterOne"));
const FeatureOne = React.lazy(() => import("../components/FeatureOne"));
const FooterBottomOne = React.lazy(() =>
  import("../components/FooterBottomOne")
);
const FooterOne = React.lazy(() => import("../components/FooterOne"));
const NavbarOne = React.lazy(() => import("../components/NavbarOne"));
const PartnerOne = React.lazy(() => import("../components/PartnerOne"));
const Industries = React.lazy(() => import("../components/IndustriesOne"));
const TestimonialOne = React.lazy(() => import("../components/TestimonialOne"));
const WhyChooseUsOne = React.lazy(() => import("../components/WhyChooseUsOne"));
const SearchPopup = React.lazy(() => import("../elements/SearchPopup"));
const HomeOne = () => {
  return (
    <>
      <Fragment>
        <Suspense fallback={<Preloader />}>
          {/* Search Popup */}
          <SearchPopup />

          {/* Navbar One */}
          <NavbarOne />

          {/* Banner One */}
          <BannerOne />

          {/* Feature One */}
          <FeatureOne />

          {/* About One */}
          <AboutOne />

          {/* Service One */}
          <Industries />

          <ProductsOne />

          {/* Why Choose Us One */}
          <WhyChooseUsOne />

          {/* Counter One */}

          <CounterOne />


          {/* Testimonial One */}
          <TestimonialOne />


          {/* Partner One */}
          <PartnerOne />

          {/* Footer One */}
          <FooterOne />
        </Suspense>
      </Fragment>
    </>
  );
};

export default HomeOne;
