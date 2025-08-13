import jwt from "jsonwebtoken";

const genToken = async (userId) => {
  try {
    const token = await jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "8d",
    });
    return token;
  } catch (error) {
    console.error("JWT Token generation failed:", error);
    throw error;
  }
};

export default genToken;
