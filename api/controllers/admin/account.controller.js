const Account = require("../../models/account.model");
const generate = require("../../../helpers/generate");
const md5 = require("md5");

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
  try {
    const accounts = await Account.find({
      deleted: false,
      status: "active"
    }).select("-password -token");

    res.json({
      code: 200,
      accounts: accounts
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!"
    })
  }
}

// [POST] /admin/accounts/create
module.exports.create = async (req, res) => {
  try {
    const emailExist = await Account.findOne({
      email: req.body.email,
      deleted: false
    })

    if (emailExist) {
      res.json({
        code: 400,
        message: "Email đã tồn tại!"
      })
    } else {
      req.body.password = md5(req.body.password);
      req.body.token = generate.generateRandomString(20);

      const record = new Account(req.body);
      await record.save();

      const token = record.token;
      res.cookie("token", token);

      res.json({
        code: 200,
        message: "Tạo tài khoản thành công!",
        token: token
      })
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!"
    })
  }
}

// [PATCH] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const emailExist = await Account.findOne({
      _id: { $ne: req.params.id },
      email: req.body.email,
      deleted: false
    });

    if (emailExist) {
      res.json({
        code: 400,
        message: "Email đã tồn tại!"
      })
    } else {
      if (req.body.password) {
        req.body.password = md5(req.body.password);
      } else {
        delete req.body.password;
      }

      await Account.updateOne({
        _id: req.params.id
      }, req.body);

      res.json({
        code: 200,
        message: "Chỉnh sửa tài khoản thành công!"
      })
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!"
    })
  }
}

// [GET] /admin/accounts/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const account = await Account.findOne({
      _id: req.params.id,
      deleted: false
    }).select("-password -token");

    res.json({
      code: 200,
      account: account
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!"
    })
  }
}