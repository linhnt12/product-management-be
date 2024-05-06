const systemConfig = require("../../../config/system.js");

const dashboardRoutes = require("./dashboard.route");
const productRoutes = require("./product.route.js");
const productCategoryRoutes = require("./product-category.route.js");
const accountRoutes = require("./account.route.js");
const authRoutes = require("./auth.route.js");
const myAccountRoutes = require("./my-account.route.js");

const authMiddleware = require("../../middlewares/admin/auth.middleware");

module.exports = (app) => {
  const version = "/api/v1";
  const PATH_ADMIN = systemConfig.prefixAdmin;

  app.use(version + PATH_ADMIN + "/dashboard", authMiddleware.requireAuth, dashboardRoutes);

  app.use(version + PATH_ADMIN + "/products", authMiddleware.requireAuth, productRoutes);

  app.use(version + PATH_ADMIN + "/products-category", authMiddleware.requireAuth, productCategoryRoutes);

  app.use(version + PATH_ADMIN + "/accounts", authMiddleware.requireAuth, accountRoutes);

  app.use(version + PATH_ADMIN + "/auth", authRoutes);

  app.use(version + PATH_ADMIN + "/my-account", authMiddleware.requireAuth, myAccountRoutes);
}