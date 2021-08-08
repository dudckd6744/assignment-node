const { User }  = require('../models');
const jwt = require('../config/jwt');

module.exports.parsing = async (req, res, next) => {
    let token = req.headers["authorization"];
    if (!token) return next();
    try {
        const decoded = await jwt.verify(token);
        if (!decoded) return res.status(401).end();
        const user = await User.findOne({
            where:{email:decoded.email}
        });
        if (!user) return res.status(401).end();
        req.user = user;
        return next();
    }
    catch(err) { 
        return res.json({statusCode:"401",message:"권한이 없습니다."});
    } 
}