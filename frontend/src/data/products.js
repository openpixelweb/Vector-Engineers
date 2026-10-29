
export const productCategories = [
  {
    id: "metering",
    name: "Energy Metering & Management",
  },
  {
    id: "switchgear",
    name: "LT Switchgear & Distribution",
  },
  {
    id: "protection",
    name: "Electrical Protection & Safety",
  },
  {
    id: "control",
    name: "Power Control & Changeover",
  },
  {
    id: "cables",
    name: "Wires & Cables",
  },
  {
    id: "instruments",
    name: "Electrical Measuring Instruments",
  },
  {
    id: "components",
    name: "Control Panel Components",
  },
  {
    id: "distribution",
    name: "Power Distribution Solutions",
  },
];

/*
  Product images:
  public/assets/img/products/

  Replace the image filenames with actual
  manufacturer product photographs.

  Categories can later come from a backend API.
*/

export const products = [
  {
    id: 1,
    name: "Digital Energy Meters",
    category: "metering",
    image: "/assets/img/prodcuts-ve-01.jpg",
    description: "Digital solutions for electrical energy measurement.",
  },
  {
    id: 2,
    name: "Prepaid Energy Meters",
    category: "metering",
    image: "/assets/img/prodcuts-ve-02.jpg",
    description: "Metering products for prepaid energy applications.",
  },
  {
    id: 3,
    name: "Smart Energy Meters",
    category: "metering",
    image: "/assets/img/prodcuts-ve-03.jpg",
    description: "Smart metering options for connected energy monitoring.",
  },
  {
    id: 4,
    name: "Multifunction Meters",
    category: "metering",
    image: "/assets/img/prodcuts-ve-04.jpg",
    description: "Monitoring of multiple electrical parameters.",
  },
  {
    id: 5,
    name: "Maximum Demand Controllers",
    category: "metering",
    image: "/assets/img/prodcuts-ve-05.jpg",
    description: "Products for electrical demand monitoring and control.",
  },
  {
    id: 6,
    name: "Power Quality Meters",
    category: "metering",
    image: "/assets/img/prodcuts-ve-06.jpg",
    description: "Instruments for monitoring power quality parameters.",
  },
  {
    id: 7,
    name: "Air Circuit Breakers (ACB)",
    category: "switchgear",
    image: "/assets/img/prodcuts-ve-07.jpg",
    description: "Low-voltage circuit protection and switching equipment.",
  },
  {
    id: 8,
    name: "Moulded Case Circuit Breakers",
    category: "switchgear",
    image: "/assets/img/prodcuts-ve-08.jpg",
    description: "Circuit protection for electrical distribution.",
  },
  {
    id: 9,
    name: "Miniature Circuit Breakers",
    category: "switchgear",
    image: "/assets/img/prodcuts-ve-09.jpg",
    description: "Protection devices for low-voltage circuits.",
  },
  {
    id: 10,
    name: "Motor Protection Circuit Breakers",
    category: "switchgear",
    image: "/assets/img/products/mpcb.jpg",
    description: "Electrical protection products for motor circuits.",
  },
  {
    id: 11,
    name: "MCB Distribution Boards",
    category: "switchgear",
    image: "/assets/img/products/mcb-distribution-board.jpg",
    description: "Distribution boards for organized electrical circuits.",
  },
  {
    id: 12,
    name: "Earth Leakage Relays",
    category: "protection",
    image: "/assets/img/products/earth-leakage-relay.jpg",
    description: "Earth leakage detection and protection applications.",
  },
  {
    id: 13,
    name: "Core Balance Current Transformers",
    category: "protection",
    image: "/assets/img/products/cbct.jpg",
    description: "Current sensing components for earth leakage systems.",
  },
  {
    id: 14,
    name: "RCCBs & RCBOs",
    category: "protection",
    image: "/assets/img/products/rccb-rcbo.jpg",
    description: "Residual current protection devices.",
  },
  {
    id: 15,
    name: "ElGuard EG100 Relays",
    category: "protection",
    image: "/assets/img/products/elguard-eg100.jpg",
    description: "Electrical protection relay products.",
  },
  {
    id: 16,
    name: "Automatic Changeover Devices",
    category: "control",
    image: "/assets/img/products/automatic-changeover.jpg",
    description: "Source switching and changeover applications.",
  },
  {
    id: 17,
    name: "Automatic Transfer Switches",
    category: "control",
    image: "/assets/img/products/automatic-transfer-switch.jpg",
    description: "Electrical source transfer products.",
  },
  {
    id: 18,
    name: "Manual Transfer Switches",
    category: "control",
    image: "/assets/img/products/manual-transfer-switch.jpg",
    description: "Manual source selection and switching.",
  },
  {
    id: 19,
    name: "Power Contactors",
    category: "control",
    image: "/assets/img/products/power-contactor.jpg",
    description: "Electrical switching components for control circuits.",
  },
  {
    id: 20,
    name: "Overload Relays",
    category: "control",
    image: "/assets/img/products/overload-relay.jpg",
    description: "Overload protection components for motor circuits.",
  },
  {
    id: 21,
    name: "PVC-FR & FR-LSH Wires",
    category: "cables",
    image: "/assets/img/products/fr-wires.jpg",
    description: "Flame-retardant and low-smoke wiring options.",
  },
  {
    id: 22,
    name: "HFFR Cables",
    category: "cables",
    image: "/assets/img/products/hffr-cables.jpg",
    description: "Halogen-free flame-retardant cabling.",
  },
  {
    id: 23,
    name: "Instrumentation Cables",
    category: "cables",
    image: "/assets/img/products/instrumentation-cables.jpg",
    description: "Cabling for instrumentation applications.",
  },
  {
    id: 24,
    name: "Fire Alarm & Fire Survival Cables",
    category: "cables",
    image: "/assets/img/products/fire-survival-cables.jpg",
    description: "Specialized cables for fire-related systems.",
  },
  {
    id: 25,
    name: "Digital Ammeters",
    category: "instruments",
    image: "/assets/img/products/ammeter.jpg",
    description: "Current measurement and display instruments.",
  },
  {
    id: 26,
    name: "Digital Voltmeters",
    category: "instruments",
    image: "/assets/img/products/voltmeter.jpg",
    description: "Voltage measurement and display instruments.",
  },
  {
    id: 27,
    name: "Push Buttons & Indication Lamps",
    category: "components",
    image: "/assets/img/products/push-buttons.jpg",
    description: "Operator controls and visual status indicators.",
  },
  {
    id: 28,
    name: "Electrical Panel Accessories",
    category: "components",
    image: "/assets/img/products/panel-accessories.jpg",
    description: "Supporting components for electrical panel assembly.",
  },
  {
    id: 29,
    name: "Low-Voltage Distribution Solutions",
    category: "distribution",
    image: "/assets/img/products/lv-distribution.jpg",
    description: "A selection of electrical distribution components.",
  },
  {
    id: 30,
    name: "Energy Monitoring Solutions",
    category: "distribution",
    image: "/assets/img/products/energy-monitoring.jpg",
    description: "Metering and monitoring products for distribution.",
  },
];
