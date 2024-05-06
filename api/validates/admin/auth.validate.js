module.exports.login = (req, res, next) => {
  if (!req.body.email) {
    res.json({
      code: 400,
      message: "Nhập email!"
    }); 
    return;
  }

  if (!req.body.password) {
    res.json({
      code: 400,
      message: "Nhập mật khẩu!"
    }); 
    return;
  }
  
  next();
}