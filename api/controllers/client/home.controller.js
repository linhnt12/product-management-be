const Product = require("../../models/product.model");

const productsHelper = require("../../../helpers/products");

// [GET] /
module.exports.index = async (req, res) => {
  try {
    // New Products
    const productsNew = await Product.find({
      status: "active",
      deleted: false
    }).sort({ position: "desc" }).limit(6);

    const newProductsNew = productsHelper.priceNewProducts(productsNew);
    // End New Products

    res.json({
      code: 200,
      productsNew: newProductsNew,
      productsCategory: res.productsCategory
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!"
    })
  }
}