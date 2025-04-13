const jwt = require('jsonwebtoken');

const authmiddleware = (req,res,next)=>{
    try {
        console.log("Auth middleware called");
        console.log("Authorization header:", req.header('Authorization'));
        
        const token = req.header('Authorization')?.split(" ")[1];

        if(!token){
            console.log("No token found in request");
            return res.status(401).json({message: 'No token, authorization denied'});
        }

        console.log("Token found:", token.substring(0, 20) + "...");

        // First decode without verification to check the role
        const decodedWithoutVerify = jwt.decode(token);
        console.log("Decoded token without verification:", decodedWithoutVerify);
        
        // Select the appropriate secret key based on role
        let secretKey;
        if (decodedWithoutVerify.role === 'hospital') {
            secretKey = process.env.HOSPITAL_SECRET_KEY;
            console.log("Using HOSPITAL_SECRET_KEY");
        } else if (decodedWithoutVerify.role === 'ambulance') {
            secretKey = process.env.AMBULANCE_SECRET_KEY;
            console.log("Using AMBULANCE_SECRET_KEY");
        } else {
            secretKey = process.env.JWT_SECRET_KEY;
            console.log("Using JWT_SECRET_KEY");
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