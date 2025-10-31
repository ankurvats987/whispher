import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FollowButton from "./FollowButton";
import { setSelectedUser } from "../features/user/userSlice";

const UserSearchCard = ({ user, tag = false }) => {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.user);
  const isCurrentUser = user._id === currentUser.id;

  const dispatch = useDispatch();

  const handleProfileClick = () => {
    navigate(`/profile/${user.username}`, {
      state: { userId: user._id },
    });
  };

  const selectUser = () => {
    dispatch(setSelectedUser(user.username));
  };

  return (
    <div
      className={`flex items-center justify-between hover:bg-gray-50 transition-colors p-4 ${
        !tag && "bg-white rounded-lg  border border-gray-200"
      }`}
    >
      {/* Left: Avatar + Info */}
      <div
        className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
        onClick={tag ? selectUser : handleProfileClick}
      >
        <img
          src={user.profilePicture || "/default-avatar.png"}
          alt={user.displayName}
          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">
            {user.displayName}
          </h3>
          <p className="text-sm text-gray-500 truncate">@{user.username}</p>
          {user.description && (
            <p className="text-sm text-gray-600 truncate mt-1">
              {user.description}
            </p>
          )}
        </div>
      </div>

      {/* Right: Follow Button or Badge */}
      <div className="ml-4 flex-shrink-0">
        {isCurrentUser ? (
          <span className="px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 rounded-lg">
            You
          </span>
        ) : (
          !tag && <FollowButton user={user} />
        )}
      </div>
    </div>
  );
};

export default UserSearchCard;
