import { APIResponse } from "../utils/res_handler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import ms from "ms";
import { Follows } from "../models/follows.model.js";
import { Post } from "../models/post.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary_uploader.js";
import nodemailer from "nodemailer";

const setAuthTokens = async (userId, username, res) => {
  // Prepare the payload for access token
  const accessTokenPayload = {
    userId,
    username,
  };

  // Generate an access JWT
  const accessToken = jwt.sign(
    accessTokenPayload,
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );

  // Generate a refresh JWT
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });

  // Update the user's field with the generated refresh token
  await User.findByIdAndUpdate(userId, { refreshToken });

  // Send the refresh token using secure cookies to the frontend
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: ms(process.env.REFRESH_TOKEN_EXPIRY),
  });

  // Get the final created user data excluding sensitive information to send through response
  const userToSend = await User.findById(userId)
    .select("-password -refreshToken")
    .lean();

  const [followers, following] = await Promise.all([
    Follows.getFollowers(userId),
    Follows.getFollowing(userId),
  ]);

  userToSend.followers = followers;
  userToSend.following = following;

  const userPosts = await Post.getUserPosts(userId);
  userToSend.posts = userPosts;

  const responsePayload = { user: userToSend, accessToken };

  return { responsePayload };
};

const createUser = async (req, res) => {
  try {
    const { email, displayName, username, password } = req.body;

    // Check if the fields are empty
    const isEmpty = [email, displayName, username, password].some(
      (field) => field?.trim() === ""
    );

    if (isEmpty) {
      return APIResponse.error(
        "The fields should not be empty!",
        null,
        404
      ).send(res);
    }

    // Check if username already exists

    if (await User.exists({ username })) {
      return APIResponse.error(
        "This username is already taken!",
        null,
        400
      ).send(res);
    }

    if (await User.exists({ email })) {
      return APIResponse.error("This email is already taken!", null, 400).send(
        res
      );
    }

    const filePath = req.file?.path;
    let pfpURL = null;

    if (filePath) {
      const avatar = await uploadOnCloudinary(filePath);

      if (avatar) pfpURL = avatar.url;
    }

    // Create the new user
    const createdUser = await User.create({
      email: email.trim(),
      displayName: displayName.trim(),
      username: username.trim(),
      password: password.trim(),
      refreshToken: null,
      ...(pfpURL && { profilePicture: pfpURL }),
    });

    // Issue auth tokens and set them approproiately
    const { responsePayload } = await setAuthTokens(
      createdUser._id,
      createdUser.username,
      res
    );

    return APIResponse.success(
      "User successfully registered!",
      responsePayload,
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error(
      `Something went wrong while creating the user. ${error?.message}`
    ).send(res);
  }
};

const loginUser = async (req, res) => {
  try {
    // If already authenticated, return early
    if (req.user) {
      return APIResponse.success("Already authenticated", null, 200).send(res);
    }

    const { username, password } = req.body;

    // Check if the fields are empty
    const isEmpty = [username, password].some((field) => field?.trim() === "");

    if (isEmpty) {
      return APIResponse.error(
        "The fields should not be empty!",
        null,
        404
      ).send(res);
    }

    // Check if the user exists in the database
    const user = await User.findOne({
      username: username.trim(),
    });

    if (!user) {
      return APIResponse.error(
        "Incorrect username or password",
        null,
        404
      ).send(res);
    }

    const passwordMatch = await user.isPasswordCorrect(password.trim());

    if (!passwordMatch) {
      return APIResponse.error(
        "Incorrect username or password",
        null,
        404
      ).send(res);
    }

    // Issue auth tokens and set them approproiately
    const { responsePayload } = await setAuthTokens(
      user._id,
      user.username,
      res
    );

    return APIResponse.success(
      "User authenticated successfully!",
      responsePayload,
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error(
      `Something went wrong while logging in the user. ${error?.message}`
    ).send(res);
  }
};

const logoutUser = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return APIResponse.success(
        "No refresh token found. User must be already logged out",
        null,
        201
      ).send(res);
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
      return APIResponse.success(
        "Token already expired. User already logged out.",
        null,
        201
      ).send(res);
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return APIResponse.success("User does not exist", null, 201).send(res);
    }

    user.refreshToken = null;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: ms(process.env.REFRESH_TOKEN_EXPIRY),
    });

    return APIResponse.success("User logged out successfully!", null, 201).send(
      res
    );
  } catch (error) {
    return APIResponse.error(
      `Something went wrong while logging out the user. ${error?.message}`
    ).send(res);
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return APIResponse.error("Refresh token is required", 401).send(res);
    }

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== token) {
      // User not found or refresh token mismatch
      return APIResponse.error("Invalid refresh token", 403).send(res);
    }

    const { responsePayload } = await setAuthTokens(
      user._id,
      user.username,
      res
    );

    return APIResponse.success("Token refreshed", responsePayload, 200).send(
      res
    );
  } catch (error) {
    console.error("Refresh token error:", error);
    return APIResponse.error(
      `Something went wrong while refreshing the token. ${error?.message}`
    ).send(res);
  }
};

