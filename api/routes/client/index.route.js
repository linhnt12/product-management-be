const homeRoutes = require("./home.route");
const productRoutes = require("./product.route");
const searchRoutes = require("./search.route");
const cartRoutes = require("./cart.route");
const checkoutRoutes = require("./checkout.route");
const userRoutes = require("./user.route");

const categoryMiddleware = require("../../middlewares/client/category.middleware");
const cartMiddleware = require("../../middlewares/client/cart.middleware");
const userMiddleware = require("../../middlewares/client/user.middleware");

module.exports = (app) => {
  const version = "/api/v1";

  app.use(categoryMiddleware.category);

  app.use(cartMiddleware.cartId);

  app.use(userMiddleware.infoUser);

  app.use(version + "/", homeRoutes);

  app.use(version + "/products", productRoutes);

  app.use(version + "/search", searchRoutes);

  app.use(version + "/cart", cartRoutes);

  app.use(version + "/checkout", checkoutRoutes);

  app.use(version + "/user", userRoutes);
}