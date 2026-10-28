
import React from "react";
import CountUp from "react-countup";
import TrackVisibility from "react-on-screen";

const CounterOne = () => {
  // Replace these values with verified company figures.

const stats = {
  experience: 16,
  clients: 500,   // Example: confirm actual count
  projects: 250,  // Example: confirm actual count
  brands: 6,
};


  return (
    <>
      {/*fact-area start*/}
      <div className='container'>
        <div
          className='fact-counter-area'
          style={{ background: "url(assets/img/fact/bg.png)" }}
        >
          <div className='row justify-content-center'>
            <div className='col-lg-3 col-md-6'>
              <div className='single-fact-wrap'>
                <h2>
                  <TrackVisibility once>
                    {({ isVisible }) =>
                      isVisible && (
                        <span className='counter'>
                          <CountUp delay={0} start={0} end={stats.experience} />+
                        </span>
                      )
                    }
                  </TrackVisibility>
                </h2>
                <h5>YEARS OF EXPERIENCE</h5>
                {/* <p>
                  Building expertise in electrical products and
                  solutions for diverse project requirements.
                </p> */}
              </div>
            </div>

            <div className='col-lg-3 col-md-6'>
              <div className='single-fact-wrap'>
                <h2>
                  <TrackVisibility once>
                    {({ isVisible }) =>
                      isVisible && (
                        <span className='counter'>
                          <CountUp delay={0} start={0} end={stats.clients} />+
                        </span>
                      )
                    }
                  </TrackVisibility>
                </h2>
                <h5>CLIENTS SERVED</h5>
                {/* <p>
                  Supporting customers with dependable electrical
                  products and technical guidance.
                </p> */}
              </div>
            </div>

            <div className='col-lg-3 col-md-6'>
              <div className='single-fact-wrap'>
                <h2>
                  <TrackVisibility once>
                    {({ isVisible }) =>
                      isVisible && (
                        <span className='counter'>
                          <CountUp delay={0} start={0} end={stats.projects} />+
                        </span>
                      )
                    }
                  </TrackVisibility>
                </h2>
                <h5>PROJECTS SUPPORTED</h5>
                {/* <p>
                  Serving industrial, commercial and residential
                  electrical project requirements.
                </p> */}
              </div>
            </div>

            <div className='col-lg-3 col-md-6'>
              <div className='single-fact-wrap after-none'>
                <h2>
                  <TrackVisibility once>
                    {({ isVisible }) =>
                      isVisible && (
                        <span className='counter'>
                          <CountUp delay={0} start={0} end={stats.brands} />+
                        </span>
                      )
                    }
                  </TrackVisibility>
                </h2>
                <h5>BRAND PARTNERS</h5>
                {/* <p>
                  Offering a diverse portfolio of electrical
                  products from established brands.
                </p> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*fact-area end*/}
    </>
  );
};

export default CounterOne;
