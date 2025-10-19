import { APIResponse } from "../utils/res_handler.js";
import jwt from "jsonwebtoken";

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return APIResponse.error("Access token is required", null, 401).send(res);
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded; // Attach user data (userId, username);
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return APIResponse.error("Access token has expired", null, 401).send(res);
    } else if (error.name === "JsonWebTokenError") {
      return APIResponse.error("Invalid access token", null, 401).send(res);
    } else if (error.name === "NotBeforeError") {
      return APIResponse.error("Access token not active yet", null, 401).send(
        res
      );
    } else {
      // For any other JWT related errors
      return APIResponse.error("Token verification failed", null, 401).send(
        res
      );
    }
  }
};

export { authenticate };
