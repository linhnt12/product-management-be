const Account = require("../../models/account.model");
const md5 = require("md5");

// [GET] /admin/my-account
module.exports.index = async (req, res) => {
  try {
    const account = await Account.findOne({
      _id: req.account.id
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

// [PATCH] /admin/my-account/edit
module.exports.edit = async (req, res) => {
  try {
    const emailExist = await Account.findOne({
      _id: { $ne: req.account.id },
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
        _id:  req.account.id
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