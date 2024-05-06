const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");

const productsHelper = require("../../../helpers/products");
const productsCategoryHelper = require("../../../helpers/product-category");
const paginationhHelper = require("../../../helpers/pagination");

// [GET] /products
module.exports.index = async (req, res) => {
  try {
    const find = {
      status: "active",
      deleted: false
    };

    // Pagination
    const countProducts = await Product.countDocuments(find);

    let objectPagination = paginationhHelper({
        currentPage: 1,
        limitItems: 18
      },
      req.query,
      countProducts
    );
    // End Pagination

    // Sort
    let sort = {};

    if (req.query.sortKey && req.query.sortValue) {
      sort[req.query.sortKey] = req.query.sortValue;
    } else {
      sort.position = "desc";
    }
    // End Sort

    const products = await Product.find(find)
      .sort(sort)
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip);

    const newProducts = productsHelper.priceNewProducts(products);

    res.json({
      code: 200,
      products: newProducts,
      productsCategory: res.productsCategory,
      pagination: objectPagination
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!"
    })
  }

}

// [GET] /products/detail/:slug
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slug,
      status: "active"
    }
    const product = await Product.findOne(find);

    if (product.product_category_id) {
      const category = await ProductCategory.findOne({
        _id: product.product_category_id,
        status: "active",
        deleted: false
      });

      product.category = category;
    }

    product.priceNew = productsHelper.priceNewProduct(product);

    res.json({
      code: 200,
      product: product
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!"
    })
  }

}

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
  try {
    const category = await ProductCategory.findOne({
      slug: req.params.slugCategory,
      deleted: false,
      status: "active"
    });

    const listSubCategory = await productsCategoryHelper.getSubCategory(category.id);

    const listSubCategoryId = listSubCategory.map(item => item.id);

    const find = {
      product_category_id: {
        $in: [category.id, ...listSubCategoryId]
      },
      deleted: false,
      status: "active"
    }

    // Pagination
    const countProducts = await Product.countDocuments(find);

    let objectPagination = paginationhHelper({
        currentPage: 1,
        limitItems: 18
      },
      req.query,
      countProducts
    );
    // End Pagination

    // Sort
    let sort = {};

    if (req.query.sortKey && req.query.sortValue) {
      sort[req.query.sortKey] = req.query.sortValue;
    } else {
      sort.position = "desc";
    }
    // End Sort

    const products = await Product.find(find)
      .sort(sort)
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip);

    const newProducts = productsHelper.priceNewProducts(products);

    res.json({
      code: 200,
      products: newProducts,
      category: category,
      pagination: objectPagination,
      countProducts: countProducts
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!"
    })
  }
}