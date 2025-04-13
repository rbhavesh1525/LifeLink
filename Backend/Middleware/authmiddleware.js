const jwt = require('jsonwebtoken');

const authmiddleware = (req,res,next)=>{
    try {
        const token = req.header('Authorization')?.split(" ")[1];

        if(!token){
            return res.status(401).json({message: 'No token, authorization denied'});
        }

        // First decode without verification to check the role
        const decodedWithoutVerify = jwt.decode(token);
        
        // Select the appropriate secret key based on role
        let secretKey;
        if (decodedWithoutVerify.role === 'hospital') {
            secretKey = process.env.HOSPITAL_SECRET_KEY;
        } else if (decodedWithoutVerify.role === 'ambulance') {
            secretKey = process.env.AMBULANCE_SECRET_KEY;
        } else {
            secretKey = process.env.JWT_SECRET_KEY;
        }

        // Verify with the correct secret key
        const decoded = jwt.verify(token, secretKey);
        console.log("Decoded JWT in middleware:", decoded);

        req.user = decoded;
        next();
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(401).json({message:" Invalid or Expired token" });
    }
}

module.exports = authmiddleware;