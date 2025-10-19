import { useDispatch, useSelector } from "react-redux";
import { amIFollowing } from "../features/user/userSlice";
import { Button } from "./Button";
import { followUser, unfollowUser } from "../features/user/userThunks";
import { toast } from "react-toastify";

const FollowButton = ({ user }) => {
  const { currentUser } = useSelector((state) => state.user.user);

  const isFollowing = useSelector((state) => amIFollowing(state, user));

  const dispatch = useDispatch();

  const handleFollow = async () => {
    try {
      if (isFollowing) await dispatch(unfollowUser(user)).unwrap();
      else await dispatch(followUser(user)).unwrap();
    } catch (error) {
      toast.error("Something went wrong while performing this action:", error);
    }
  };

  return (
    <Button
      extraStyle={`h-9 px-3 py-2 rounded-lg text-sm ${
        isFollowing
          ? "bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 hover:text-gray-900"
          : "bg-gradient-to-r from-rose-400 to-purple-400 hover:from-rose-500 hover:to-purple-500 text-white"
      }`}
      onClick={handleFollow}
    >
      {isFollowing ? "Following" : "Follow"}
    </Button>
  );
};

export default FollowButton;
