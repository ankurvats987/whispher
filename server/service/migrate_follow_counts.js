import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Follows } from "../models/follows.model.js";
dotenv.config({ path: "../.env" });

await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);

async function migrateCounts() {
  try {
    const users = await User.find();

    console.log(`Found ${users.length} users. Starting migration...`);

    for (const user of users) {
      const followersCount = await Follows.countDocuments({
        following: user._id,
      });

      const followingCount = await Follows.countDocuments({
        follower: user._id,
      });

      await User.updateOne(
        { _id: user._id },
        { $set: { followersCount, followingCount } }
      );

      console.log(
        `✅ Updated ${user.username}: ${followersCount} followers, ${followingCount} following`
      );
    }

    console.log("Migration completed!");

    process.exit(0);
  } catch (error) {
    console.error("Migration Failed:", error);
    process.exit(1);
  }
}

migrateCounts();
