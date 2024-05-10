const Product = require("../../models/product.model");

const filterStatusHelper = require("../../../helpers/filterStatus");
const searchHelper = require("../../../helpers/search");
const paginationhHelper = require("../../../helpers/pagination");

// [GET] /admin/products
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
    const countProducts = await Product.countDocuments(find);

    let objectPagination = paginationhHelper({
        currentPage: 1,
        limitItems: 10
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

    res.json({
      code: 200,
      products: products,
      filterStatus: filterStatus,
      pagination: objectPagination
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!"
    })
  }
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.params.status;

    await Product.updateOne({
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

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  try {
    const {
      ids,
      key,
      value
    } = req.body;

    switch (key) {
      case "status":
        await Product.updateMany({
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
        await Product.updateMany({
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

// [PATCH] /admin/products/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    await Product.updateOne({
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

// [POST] /admin/products/create
module.exports.create = async (req, res) => {
  try {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if (req.body.position == "") {
      const countProducts = await Product.countDocuments();
      req.body.position = countProducts + 1;
    } else {
      req.body.positon = parseInt(req.body.positon);
    }

    const product = new Product(req.body);
    await product.save();

    res.json({
      code: 200,
      message: "Tạo sản phẩm thành công!",
      product: product
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!"
    })
  }
}

// [PATCH] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);
    
    await Product.updateOne({
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

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;

    let find = {
      deleted: false,
      _id: id
    };

    const product = await Product.findOne(find);

    res.json({
      code: 200,
      products: product
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!"
    })
  }
}