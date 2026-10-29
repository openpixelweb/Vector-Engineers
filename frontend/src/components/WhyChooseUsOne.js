
import React, { useState } from "react";

const WhyChooseUsOne = () => {
  const [] = useState(false);

  return (
    <>
      {/*wcu-area start*/}
      <div
        className='wcu-area bg-overlay'
      
      >
        
        

        <div className='container'>
          <div className='row justify-content-center'>

            <div className='col-xl-7 col-lg-6 order-lg-2'>
              <div className='video-thumb-wrap'>
                <img
                  src='assets/img/why-ch-hm.jpg'
                  alt='Vector Engineers Electrical Solutions'
                />
                
              </div>
            </div>

            <div className='col-xl-5 col-lg-6 order-lg-1'>
              <div className='section-title style-white mb-0'>

                

                <h2 className='title'>
                  YOUR TRUSTED ELECTRICAL SOLUTIONS PARTNER
                </h2>

                <p className='content'>
                  Combining technical expertise, quality electrical
                  products and a customer-focused approach to support
                  industrial, commercial and residential requirements.
                </p>

              </div>

              <div className='single-wcu-wrap'>
                <div className='icon'>
                  <img
                    src='assets/img/wcu/icon-1.png'
                    alt='Technical Expertise'
                  />
                </div>

                <div className='details'>
                  <h6>TECHNICAL EXPERTISE</h6>
                  <p>
                    Practical product knowledge and guidance to help
                    identify suitable electrical solutions for
                    every project.
                  </p>
                </div>
              </div>

              <div className='single-wcu-wrap'>
                <div className='icon'>
                  <img
                    src='assets/img/wcu/icon-2.png'
                    alt='Comprehensive Product Portfolio'
                  />
                </div>

                <div className='details'>
                  <h6>COMPREHENSIVE PRODUCT PORTFOLIO</h6>
                  <p>
                    A wide selection of electrical products from
                    established brands for diverse industries
                    and applications.
                  </p>
                </div>
              </div>

              <div className='single-wcu-wrap'>
                <div className='icon'>
                  <img
                    src='assets/img/wcu/icon-3.png'
                    alt='Project Focused Support'
                  />
                </div>

                <div className='details'>
                  <h6>PROJECT-FOCUSED SUPPORT</h6>
                  <p>
                    A commitment to understanding project needs
                    and supporting customers with dependable
                    product choices.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      {/*wcu-area end*/}
    </>
  );
};

export default WhyChooseUsOne;
