// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    console.log("🔥 Incoming Auth Request:", req.method, req.url);

    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        console.log("❌ No token provided");
        return res.status(401).json({ error: 'Access Denied: No Token Provided' });
    }

    console.log("🔑 Received Token:", token);

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token Verified:", verified);
        req.user = { userId: verified.userId }; // 🛑 Don't touch this!

        console.log("🛠 Calling next() to continue to controller...");
        next(); // ✅ Ensure next() is called

    } catch (error) {
        console.log("❌ Invalid token:", error.message);
        res.status(403).json({ error: 'Invalid Token' });
    }
};

module.exports = authenticateToken;



// const authenticateToken = (req, res, next) => {
//     const token = req.header('Authorization')?.split(' ')[1];
//     if (!token) {
//         return res.status(401).json({ error: 'Access Denied: No Token Provided' });
//     }

//     try {
//         const verified = jwt.verify(token, process.env.JWT_SECRET);
//         console.log('Decoded Token:', verified); // Log the decoded token
//         req.user = { userId: verified.userId }; // Attach userId from the token to req.user
//         next();
//     } catch (error) {
//         console.error('JWT Error:', error.message); // Log JWT errors
//         res.status(403).json({ error: 'Invalid Token' });
//     }
// };

module.exports = authenticateToken;
