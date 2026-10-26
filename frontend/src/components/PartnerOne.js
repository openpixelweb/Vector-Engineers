
import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Slider from "react-slick";

const PartnerOne = () => {
  function SampleNextArrow(props) {
    const { className, onClick } = props;
    return <FaArrowLeft className={className} onClick={onClick} />;
  }

  function SamplePrevArrow(props) {
    const { className, onClick } = props;
    return <FaArrowRight className={className} onClick={onClick} />;
  }

  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 6,
    slidesToScroll: 1,
    initialSlide: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 4,
          arrows: false,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };

  return (
    <>
      {/*partner-area start*/}
      <div className='partner-area pd-top-90 pd-bottom-70'>
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-lg-7'>
              <div className='section-title text-center'>
                <h4 className='subtitle'>OUR BRANDS</h4>
                <h2 className='title'>
                  TRUSTED BRANDS. RELIABLE SOLUTIONS.
                </h2>
                <p className='content'>
                  Explore our portfolio of established electrical
                  brands offering dependable products for power
                  distribution, energy management, protection,
                  control and residential applications.
                </p>
              </div>
            </div>
          </div>

          <div className='partner-slider owl-carousel'>
            <Slider {...settings}>
              <div className='item'>
                <div className='thumb'>
                  <img
                    src='assets/img/1.jpg'
                    alt='Elmeasure - Energy Metering and Management'
                  />
                </div>
              </div>

              <div className='item'>
                <div className='thumb'>
                  <img
                    src='assets/img/2.jpg'
                    alt='C&S Electric - Switchgear and Protection'
                  />
                </div>
              </div>

              <div className='item'>
                <div className='thumb'>
                  <img
                    src='assets/img/3.jpg'
                    alt='Powerflex - Wires and Cables'
                  />
                </div>
              </div>

              <div className='item'>
                <div className='thumb'>
                  <img
                    src='assets/img/4.jpg'
                    alt='V-Guard - Residential Electrical Products'
                  />
                </div>
              </div>

              <div className='item'>
                <div className='thumb'>
                  <img
                    src='assets/img/5.jpg'
                    alt='Neptune India - Industrial Electrical Products'
                  />
                </div>
              </div>

              <div className='item'>
                <div className='thumb'>
                  <img
                    src='assets/img/6.jpg'
                    alt='Trinity Touch - Electrical Components and Enclosures'
                  />
                </div>
              </div>

              <div className='item'>
                <div className='thumb'>
                  <img
                    src='assets/img/7.jpg'
                    alt='C&S Electric - Switchgear and Protection'
                  />
                </div>
              </div>

              <div className='item'>
                <div className='thumb'>
                  <img
                    src='assets/img/8.jpg'
                    alt='Powerflex - Wires and Cables'
                  />
                </div>
              </div>

              <div className='item'>
                <div className='thumb'>
                  <img
                    src='assets/img/9.jpg'
                    alt='V-Guard - Residential Electrical Products'
                  />
                </div>
              </div>

              <div className='item'>
                <div className='thumb'>
                  <img
                    src='assets/img/10.jpg'
                    alt='Neptune India - Industrial Electrical Products'
                  />
                </div>
              </div>
              <div className='item'>
                <div className='thumb'>
                  <img
                    src='assets/img/11.jpg'
                    alt='Neptune India - Industrial Electrical Products'
                  />
                </div>
              </div>
              <div className='item'>
                <div className='thumb'>
                  <img
                    src='assets/img/12.jpg'
                    alt='Neptune India - Industrial Electrical Products'
                  />
                </div>
              </div>
              <div className='item'>
                <div className='thumb'>
                  <img
                    src='assets/img/13.jpg'
                    alt='Neptune India - Industrial Electrical Products'
                  />
                </div>
              </div>
              <div className='item'>
                <div className='thumb'>
                  <img
                    src='assets/img/14.jpg'
                    alt='Neptune India - Industrial Electrical Products'
                  />
                </div>
              </div>
              <div className='item'>
                <div className='thumb'>
                  <img
                    src='assets/img/15.jpg'
                    alt='Neptune India - Industrial Electrical Products'
                  />
                </div>
              </div>
            </Slider>
          </div>
        </div>
      </div>
      {/*partner-area end*/}
    </>
  );
};

export default PartnerOne;
