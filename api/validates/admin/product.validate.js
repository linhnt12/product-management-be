module.exports.create = (req, res, next) => {
  if (!req.body.title) {
    res.json({
      code: 400,
      message: "Thiếu tiêu đề!"
    }); 
    return;
  }
  
  next();
}