const jwt = require('jsonwebtoken');


const authmiddleware = (req,res,next)=>{
    try {
        const token = req.header('Authorization')?.split(" ")[1];

        if(!token){
            return res.status(401).json({message: 'No token, authorization denied'});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({message:" Invalid or Expired token" });
    }
}

module.exports = authmiddleware;