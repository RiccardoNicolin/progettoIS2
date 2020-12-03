const jwt = require("jsonwebtoken");
//middleware for jwt authentication
module.exports = (req, res, next ) => {
    try {
        //checking if the token is valid
        const token = req.headers.authorization.split(" ")[1];
        if (token != "000"){
            const verifydec = jwt.verify(token, process.env.JWT_KEY);
            req.verifydec = verifydec;
            next();
        }
        else{
            throw "Missing Token";
        }
    } catch (error) {
        //returning error and preventing access to page if its not
        return res.status(401).json({
            message: "Authentication Failed"
        });
    }
    
    
};