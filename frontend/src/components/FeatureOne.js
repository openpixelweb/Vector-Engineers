
import React from "react";

import {
  FaBolt,
  FaShieldAlt,
  FaPlug,
  FaCogs,
  FaLightbulb,
  FaFan,
  FaWater,
  FaNetworkWired,
  FaTools,
  FaMicrochip,
  FaWaveSquare,
  FaDigitalTachograph,
  FaSlidersH,
  FaPowerOff,
  FaTachometerAlt,
  FaServer,
  FaThLarge,
} from "react-icons/fa";




const products = [
  {
    name: "Energy Meters",
    icon: <FaDigitalTachograph />,
  },
  {
    name: "Switchgear",
    icon: <FaBolt />,
  },
  {
    name: "Circuit Breakers",
    icon: <FaShieldAlt />,
  },
  {
    name: "Wires & Cables",
    icon: <FaPlug />,
  },
  {
    name: "Control Panels",
    icon: <FaSlidersH />,
  },
  {
    name: "Industrial Automation",
    icon: <FaCogs />,
  },
  {
    name: "Distribution Boards",
    icon: <FaThLarge />,
  },
  {
    name: "Electrical Enclosures",
    icon: <FaServer />,
  },
  {
    name: "Cable Management",
    icon: <FaNetworkWired />,
  },
  {
    name: "Contactors & Relays",
    icon: <FaPowerOff />,
  },
  {
    name: "Power Quality",
    icon: <FaWaveSquare />,
  },
  {
    name: "Industrial Plugs & Sockets",
    icon: <FaTools />,
  },
  {
    name: "Switches & Sockets",
    icon: <FaPlug />,
  },
  {
    name: "Electrical Accessories",
    icon: <FaMicrochip />,
  },
  {
    name: "Fans & Ventilation",
    icon: <FaFan />,
  },
  {
    name: "Water Heaters",
    icon: <FaWater />,
  },
  {
    name: "LED Lighting",
    icon: <FaLightbulb />,
  },
  {
    name: "Energy Monitoring",
    icon: <FaTachometerAlt />,
  },
];

const FeatureOne = () => {
  return (
    <section
      className="ve-product-marquee"
      aria-label="Electrical product categories"
    >
      <div className="ve-product-marquee-track">

        {[0, 1].map((group) => (
          <div
            className="ve-product-marquee-group"
            key={group}
            aria-hidden={group === 1}
          >
            {products.map((product, index) => (
              <div
                className="ve-product-marquee-item"
                key={`${group}-${index}`}
              >
                <div className="ve-product-marquee-icon">
                  {product.icon}
                </div>

                <span className="ve-product-marquee-name">
                  {product.name}
                </span>
              </div>
            ))}
          </div>
        ))}

      </div>
    </section>
  );
};

export default FeatureOne;
