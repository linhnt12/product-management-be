const Account = require("../../models/account.model");
const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const User = require("../../models/user.model");

// [GET] /admin/dashboard
module.exports.dashboard = async (req, res) => {
  try {
    const account = await Account.findOne({
      _id: req.account.id
    }).select("-password -token");

    const statistic = {
      categoryProduct: {
        total: 0,
        active: 0,
        inactive: 0,
      },
      product: {
        total: 0,
        active: 0,
        inactive: 0,
      },
      user: {
        total: 0,
        active: 0,
        inactive: 0,
      }
    }
  
    // ProductCategory
    statistic.categoryProduct.total = await ProductCategory.countDocuments({
      deleted: false
    })
  
    statistic.categoryProduct.active = await ProductCategory.countDocuments({
      status: "active",
      deleted: false
    })
  
    statistic.categoryProduct.inactive = await ProductCategory.countDocuments({
      status: "inactive",
      deleted: false
    })
    // End ProductCategory
  
    // Product
    statistic.product.total = await Product.countDocuments({
      deleted: false
    })
  
    statistic.product.active = await Product.countDocuments({
      status: "active",
      deleted: false
    })
  
    statistic.product.inactive = await Product.countDocuments({
      status: "inactive",
      deleted: false
    })
    // End Product
  
     // User
     statistic.user.total = await User.countDocuments({
      deleted: false
    })
  
    statistic.user.active = await User.countDocuments({
      status: "active",
      deleted: false
    })
  
    statistic.user.inactive = await User.countDocuments({
      status: "inactive",
      deleted: false
    })
    // End User

    res.json({
      code: 200,
      account: account,
      statistic: statistic
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!"
    })
  }
}