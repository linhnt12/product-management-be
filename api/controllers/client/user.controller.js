const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const Cart = require("../../models/cart.model");

const md5 = require("md5");

const generateHelper = require("../../../helpers/generate");
const sendMailHelper = require("../../../helpers/send-mail");

// [POST] /user/register
module.exports.register = async (req, res) => {
  try {
    const existEmail = await User.findOne({
      email: req.body.email,
      deleted: false
    });

    if (existEmail) {
      res.json({
        code: 400,
        message: "Email đã tồn tại!"
      });

      return;
    }

    req.body.password = md5(req.body.password);
    req.body.tokenUser = generateHelper.generateRandomString(20);

    const user = new User(req.body);
    await user.save();

    res.json({
      code: 200,
      message: "Đăng ký thành công!"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!"
    })
  }
}

// [POST] /user/login
module.exports.login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
      email: email,
      deleted: false
    });

    if (!user) {
      res.json({
        code: 400,
        message: "Tài khoản không tồn tại!"
      });

      return;
    }

    if (md5(password) != user.password) {
      res.json({
        code: 400,
        message: "Sai mật khẩu!"
      });

      return;
    }

    if (user.status == "inactive") {
      res.json({
        code: 400,
        message: "Tài khoản đang bị khoá!"
      });

      return;
    }

    res.cookie("tokenUser", user.tokenUser);

    await Cart.updateOne({
      _id: req.cookies.cartId
    }, {
      user_id: user.id
    })

    res.json({
      code: 200,
      message: "Đăng nhập thành công!",
      tokenUser: user.tokenUser
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!"
    })
  }
}

// [POST] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
  try {
    const email = req.body.email;

    const user = await User.findOne({
      email: email,
      deleted: false
    });

    if (!user) {
      res.json({
        code: 400,
        message: "Tài khoản không tồn tại!"
      });

      return;
    }

    const otp = generateHelper.generateRandomNumber(6);

    const objectForgotPassword = {
      email: email,
      otp: otp,
      expireAt: Date.now()
    }

    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();

    // Gửi OTP qua email
    const subject = `Mã OTP xác minh lấy lại mật khẩu`;
    const html = `
    Mã OTP xác minh lấy lại mật khẩu là <b>${otp}</b>. Thời hạn sử dụng là 3 phút. Lưu ý không được để lộ mã OTP.
  `;

    sendMailHelper.sendMail(email, subject, html);

    res.json({
      code: 200
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!"
    })
  }
}

// [POST] /user/password/otp
module.exports.otpPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const otp = req.body.otp;

    const result = await ForgotPassword.findOne({
      email: email,
      otp: otp
    })

    if (!result) {
      res.json({
        code: 400,
        message: "OTP không hợp lệ!"
      });

      return;
    }

    const user = await User.findOne({
      email: email
    });

    res.cookie("tokenUser", user.tokenUser);

    res.json({
      code: 200,
      tokenUser: user.tokenUser
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!"
    })
  }
}

// [POST] /user/password/reset
module.exports.resetPassword = async (req, res) => {
  try {
    const password = req.body.password;
    const tokenUser = req.cookies.tokenUser;

    await User.updateOne({
      tokenUser: tokenUser
    }, {
      password: md5(password)
    })

    res.json({
      code: 200,
      message: "Đổi mật khẩu thành công!"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!"
    })
  }
}


// [GET] /user/info
module.exports.info = async (req, res) => {
  try {
    res.json({
      code: 200,
      user: req.user
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!"
    })
  }
}