const getUserData = async (req, res) => {
  try {
    const username = req.params.username;

    if (!username) {
      return APIResponse.error("Username is required", null, 404).send(res);
    }

    const user = await User.findOne({ username }).select(
      "-password -refreshToken"
    );

    if (!user) {
      return APIResponse.error("User does not exist", null, 404).send(res);
    }

    const userPosts = await Post.getUserPosts(user._id);

    const userObj = user.toObject();
    userObj.posts = userPosts;

    return APIResponse.success(
      "Successfully fetched user details.",
      { user: userObj },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error(
      `Something went wrong while fetching user data. ${error?.message}`
    ).send(res);
  }
};

const getFollowers = async (req, res) => {
  try {
    const username = req.params.username;

    if (!username) {
      return APIResponse.error("Username is required!", null, 404).send(res);
    }

    const user = await User.findOne({ username });

    if (!user) {
      return APIResponse.error("User does not exist!", null, 404).send(res);
    }

    const followArr = await Follows.getFollowers(user._id);

    return APIResponse.success(
      "Followers retrieved successfully!",
      { followers: followArr, targetUser: user._id },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error(
      `Something went wrong while retrieving the followers. ${error?.message}`
    ).send(res);
  }
};

const getFollowing = async (req, res) => {
  try {
    const username = req.params.username;

    if (!username) {
      return APIResponse.error("Username is required!", null, 404).send(res);
    }

    const user = await User.findOne({ username });

    if (!user) {
      return APIResponse.error("User does not exist!", null, 404).send(res);
    }

    const followingArr = await Follows.getFollowing(user._id);

    return APIResponse.success(
      "Following retrieved successfully!",
      { following: followingArr, targetUser: user._id },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error(
      `Something went wrong while retrieving the following. ${error?.message}`
    ).send(res);
  }
};

const follow = async (req, res) => {
  try {
    const username = req.params.username?.trim();
    const followedBy = req.body.followedBy?.trim();

    if (!username || !followedBy) {
      return APIResponse.error("User(s) data is required!", null, 400).send(
        res
      );
    }

    const userA = await User.findOne({ username: followedBy });
    const userB = await User.findOne({ username });

    if (!userA || !userB) {
      return APIResponse.error("User(s) do not not exist!", null, 404).send(
        res
      );
    }

    await Follows.follow(userA, userB);

    return APIResponse.success("Followed successfully", null, 200).send(res);
  } catch (error) {
    return APIResponse.error(
      `Something went wrong while following the user. ${error?.message}`
    ).send(res);
  }
};

const unfollow = async (req, res) => {
  try {
    const username = req.params.username?.trim();
    const followedBy = req.body.followedBy?.trim();

    if (!username || !followedBy) {
      return APIResponse.error("User(s) data is required!", null, 400).send(
        res
      );
    }

    const userA = await User.findOne({ username: followedBy });
    const userB = await User.findOne({ username });

    if (!userA || !userB) {
      return APIResponse.error("User(s) do not exist!", null, 404).send(res);
    }

    await Follows.unfollow(userA, userB);

    return APIResponse.success("Unfollowed successfully", null, 200).send(res);
  } catch (error) {
    return APIResponse.error(
      `Something went wrong while unfollowing the user. ${error?.message}`
    ).send(res);
  }
};

const updateProfile = async (req, res) => {
  console.log(req.body);

  try {
    const username = req.params.username;
    if (!username || !username.trim()) {
      return APIResponse.error("Username is required", null, 400).send(res);
    }

    const user = await User.findOne({ username: username.trim() });
    if (!user) {
      return APIResponse.error("User does not exist", null, 404).send(res);
    }

    let hasUpdates = false;

    // Update displayName
    if (req.body.displayName) {
      const displayName = req.body.displayName.trim();
      if (!displayName) {
        return APIResponse.error(
          "Display name cannot be empty",
          null,
          400
        ).send(res);
      }
      user.displayName = displayName;
      hasUpdates = true;
    }

    // Update username
    if (req.body.username) {
      const newUsername = req.body.username.trim();
      if (!newUsername) {
        return APIResponse.error("Username cannot be empty", null, 400).send(
          res
        );
      }

      if (newUsername !== user.username) {
        const existingUser = await User.exists({ username: newUsername });
        if (existingUser) {
          return APIResponse.error(
            "Username is already taken!",
            null,
            400
          ).send(res);
        }
        user.username = newUsername;
        hasUpdates = true;
      }
    }

    // Update description (can be empty)
    if (req.body.description !== undefined) {
      user.description = req.body.description.trim();
      hasUpdates = true;
    }

    // Update profile picture if file is uploaded
    if (req.file?.path) {
      const avatar = await uploadOnCloudinary(req.file.path);
      if (avatar?.url) {
        user.profilePicture = avatar.url;
        hasUpdates = true;
      }
    }

    if (!hasUpdates) {
      return APIResponse.success("No updates to apply", null, 200).send(res);
    }

    await user.save();

    const updatedUser = await User.findById(user._id)
      .select("-password -refreshToken")
      .lean();

    return APIResponse.success(
      "Profile updated successfully",
      { user: updatedUser },
      200
    ).send(res);
  } catch (error) {
    console.error("Update profile error:", error?.message);
    return APIResponse.error(
      `Something went wrong while updating the profile. ${error?.message}`,
      null,
      500
    ).send(res);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return APIResponse.error("Email is required", null, 404).send(res);
    }

    const user = await User.exists({ email });
    if (!user) {
      return APIResponse.error("User does not exist", null, 400).send(res);
    }

    const token = jwt.sign({ email }, process.env.RESET_PASS_TOKEN_SECRET, {
      expiresIn: process.env.RESET_PASS_TOKEN_EXPIRY,
    });

    await sendMail(token, email);

    return APIResponse.success("Email verified successfully", null, 200).send(
      res
    );
  } catch (error) {
    console.error("Reset password error:", error?.message);
    return APIResponse.error(
      `Something went wrong while resetting the password. ${error?.message}`,
      null,
      500
    ).send(res);
  }
};

const sendMail = async (token, email) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    console.log("Sending email to:", email);
    console.log("From:", process.env.EMAIL_USER);
    console.log("Frontend URL:", process.env.FRONTEND_URL);
    console.log("Reset link:", resetLink);

    const mailOptions = {
      from: `"Microblogging App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your Password",
      html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              background: linear-gradient(135deg, #fce7f3 0%, #f3e8ff 50%, #e0f2fe 100%);
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background: white;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #fb7185 0%, #a855f7 100%);
              padding: 40px 30px;
              text-align: center;
            }
            .logo {
              font-size: 32px;
              font-weight: bold;
              color: white;
              margin: 0;
              text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            .content {
              padding: 40px 30px;
            }
            .title {
              font-size: 24px;
              font-weight: bold;
              color: #1f2937;
              margin: 0 0 16px 0;
            }
            .text {
              color: #6b7280;
              line-height: 1.6;
              margin: 0 0 24px 0;
              font-size: 16px;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #fb7185 0%, #a855f7 100%);
              color: white;
              text-decoration: none;
              padding: 14px 32px;
              border-radius: 12px;
              font-weight: 600;
              font-size: 16px;
              box-shadow: 0 4px 12px rgba(251, 113, 133, 0.3);
              transition: transform 0.2s;
            }
            .button:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 16px rgba(251, 113, 133, 0.4);
            }
            .button-container {
              text-align: center;
              margin: 32px 0;
            }
            .divider {
              border: none;
              border-top: 1px solid #e5e7eb;
              margin: 32px 0;
            }
            .small-text {
              color: #9ca3af;
              font-size: 14px;
              line-height: 1.5;
            }
            .footer {
              background: #f9fafb;
              padding: 24px 30px;
              text-align: center;
              border-top: 1px solid #e5e7eb;
            }
            .footer-text {
              color: #6b7280;
              font-size: 14px;
              margin: 0;
            }
            .highlight {
              background: linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%);
              padding: 16px;
              border-radius: 8px;
              border-left: 4px solid #a855f7;
              margin: 24px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- Header -->
            <div class="header">
              <h1 class="logo">✨ Whisper</h1>
            </div>
            
            <!-- Content -->
            <div class="content">
              <h2 class="title">Reset Your Password</h2>
              <p class="text">
                Hi there!
              </p>
              <p class="text">
                We received a request to reset your password. Click the button below to create a new password:
              </p>
              
              <div class="button-container">
                <a href="${resetLink}" class="button">Reset Password</a>
              </div>
              
              <div class="highlight">
                <p class="small-text" style="margin: 0; color: #6b7280;">
                  ⏰ <strong>This link expires in 15 minutes</strong> for your security.
                </p>
              </div>
              
              <hr class="divider">
              
              <p class="small-text">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p class="small-text" style="word-break: break-all; color: #a855f7;">
                ${resetLink}
              </p>
              
              <hr class="divider">
              
              <p class="small-text">
                <strong>Didn't request this?</strong> You can safely ignore this email. Your password will remain unchanged.
              </p>
            </div>
            
            <!-- Footer -->
            <div class="footer">
              <p class="footer-text">
                © ${new Date().getFullYear()} Microblog. All rights reserved.
              </p>
              <p class="footer-text" style="margin-top: 8px;">
                Made with 💜 for our community
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
      text: `
Reset Your Password

Hi there!

We received a request to reset your password. Click the link below to create a new password:

${resetLink}

This link expires in 15 minutes for your security.

Didn't request this? You can safely ignore this email. Your password will remain unchanged.

© ${new Date().getFullYear()} Whisper. All rights reserved.
    `,
    };

    const info = await transporter.sendMail(
      mailOptions,
      function (error, info) {
        if (error) {
          console.log("Error:", error);
        } else {
          console.log("Email sent successfully!");
          console.log("Message ID:", info.messageId);
        }
      }
    );
    console.log("Email sent successfully!");
    console.log("Message ID:", info?.messageId || "No message ID");
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.body;

    const paylod = jwt.verify(token, process.env.RESET_PASS_TOKEN_SECRET);

    return APIResponse.success("Token validated", paylod, 200).send(res);
  } catch (error) {
    console.error(error?.message);
    return APIResponse.error("Invalid or expired token", null, 403).send(res);
  }
};

const updatePassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !token.trim() || !password || !password.trim()) {
      return APIResponse.error(
        "Token and password are required.",
        null,
        400
      ).send(res);
    }

    const decoded = jwt.verify(token, process.env.RESET_PASS_TOKEN_SECRET);
    const email = decoded.email;

    const user = await User.findOne({ email });
    if (!user) {
      return APIResponse.error("This user does not exist", null, 400).send(res);
    }

    user.password = password;
    await user.save();

    const { responsePayload } = await setAuthTokens(
      user._id,
      user.username,
      res
    );

    return APIResponse.success(
      "Password updated successfully",
      responsePayload,
      200
    ).send(res);
  } catch (error) {
    console.error("Updating new password error:", error?.message);

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return APIResponse.error("Invalid or expired token", null, 403).send(res);
    }

    return APIResponse.error("Password can't be updated", null, 500).send(res);
  }
};

export {
  createUser,
  loginUser,
  logoutUser,
  refreshToken,
  getUserData,
  getFollowers,
  getFollowing,
  follow,
  unfollow,
  updateProfile,
  resetPassword,
  verifyResetToken,
  updatePassword,
};
