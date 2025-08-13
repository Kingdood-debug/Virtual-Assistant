// isme token fetch krege hmm cookies se verify krne ke liye kyunki agr token id hai toh mtlb user ne sign up kra tha aur agr available hai toh mtlb user abbi bi login hai

// request server se jane se pehle middleware pe ayegi agr middleware allow krega tohn request aage jayegi vrna ni

import jwt from "jsonwebtoken";
const isAuth = async (req, res, next) => {
  try {
    // cookies me se token fetch krege
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({ message: "token not found" });
    }
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verifyToken.userId;

    // jisne token diya tha vohi generate krke diya tha(jwt ne generate krke diya tha)

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "is Auth error" });
  }
};
export default isAuth;
