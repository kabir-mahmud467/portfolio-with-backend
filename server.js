require("dotenv").config();

const { connectDB } = require("./src/config/db");
const { ensureDefaultAdmin } = require("./src/controllers/authController");
const app = require("./src/app");

const PORT = process.env.PORT || 3000;

async function start() {
  await connectDB();
  await ensureDefaultAdmin();
  app.listen(PORT, () => {
    console.log(`Kabir Mahmud portfolio running on port ${PORT}`);
  });
}

start().catch((error) => {
  console.error("Server startup failed:", error);
  process.exit(1);
});
