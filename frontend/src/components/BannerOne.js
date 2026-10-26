
import React from "react";
import Slider from "react-slick";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const BannerOne = () => {
  function SampleNextArrow(props) {
    const { className, onClick } = props;

    return (
      <FaArrowRight
        className={className}
        onClick={onClick}
        aria-label="Next Slide"
      />
    );
  }

  function SamplePrevArrow(props) {
    const { className, onClick } = props;

    return (
      <FaArrowLeft
        className={className}
        onClick={onClick}
        aria-label="Previous Slide"
      />
    );
  }

  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    fade: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    cssEase: "ease-in-out",
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  const bannerData = [
    {
      id: 1,
      subtitle: "INDUSTRIAL & INFRASTRUCTURE SOLUTIONS",
      title: "Powering Industries. Driving Progress.",
      description:
        "Reliable electrical solutions for industrial operations, commercial facilities, and modern infrastructure.",
      image: "/assets/img/hm-banner-01.jpg",
      buttonText: "Explore Industries",
      buttonLink: "#",
    },
    {
      id: 2,
      subtitle: "ELECTRICAL PRODUCTS & TECHNOLOGIES",
      title: "Quality Products. Reliable Performance.",
      description:
        "Explore electrical products for power distribution, energy management, protection, and control.",
      image: "/assets/img/hm-banner-02.jpg",
      buttonText: "Explore Products",
      buttonLink: "#",
    },
    {
      id: 3,
      subtitle: "VILLAS & HIGH-RISE APARTMENTS",
      title: "Smarter Power for Modern Living.",
      description:
        "Thoughtfully selected electrical solutions designed for safe, efficient, and comfortable residential spaces.",
      image: "/assets/img/hm-banner-03.jpg",
      buttonText: "Explore Residential Solutions",
      buttonLink: "#",
    },
  ];

  return (
    <>
      {/* ===================================
          VECTOR ENGINEERS - HERO BANNER
      =================================== */}

      <div className="banner-area banner-area-1">
        <div className="banner-slider">
          <Slider {...settings}>
            {bannerData.map((banner) => (
              <div key={banner.id}>
                <div
                  className="item"
                  style={{
                    backgroundImage: `linear-gradient(
                      90deg,
                      rgba(8, 30, 52, 0) 0%,
                      rgba(8, 30, 52, 0) 45%,
                      rgba(8, 30, 52, 0.12) 100%
                    ), url("${banner.image}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <div className="container">
                    <div className="row">
                      <div className="col-xl-8 col-lg-8 col-md-10">
                        <div className="banner-inner style-white">

                          {/* Banner Subtitle */}
                          <span
                            className="b-animate-1"
                            style={{
                              display: "block",
                              color: "#8DD5FF",
                              fontSize: "13px",
                              fontWeight: "600",
                              letterSpacing: "2px",
                              marginBottom: "20px",
                              textTransform: "uppercase",
                            }}
                          >
                            {banner.subtitle}
                          </span>

                          {/* Banner Heading */}
                          <h1 className="b-animate-2 title">
                            {banner.title}
                          </h1>

                          {/* Banner Description */}
                          <p className="b-animate-3 content">
                            {banner.description}
                          </p>

                          {/* Banner Buttons */}
                          <div className="btn-wrap">
                            <Link
                              className="btn btn-base b-animate-4"
                              to={banner.buttonLink}
                            >
                              {banner.buttonText}
                              <FaArrowRight
                                style={{
                                  marginLeft: "10px",
                                  fontSize: "12px",
                                }}
                              />
                            </Link>

                            <Link
                              className="btn btn-white b-animate-4"
                              to="#"
                            >
                              Contact Us
                            </Link>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* banner end */}
    </>
  );
};

export default BannerOne;
