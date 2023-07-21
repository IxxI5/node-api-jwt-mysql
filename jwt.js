/* library to create and verify jwt web tokens */
const { sign, verify, decode } = require("jsonwebtoken");

/* creates a jwt token based on username and id */
const createTokens = (user) => {
  const accessToken = sign(
    { username: user.username, id: user.id },
    "KKKmyJwtsecretKeykkk" // enter the secret key here or better place it in an external .env file
  );

  return accessToken;
};

/* validates whether the httpOnly (or other) cookie contains a valid jwt token */
const validateToken = (req, res, next) => {
  const accessToken = req.cookies["access-token"];

  if (!accessToken)
    return res.status(400).json({ error: "User not Authenticated!" });

  try {
    const validToken = verify(accessToken, "KKKmyJwtsecretKeykkk"); // enter the secret key here or better place it in an external .env file
    if (validToken) {
      req.authenticated = true;
      return next();
    }
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

/* decodes the jwt token and returns the entire decoded object */
const decodeToken = (req) => {
  const token = req.cookies["access-token"]; // httpOnly JWT token
  const user = decode(token);

  return user;
};

module.exports = { createTokens, validateToken, decodeToken };
