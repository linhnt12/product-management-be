const Account = require("../../models/account.model");
const md5 = require("md5");

// [POST] /admin/auth/login
module.exports.login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const account = await Account.findOne({
      email: email,
      deleted: false
    })

    if (!account) {
      res.json({
        code: 400,
        message: "Email không tồn tại!"
      });
      return;
    }

    if (md5(password) != account.password) {
      res.json({
        code: 400,
        message: "Sai mật khẩu!"
      });
      return;
    }

    if (account.status == "inactive") {
      res.json({
        code: 400,
        message: "Tài khoản bị khoá!"
      });
      return;
    }

    const token = account.token;
    res.cookie("token", token);

    res.json({
      code: 200,
      message: "Đăng nhập thành công!",
      token: token
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!"
    })
  }
}
