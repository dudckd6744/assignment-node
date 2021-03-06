const { User }  = require('../models');
const jwt = require('../config/jwt');


module.exports = async (req, res, next) => {
    let token = req.headers["authorization"];
    if (!token) return next();
    if (token.indexOf('Bearer ') === 0) token = token.slice(7);
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

module.exports.parsing = async (req, res, next) => {
    let token = req.headers["authorization"];
    if (!token) return res.json({statusCode:"401",message:"권한이 없습니다."});
    if (token.indexOf('Bearer ') === 0) token = token.slice(7);
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
