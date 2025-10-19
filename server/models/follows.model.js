import mongoose from "mongoose";
import { User } from "./user.model.js";

const followsSchema = new mongoose.Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // User A follows...
  following: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // User B
  mutualFollowing: {
    type: Boolean,
    default: false,
  }, // If User B also follows A
});

followsSchema.index({ follower: 1, following: 1 }, { unique: true });

// // Updating the mutual following if exists after a follow
// followsSchema.post("save", async function (doc, next) {
//   try {
//     await incrementFollowCounts(doc.follower, doc.following);

//     if (doc.mutualFollowing === true) return next();

//     const reverseFollow = await Follows.findOne({
//       following: doc.follower,
//       follower: doc.following,
//     });

//     if (reverseFollow) {
//       const updates = [];

//       if (!doc.mutualFollowing) {
//         doc.mutualFollowing = true;
//         updates.push(doc.save());
//       }

//       if (!reverseFollow.mutualFollowing) {
//         reverseFollow.mutualFollowing = true;
//         updates.push(reverseFollow.save());
//       }

//       await Promise.all(updates);
//     }

//     next();
//   } catch (error) {
//     console.error("Error updating mutualFollowing on save.", error?.message);
//     next(error);
//   }
// });

// Updating the mutual following if exists after a unfollow
// followsSchema.post("findOneAndDelete", async function (doc, next) {
//   try {
//     await decrementFollowCounts(doc.follower, doc.following);

//     if (doc.mutualFollowing === false) return next();

//     const reverseFollow = await Follows.findOne({
//       follower: doc.following,
//       following: doc.follower,
//     });

//     if (reverseFollow && reverseFollow.mutualFollowing) {
//       reverseFollow.mutualFollowing = false;
//       await reverseFollow.save();
//     }

//     next();
//   } catch (error) {
//     console.error("Error updating mutualFollowing on delete.", error?.message);
//     next(error);
//   }
// });

followsSchema.statics.getFollowers = async function (userId) {
  try {
    const docs = await Follows.find({ following: userId })
      .select("follower")
      .populate("follower", "_id username displayName profilePicture");

    return docs.map((doc) => doc.follower);
  } catch (error) {
    throw Error("Failure to retrieve followers:", error?.message);
  }
};

followsSchema.statics.getFollowing = async function (userId) {
  try {
    const docs = await Follows.find({ follower: userId })
      .select("following")
      .populate("following", "_id username displayName profilePicture");

    return docs.map((doc) => doc.following);
  } catch (error) {
    throw Error("Failure to retrieve following", error?.message);
  }
};

followsSchema.statics.follow = async function (follower, following) {
  if (follower.toString() === following.toString()) {
    throw new Error("You can't follow yourself");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await this.create([{ follower, following }], { session });

    await User.findByIdAndUpdate(
      follower,
      { $inc: { followingCount: 1 } },
      { session }
    );

    await User.findByIdAndUpdate(
      following,
      { $inc: { followersCount: 1 } },
      { session }
    );

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();

    if (err && err.code === 11000) {
      throw new Error("Already following");
    }

    throw err;
  } finally {
    session.endSession();
  }
};

followsSchema.statics.unfollow = async function (follower, following) {
  if (follower.toString() === following.toString()) {
    throw new Error("You can't unfollow yourself");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const doc = await this.findOneAndDelete(
      { follower, following },
      {
        session,
      }
    );

    if (!doc) {
      await session.abortTransaction();

      throw new Error("Follow and Following relationship not found");
    }

    await User.updateOne(
      { _id: follower },
      [
        {
          $set: {
            followingCount: {
              $max: [{ $subtract: ["$followingCount", 1] }, 0],
            },
          },
        },
      ],
      { session }
    );

    await User.updateOne(
      { _id: following },
      [
        {
          $set: {
            followersCount: {
              $max: [{ $subtract: ["$followersCount", 1] }, 0],
            },
          },
        },
      ],
      { session }
    );

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();

    throw err;
  } finally {
    session.endSession();
  }
};

export const Follows = mongoose.model("Follows", followsSchema);
