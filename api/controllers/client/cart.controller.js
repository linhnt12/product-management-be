const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");

const productsHelper = require("../../../helpers/products");

// [GET] /cart
module.exports.index = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({
      _id: cartId
    });

    const productsInfo = [];

    if (cart.products.length > 0) {
      for (const item of cart.products) {
        const productId = item.product_id;

        const productInfo = await Product.findOne({
          _id: productId
        });

        productInfo.priceNew = productsHelper.priceNewProduct(productInfo);

        productsInfo.push(productInfo);

        item.totalPrice = item.quantity * productInfo.priceNew;
      }
    }

    cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0);

    res.json({
      code: 200,
      cart: cart,
      productsInfo: productsInfo,
      totalPrice: cart.totalPrice
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!"
    })
  }
}

// [POST] /cart/add/:productId
module.exports.add = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);

    const cart = await Cart.findOne({
      _id: cartId
    });

    const existProductInCart = cart.products.find(item => item.product_id == productId);

    if (existProductInCart) {
      const newQuantity = quantity + existProductInCart.quantity;

      await Cart.updateOne({
        _id: cartId,
        'products.product_id': productId
      }, {
        'products.$.quantity': newQuantity
      });
    } else {
      const objectCart = {
        product_id: productId,
        quantity: quantity
      }

      await Cart.updateOne({
        _id: cartId
      }, {
        $push: {
          products: objectCart
        }
      })
    }

    res.json({
      code: 200,
      message: "Thêm sản phẩm thành công!"
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!"
    })
  }

}

// [GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;

    await Cart.updateOne({
      _id: cartId
    }, {
      "$pull": { products: { "product_id": productId}}
    })

    res.json({
      code: 200,
      message: "Xoá sản phẩm khỏi giỏ hàng!"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!"
    })
  }
}

// [GET] /cart/update/:productId/:quantity
module.exports.update = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity  = req.params.quantity;

    await Cart.updateOne({
      _id: cartId,
      'products.product_id': productId
    }, {
      'products.$.quantity': quantity
    })

    res.json({
      code: 200,
      message: "Cập nhật số lượng thành công!"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!"
    })
  }
}