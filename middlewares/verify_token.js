const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {

    const token = req.headers.token;

    if (token) {

        try {
    
            const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

            req.user = decode;

            next();
            
        } catch (error) {

            res.status(401).json({ message: "Invalid Token" })
            
        }

    } else {

        res.status(401).json({ message: "Token Not Provided!" });

        // 401 => Unothorized

    }

}

// Verify Token and User:

function verifyTokenAndAuthorization(req, res, next) {

    verifyToken(req, res, () => {

        if (req.user.id === req.params.id || req.user.isAdmin) {

            next();
    
        } else {

            // 403 => Forbiden.
    
            return res.status(403)
            
            .json({ message: "You are not allowed, You only can update your profile!" });

        }

    });

};

// Verify Token and Admin:

function verifyTokenAndAdmin(req, res, next) {

    verifyToken(req, res, () => {

        if (req.user.isAdmin) {

            next();
    
        } else {

            // 403 => Forbiden.
    
            return res.status(403)
            
            .json({ message: "You Are Not Allowed, Admin Only Allowed!" });

        }

    });

};

module.exports = {

    verifyTokenAndAuthorization,

    verifyTokenAndAdmin

};
