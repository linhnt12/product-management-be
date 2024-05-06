module.exports.create = (req, res, next) => {
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

module.exports.edit = (req, res, next) => {
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
  
  next();
}