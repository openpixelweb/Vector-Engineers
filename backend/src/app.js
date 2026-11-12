
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

// ============================================
// VECTOR ENGINEERS BACKEND ROUTES
// ============================================

const healthRoutes = require("./routes/health.routes");
const catalogRoutes = require("./routes/catalog.routes");
const authRoutes = require("./routes/auth.routes");
const adminCatalogRoutes = require("./routes/admin-catalog.routes");
const media = require("./routes/media.routes");
const publicCatalogueRoutes = require(
  "./routes/public-catalogue.routes"
);

// ============================================
// INITIALIZE EXPRESS APPLICATION
// ============================================

const app = express();

app.disable("x-powered-by");

// ============================================
// SECURITY MIDDLEWARE
// ============================================

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

// ============================================
// CORS CONFIGURATION
// ============================================

// Add your actual frontend and admin domains
// to CLIENT_ORIGIN in the production environment.

const origins = (
  process.env.CLIENT_ORIGIN ||
  "http://localhost:3000,http://127.0.0.1:5174"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: origins,
  })
);

// ============================================
// BODY PARSER
// ============================================

app.use(
  express.json({
    limit: "250kb",
  })
);


/* ==========================================
   PERMANENT CLOUD MEDIA FILE DELIVERY
========================================== */

app.use("/media", media.publicRouter);


// ============================================
// BACKEND HOME PAGE - NEW
// ============================================

// This fixes the "Route not found" message
// when opening your Cloud Run root URL.

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,

    application: "Vector Engineers Backend API",

    message:
      "Vector Engineers backend is running successfully.",

    version: "1.0.0",

    environment:
      process.env.NODE_ENV || "development",

    endpoints: {
      health: "/api/v1/health",

      products: "/api/v1/catalogue/products",

      adminLogin: "/api/v1/admin/login",
    },
  });
});

// ============================================
// HEALTH CHECK
// ============================================

app.use(
  "/api/v1/health",
  healthRoutes
);

// ============================================
// ADMIN MEDIA UPLOADS
// ============================================

app.use(
  "/api/v1/admin/media",
  media.router
);

// ============================================
// ADMIN CATALOGUE MANAGEMENT
// ============================================

app.use(
  "/api/v1/admin/catalog",
  adminCatalogRoutes
);

// ============================================
// PUBLIC PRODUCTS CATALOGUE
// ============================================

// Includes product/model detail routes and
// any industry/application routes already
// defined in public-catalogue.routes.js.

app.use(
  "/api/v1/catalogue",
  publicCatalogueRoutes
);

// ============================================
// ADMIN AUTHENTICATION
// ============================================

app.use(
  "/api/v1/admin",
  authRoutes
);

// ============================================
// OTHER PUBLIC API ROUTES
// ============================================

app.use(
  "/api/v1",
  catalogRoutes
);

// ============================================
// 404 - ROUTE NOT FOUND
// ============================================

// Must remain after all valid routes.

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ============================================
// GLOBAL ERROR HANDLER
// ============================================

app.use((err, req, res, next) => {
  console.error(
    "Vector Engineers API error:",
    err.message
  );

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// ============================================
// EXPORT APPLICATION
// ============================================

module.exports = app;
