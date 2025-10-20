import { useDispatch, useSelector } from "react-redux";
import { amIFollowing } from "../features/user/userSlice";
import { Button } from "./Button";
import { followUser, unfollowUser } from "../features/user/userThunks";
import { toast } from "react-toastify";

const FollowButton = ({ user }) => {
  const { currentUser } = useSelector((state) => state.user.user);

  const isFollowing = useSelector((state) => amIFollowing(state, user));
  const toggleFollowLoading = useSelector(
    (state) => state.user.loading.toggleFollow
  );

  const dispatch = useDispatch();

  const handleFollow = async () => {
    try {
      if (isFollowing) await dispatch(unfollowUser(user)).unwrap();
      else await dispatch(followUser(user)).unwrap();
    } catch (error) {
      console.error(error);
      toast.error("Failed to folow user");
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
      isDisabled={toggleFollowLoading}
    >
      {toggleFollowLoading ? (
        <span className="flex items-center">
          <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Wait...
        </span>
      ) : isFollowing ? (
        "Following"
      ) : (
        "Follow"
      )}
    </Button>
  );
};

export default FollowButton;
