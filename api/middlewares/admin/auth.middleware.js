const Account = require("../../models/account.model");

module.exports.requireAuth = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];

    const account = await Account.findOne({
      token: token, 
      deleted: false
    });

    if (!account) {
      res.json({
        code: 400,
        message: "Token không hợp lệ!"
      });
      return;
    }

    req.account = account;
    
    next();
  } else {
    res.json({
      code: 400,
      message: "Gửi kèm token!"
    })
  }
}