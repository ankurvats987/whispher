import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import FollowButton from "./FollowButton";

const ProfileCard = ({ user, extraStyle = "" }) => {
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.user.user);

  const handleProfileClick = (e, user) => {
    e.stopPropagation();
    navigate(`/profile/${user.username}`, {
      state: { userId: user._id },
    });
  };

  return (
    <div className={`flex items-center justify-between ${extraStyle}`}>
      <div className="flex items-center space-x-4 mr-2">
        <img
          src={user.profilePicture}
          alt="Profile Picture"
          className="w-12 h-12 rounded-full object-cover hover:opacity-90 cursor-pointer"
          onClick={(e) => handleProfileClick(e, user)}
        />
        <div className="flex flex-2 flex-col justify-center">
          <span
            className="text-gray-900 font-semibold hover:underline cursor-pointer"
            onClick={(e) => handleProfileClick(e, user)}
          >
            {user.displayName}
          </span>
          <span className="text-gray-500 text-sm">{user.username}</span>
        </div>
      </div>

      {user._id !== currentUser.id && <FollowButton user={user} />}
    </div>
  );
};

export default ProfileCard;
