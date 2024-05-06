module.exports.register = (req, res, next) => {
  if (!req.body.fullName) {
    res.json({
      code: 400,
      message: "Thiếu họ tên!"
    });
    return;
  }

  if (!req.body.email) {
    res.json({
      code: 400,
      message: "Thiếu email!"
    });
    return;
  }

  if (!req.body.password) {
    res.json({
      code: 400,
      message: "Thiếu mật khẩu!"
    });
    return;
  }

  next();
}

module.exports.login = (req, res, next) => {
  if (!req.body.email) {
    res.json({
      code: 400,
      message: "Thiếu email!"
    });
    return;
  }

  if (!req.body.password) {
    res.json({
      code: 400,
      message: "Thiếu mật khẩu!"
    });
    return;
  }

  next();
}

module.exports.forgotPassword = (req, res, next) => {
  if (!req.body.email) {
    res.json({
      code: 400,
      message: "Thiếu email!"
    });
    return;
  }

  next();
}

module.exports.resetPassword = (req, res, next) => {
  if (!req.body.password) {
    res.json({
      code: 400,
      message: "Thiếu mật khẩu!"
    });
    return;
  }

  if (!req.body.confirmPassword) {
    res.json({
      code: 400,
      message: "Xác nhận mật khẩu!"
    });
    return;
  }

  if (req.body.password != req.body.confirmPassword) {
    res.json({
      code: 400,
      message: "Xác nhận mật khẩu không trùng khớp!"
    });
    return;
  }

  next();
}