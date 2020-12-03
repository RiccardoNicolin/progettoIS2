const jwt = require("jsonwebtoken");
//middleware for jwt authentication
module.exports = (req, res, next ) => {
    const token = req.headers.authorization.split(" ")[1];
    if (token != "000"){
        try {
            //checking if the token is valid            
                const verifydec = jwt.verify(token, process.env.JWT_KEY);
                req.verifydec = verifydec;
                next();
            
            
        } catch (error) {
            //returning error and preventing access to page if its not
            return res.status(401).json({
                message: "Authentication Failed"
            });
        }
    }
    else{
        res.status(401).json({
            message: "Missing token"
        })
    }
};