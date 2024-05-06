const Order = require("../../models/order.model");
const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");

const productsHelper = require("../../../helpers/products");

// [POST] /checkout/order
module.exports.order = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;
    const userInfo = req.body;

    const cart = await Cart.findOne({
      _id: cartId
    });

    let products = [];

    for (const product of cart.products) {
      const objectProduct = {
        product_id: product.product_id,
        price: 0,
        discountPercentage: 0,
        quantity: product.quantity
      };

      const productInfo = await Product.findOne({
        _id: product.product_id
      });

      objectProduct.price = productInfo.price;
      objectProduct.discountPercentage = productInfo.discountPercentage;

      products.push(objectProduct);
    }

    const objectOrder = {
      user_id: cart.user_id,
      cart_id: cartId,
      userInfo: userInfo,
      products: products
    };

    const order = new Order(objectOrder);
    await order.save();

    await Cart.updateOne({
      _id: cartId
    }, {
      products: []
    })

    res.json({
      code: 200,
      message: "Thanh toán thành công!",
      order: order
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!"
    })
  }
}

// [GET] /checkout/success/:orderId
module.exports.success = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId
    });

    for (const product of order.products) {
      const productInfo = await Product.findOne({
        _id: product.product_id
      }).select("title thumbnail");

      product.productInfo = productInfo;

      product.priceNew = productsHelper.priceNewProduct(product);

      product.totalPrice = product.priceNew*product.quantity;
    }

    let productsInfo = [];

    order.products.map(item => {
      productsInfo.push(item.productInfo);
    })

    order.totalPrice = order.products.reduce((sum, item) => sum + item.totalPrice , 0);
    
    res.json({
      code: 200,
      order: order,
      totalPrice: order.totalPrice,
      productInfo: productsInfo
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!"
    })
  }
}