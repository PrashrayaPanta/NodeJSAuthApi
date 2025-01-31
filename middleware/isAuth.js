const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
  // console.log("Hello I am under authenticated function")

  // get the token from header

  const headerObject = req.headers;

  // console.log(headerObject)

  const token = headerObject.authorization.split(" ")[1];

  // verify the token

  const verifyToken = jwt.verify(token, "anykey", (err, decoded) => {
    //if the token is temnpered
    if (err) {
      return false;
      // if token is right
    } else {
      return decoded;
    }
  });

  //save the user into req.boj

  // console.log(verifyToken);

  // const user_id = verifyToken.id;

  // console.log(user_id);

  if (verifyToken) {
    req.user = verifyToken.id;
    next();
  } else {
    const err = new Error("Token Expired plz login in");
    next(err);
  }
};

module.exports = isAuthenticated;
