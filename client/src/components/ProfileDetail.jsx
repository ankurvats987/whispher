import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import {
  getUserFollowers,
  getUserFollowing,
} from "../features/user/userThunks";
import { getMonthAndYear } from "../helper/accurate_timestamp";
import ContentCard from "./ContentCard";
import FollowButton from "./FollowButton";
import ProfileCard from "./ProfileCard";

const ProfileDetail = ({ myProfile = false }) => {
  const [currentActive, setCurrentActive] = useState("Posts");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.user.user);

  const user = useSelector((state) => state.user.currentUserData);

  const followersLoading = useSelector((state) => state.user.loading.followers);
  const followersError = useSelector((state) => state.user.error.followers);

  const followingLoading = useSelector((state) => state.user.loading.following);
  const followingError = useSelector((state) => state.user.error.following);

  const loadFollowers = async () => {
    try {
      await dispatch(getUserFollowers(user.username)).unwrap();
    } catch (error) {
      toast.error("Something went wrong while fetching the followers");
    }
  };

  const loadFollowing = async () => {
    try {
      await dispatch(getUserFollowing(user.username)).unwrap();
    } catch (error) {
      toast.error("Something went wrong while fetching the following");
    }
  };

  const renderUserList = () => {
    if (currentActive === "Followers") {
      if (followersLoading)
        return <div className="text-center text-gray-500">Loading...</div>;
      if (followersError)
        return (
          <div className="text-center text-red-500">
            {followersError || "Something went wrong"}
          </div>
        );
      if (user.followers?.length === 0)
        return <div className="text-center text-gray-400">No Followers</div>;

      return user.followers.map((f) => (
        <ProfileCard key={f._id} user={f} extraStyle="px-3 py-2" />
      ));
    }

    if (currentActive === "Following") {
      if (followingLoading)
        return <div className="text-center text-gray-500">Loading...</div>;
      if (followingError)
        return (
          <div className="text-center text-red-500">
            {followingError || "Something went wrong"}
          </div>
        );
      if (user.following?.length === 0)
        return <div className="text-center text-gray-400">No Following</div>;

      return user.following.map((f) => (
        <ProfileCard key={f._id} user={f} extraStyle="px-3 py-2" />
      ));
    }

    return null;
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-4 space-y-6">
      <div className="text-accent-foreground bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-8">
          <div className="flex space-x-12">
            <div className="flex flex-col space-y-4 items-center">
              <img
                src={user.profilePicture}
                alt="Profile Picture"
                className="h-32 w-32 rounded-full object-cover"
              />

              {user._id === currentUser.id ? (
                <button
                  onClick={() => navigate("/profile/edit", { replace: true })}
                  className="flex items-center justify-center gap-2 h-10 px-6 py-2 rounded-lg text-sm font-medium bg-white border-2 border-gray-200 text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path>
                    <path d="m15 5 4 4"></path>
                  </svg>
                  Edit Profile
                </button>
              ) : (
                <FollowButton user={user} />
              )}
            </div>

            <div className="flex flex-1 flex-col space-y-6">
              <div className="flex flex-col">
                <span className="text-2xl leading-tight font-bold">
                  {user.displayName}
                </span>
                <span className="text-gray-600">@{user.username}</span>
              </div>

              <p className="leading-relaxed text-gray-700">
                {user.description || (
                  <span className="text-gray-400 text-sm">No bio added</span>
                )}
              </p>

              <div className="flex space-x-1 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4B5563"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-calendar w-4 h-4"
                >
                  <path d="M8 2v4"></path>
                  <path d="M16 2v4"></path>
                  <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                  <path d="M3 10h18"></path>
                </svg>

                <span className="text-gray-500 text-sm">{`Joined ${getMonthAndYear(
                  user.createdAt
                )}`}</span>
              </div>

              <div className="flex space-x-8">
                <div className="flex flex-col items-center">
                  <span className="font-bold text-2xl">
                    {user.followingCount || 0}
                  </span>
                  <span className="text-gray-600">Following</span>
                </div>

                <div className="flex flex-col items-center">
                  <span className="font-bold text-2xl">
                    {user.followersCount || 0}
                  </span>
                  <span className="text-gray-600">Followers</span>
                </div>

                <div className="flex flex-col items-center">
                  <span className="font-bold text-2xl">
                    {user.posts.length}
                  </span>
                  <span className="text-gray-600">Posts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs (Posts, Followers, Following) */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-lg">
        <div className="p-1">
          <div className="flex space-x-2">
            <div
              className={`bg-white flex-1  py-2 text-center rounded-lg text-sm cursor-pointer font-medium  ${
                currentActive === "Posts"
                  ? "text-gray-900 shadow-xs hover:shadow-sm transition-shadow "
                  : "text-gray-500"
              } `}
              onClick={() => setCurrentActive("Posts")}
            >
              Posts
            </div>
            <div
              className={`bg-white flex-1  py-2 text-center rounded-lg text-sm cursor-pointer font-medium  ${
                currentActive === "Followers"
                  ? "text-gray-900 shadow-xs hover:shadow-sm transition-shadow "
                  : "text-gray-500"
              } `}
              onClick={() => {
                setCurrentActive("Followers");
                loadFollowers();
              }}
            >
              Followers
            </div>
            <div
              className={`bg-white flex-1  py-2 text-center rounded-lg text-sm cursor-pointer font-medium  ${
                currentActive === "Following"
                  ? "text-gray-900 shadow-xs hover:shadow-sm transition-shadow "
                  : "text-gray-500"
              } `}
              onClick={() => {
                setCurrentActive("Following");
                loadFollowing();
              }}
            >
              Following
            </div>
          </div>
        </div>
      </div>

      {currentActive === "Posts" ? (
        user.posts.map((post) => (
          <ContentCard
            content={post}
            key={post._id}
            cardClickHandler={() =>
              navigate(`/post/${post._id}`, {
                state: { postId: post._id },
              })
            }
            profileClickHandler={(e) => {
              e.stopPropagation();
            }}
          />
        ))
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6 flex flex-col space-y-2">{renderUserList()}</div>
        </div>
      )}
    </div>
  );
};

export default ProfileDetail;
