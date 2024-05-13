const ProductCategory = require("../../models/product-category.model");

const filterStatusHelper = require("../../../helpers/filterStatus");
const searchHelper = require("../../../helpers/search");
const paginationhHelper = require("../../../helpers/pagination");
const createTreeHelper = require("../../../helpers/createTree");

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
  try {
    const filterStatus = filterStatusHelper(req.query);

    let find = {
      deleted: false
    }

    //Filter by Status
    if (req.query.status) {
      find.status = req.query.status;
    }
    // End Filter by Status

    // Search
    const objectSearch = searchHelper(req.query);

    if (objectSearch.regex) {
      find.title = objectSearch.regex;
    }
    // End Search

    // Pagination
    const countProductsCategory = await ProductCategory.countDocuments(find);

    let objectPagination = paginationhHelper({
      currentPage: 1,
      limitItems: 10
    },
      req.query,
      countProductsCategory
    );
    // End Pagination

    // Sort
    let sort = {};

    if (req.query.sortKey && req.query.sortValue) {
      sort[req.query.sortKey] = req.query.sortValue;
    } else {
      sort.position = "asc";
    }
    // End Sort

    const records = await ProductCategory.find(find)
      .sort(sort)
      .skip(objectPagination.skip);
    
    const allCategory = await ProductCategory.find(find);

    res.json({
      code: 200,
      productsCategory: records,
      pagination: objectPagination,
      allCategory: allCategory
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!"
    })
  }
}

// [POST] /admin/products-category/create
module.exports.create = async (req, res) => {
  try {
    if (req.body.position == "") {
      const count = await ProductCategory.countDocuments();
      req.body.position = count + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }

    const productCategory = new ProductCategory(req.body);
    await productCategory.save();

    res.json({
      code: 200,
      productCategory: productCategory
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!"
    })
  }
}

// [PATCH] /admin/products-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.params.status;

    await ProductCategory.updateOne({
      _id: id
    }, {
      status: status
    });

    res.json({
      code: 200,
      message: "Thay đổi trạng thái thành công!"
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tồn tại!"
    })
  }
}

// [PATCH] /admin/products-category/change-multi
module.exports.changeMulti = async (req, res) => {
  try {
    const {
      ids,
      key,
      value
    } = req.body;

    switch (key) {
      case "status":
        await ProductCategory.updateMany({
          _id: {
            $in: ids
          }
        }, {
          status: value
        });
        res.json({
          code: 200,
          message: "Thay đổi trạng thái thành công!"
        })
        break;

      case "delete":
        await ProductCategory.updateMany({
          _id: {
            $in: ids
          }
        }, {
          deleted: true,
          deletedAt: new Date()
        });
        res.json({
          code: 200,
          message: "Xoá thành công!"
        })
        break;

      default:
        res.json({
          code: 400,
          message: "Không tồn tại!"
        })
        break;
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tồn tại!"
    })
  }
}

// [PATCH] /admin/products-category/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    await ProductCategory.updateOne({
      _id: id
    }, {
      deleted: true,
      deletedAt: new Date()
    });

    res.json({
      code: 200,
      message: "Xoá thành công!"
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tồn tại!"
    })
  }
}

// [PATCH] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    req.body.position = parseInt(req.body.position);

    await ProductCategory.updateOne({
      _id: id
    }, req.body);

    res.json({
      code: 200,
      message: "Chỉnh sửa sản phẩm thành công!"
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!"
    })
  }
}

// [GET] /admin/products-category/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;

    let find = {
      deleted: false,
      _id: id
    };

    const record = await ProductCategory.findOne(find);

    res.json({
      code: 200,
      productCategory: record
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!"
    })
  }
}