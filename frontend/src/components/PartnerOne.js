
import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Slider from "react-slick";

const PartnerOne = () => {

  function SampleNextArrow(props) {
    const { className, onClick } = props;

    return (
      <FaArrowRight
        className={className}
        onClick={onClick}
        aria-label="Next Client"
      />
    );
  }

  function SamplePrevArrow(props) {
    const { className, onClick } = props;

    return (
      <FaArrowLeft
        className={className}
        onClick={onClick}
        aria-label="Previous Client"
      />
    );
  }

  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 800,
    slidesToShow: 6,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    autoplaySpeed: 3500,
    pauseOnHover: true,
    swipeToSlide: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,

    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          arrows: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          arrows: false,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };

  const clientLogos = [
    "1.jpg",
    "2.jpg",
    "3.jpg",
    "4.jpg",
    "5.jpg",
    "6.jpg",
    "7.jpg",
    "8.jpg",
    "9.jpg",
    "10.jpg",
    "11.jpg",
    "12.jpg",
    "13.jpg",
    "14.jpg",
    "15.jpg",
  ];

  return (
    <>
      {/* ==========================================
          VECTOR ENGINEERS - OUR CLIENTS
      ========================================== */}

      <section className="partner-area pd-top-90 pd-bottom-70 ve-clients-section">

        <div className="container">

          {/* SECTION HEADING */}

          <div className="row justify-content-center">
            <div className="col-lg-8">

              <div className="section-title text-center">

                <h4 className="subtitle">
                  OUR VALUED CLIENTS
                </h4>

                <h2 className="title">
                  TRUSTED RELATIONSHIPS.
                  <br />
                  LASTING PARTNERSHIPS.
                </h2>

              </div>

            </div>
          </div>

          {/* CLIENT LOGO SLIDER */}

          <div className="partner-slider owl-carousel ve-clients-slider">

            <Slider {...settings}>

              {clientLogos.map((logo, index) => (

                <div className="item" key={logo}>

                  <div className="thumb ve-client-logo">

                    <img
                      src={`/assets/img/${logo}`}
                      alt={`Vector Engineers client logo ${index + 1}`}
                      loading="lazy"
                    />

                  </div>

                </div>

              ))}

            </Slider>

          </div>

        </div>

      </section>

      {/* CLIENTS SECTION END */}
    </>
  );
};

export default PartnerOne;
