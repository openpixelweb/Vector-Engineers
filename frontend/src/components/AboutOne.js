
import React from "react";
import TrackVisibility from "react-on-screen";
import CountUp from "react-countup";
import { Link } from "react-router-dom";

const AboutOne = () => {
  return (
    <>
      {/* about area start */}
      <div className='about-area pd-top-90 pd-bottom-50'>
        <div className='container'>
          <div className='about-area-inner'>
            <div className='row'>
              <div className='col-lg-6'>
                <div className='about-thumb-wrap'>
                  <img
                    className='img-1'
                    src='./assets/img/about/shape.png'
                    alt='Vector Engineers'
                  />
                  <img
                    className='img-2'
                    src='./assets/img/hm-about-01.jpg'
                    alt='Vector Engineers'
                  />
                  <img
                    className='img-3'
                    src='./assets/img/hm-about-02.jpg'
                    alt='Vector Engineers'
                  />
                  <div className='exprience-wrap'>
                    <img
                      src='./assets/img/about/shape-3.png'
                      alt='Vector Engineers'
                    />
                    <div className='details'>
                      <TrackVisibility once>
                        {({ isVisible }) =>
                          isVisible && (
                            <h1>
                              <CountUp
                                delay={0}
                                start={0}
                                end={16}
                              />
                            </h1>
                          )
                        }
                      </TrackVisibility>
                      <p>YEARS OF EXPERIENCE</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className='col-lg-6 align-self-center'>
                <div className='about-inner-wrap'>
                  <div className='section-title mb-0'>
                    <h4 className='subtitle'>
                      ABOUT VECTOR ENGINEERS
                    </h4>

                    <h2 className='title'>
                      YOUR TRUSTED PARTNER IN ELECTRICAL SOLUTIONS
                    </h2>

                    <p className='content left-line'>
                      Established in 2010, Vector Engineers
                      provides dependable electrical products
                      and solutions for industrial, commercial
                      and residential requirements. We focus
                      on quality, reliability and technical
                      expertise to support efficient and
                      safe electrical systems.
                    </p>

                    <div className='row'>
                      <div className='col-xl-6 col-lg-12 col-md-6'>
                        <ul className='list-inner-wrap mb-mb-0 mb-3 mb-lg-3 mb-xl-0'>
                          <li>
                            <img
                              src='./assets/img/icon/check.png'
                              alt='Check'
                            />{" "}
                            Electrical Product Expertise
                          </li>

                          <li>
                            <img
                              src='./assets/img/icon/check.png'
                              alt='Check'
                            />
                            Industrial & Residential Solutions
                          </li>

                          <li>
                            <img
                              src='./assets/img/icon/check.png'
                              alt='Check'
                            />
                            Trusted Electrical Brands
                          </li>

                          <li>
                            <img
                              src='./assets/img/icon/check.png'
                              alt='Check'
                            />
                            Project-Focused Support
                          </li>
                        </ul>
                      </div>

                      <div className='col-xl-6 col-lg-12 col-md-6 align-self-center'>
                        
                      </div>
                    </div>

                    <div className='btn-wrap'>
                      <Link className='btn btn-base' to='#'>
                        MORE ABOUT US
                      </Link>

                      
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* about area end */}
    </>
  );
};

export default AboutOne;
