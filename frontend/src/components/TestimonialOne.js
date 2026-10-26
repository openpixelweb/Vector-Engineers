
import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Slider from "react-slick";

const TestimonialOne = () => {
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
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          arrows: false,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };

  return (
    <>
      {/* testimonial area start */}
      <div className='testimonial-area pd-top-115 pd-bottom-50'>
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-lg-6'>
              <div className='section-title text-center mb-0'>
                <h4 className='subtitle'>CLIENT TESTIMONIALS</h4>
                <h2 className='title'>WHAT OUR CLIENTS SAY</h2>
                <p className='content'>
                  Discover how our electrical product expertise,
                  dependable solutions and customer-focused
                  approach support diverse project requirements.
                </p>
                <p className='content'>
                  Sample testimonials for design preview.
                </p>
              </div>
            </div>
          </div>

          <div className='testimonial-slider owl-carousel'>
            <Slider {...settings}>

              {/* Testimonial 01 */}
              <div className='item'>
                <div className='single-testimonial-wrap'>
                  <div className='icon'>
                    <img
                      src='assets/img/testimonial/quote.png'
                      alt='Quotation'
                    />
                  </div>
                  <p>
                    “Vector Engineers provided excellent guidance
                    in selecting electrical products for our
                    manufacturing facility. Their technical
                    knowledge and professional approach made
                    the entire process smooth and efficient.”
                  </p>
                  <div className='client-wrap'>
                    <div className='thumb'>
                      <img
                        src='assets/img/male.png'
                        alt='Sample client photograph'
                      />
                    </div>
                    <div className='details'>
                      <h5>RAJESH KUMAR</h5>
                      <p>Plant Operations Manager</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial 02 */}
              <div className='item'>
                <div className='single-testimonial-wrap'>
                  <div className='icon'>
                    <img
                      src='assets/img/testimonial/quote.png'
                      alt='Quotation'
                    />
                  </div>
                  <p>
                    “We were impressed with the range of
                    electrical products and the technical
                    support offered by Vector Engineers.
                    Their solutions helped us identify
                    suitable products for our commercial
                    building requirements.”
                  </p>
                  <div className='client-wrap'>
                    <div className='thumb'>
                      <img
                        src='assets/img/female.png'
                        alt='Sample client photograph'
                      />
                    </div>
                    <div className='details'>
                      <h5>PRIYA SHARMA</h5>
                      <p>Project Consultant</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial 03 */}
              <div className='item'>
                <div className='single-testimonial-wrap'>
                  <div className='icon'>
                    <img
                      src='assets/img/testimonial/quote.png'
                      alt='Quotation'
                    />
                  </div>
                  <p>
                    “From electrical distribution to circuit
                    protection, the team helped us choose
                    suitable products for our residential
                    development. Their product knowledge
                    and responsive communication were valuable.”
                  </p>
                  <div className='client-wrap'>
                    <div className='thumb'>
                      <img
                        src='assets/img/male.png'
                        alt='Sample client photograph'
                      />
                    </div>
                    <div className='details'>
                      <h5>ANIL REDDY</h5>
                      <p>Residential Project Manager</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial 04 */}
              <div className='item'>
                <div className='single-testimonial-wrap'>
                  <div className='icon'>
                    <img
                      src='assets/img/testimonial/quote.png'
                      alt='Quotation'
                    />
                  </div>
                  <p>
                    “Vector Engineers has been helpful in
                    understanding our electrical component
                    requirements. Their comprehensive product
                    portfolio and practical guidance made
                    sourcing the right solutions easier.”
                  </p>
                  <div className='client-wrap'>
                    <div className='thumb'>
                      <img
                        src='assets/img/male.png'
                        alt='Sample client photograph'
                      />
                    </div>
                    <div className='details'>
                      <h5>SANDEEP MEHTA</h5>
                      <p>Electrical Contractor</p>
                    </div>
                  </div>
                </div>
              </div>

            </Slider>
          </div>
        </div>
      </div>
      {/* testimonial area end */}
    </>
  );
};

export default TestimonialOne;
