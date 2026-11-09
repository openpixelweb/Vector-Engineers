
require("dotenv").config();

const dns = require("node:dns");
const app = require("./app");
const { connectDatabase } = require("./config/database");

// Workaround for Node.js SRV DNS resolution failures.
// Can be changed or disabled through the .env file.
const dnsServers = (process.env.DNS_SERVERS || "8.8.8.8,1.1.1.1")
  .split(",")
  .map((server) => server.trim())
  .filter(Boolean);

if (dnsServers.length > 0) {
  dns.setServers(dnsServers);
}

async function start() {
  const port = Number(process.env.PORT) || 5000;

  try {
    await connectDatabase();

    app.listen(port, () => {
      console.log("=================================");
      console.log("Vector Engineers Backend Running");
      console.log(`API: http://localhost:${port}`);
      console.log(
        `Health: http://localhost:${port}/api/v1/health`
      );
      console.log("=================================");
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exitCode = 1;
  }
}

start();
