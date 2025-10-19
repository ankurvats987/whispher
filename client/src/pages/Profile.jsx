import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import ProfileDetail from "../components/ProfileDetail";
import ProfileHeader from "../components/ProfileHeader";
import { reset } from "../features/user/userSlice";
import { getUserData } from "../features/user/userThunks";

const Profile = ({ myProfile = false }) => {
  const dispatch = useDispatch();
  const { username } = useParams();

  const userDataLoading = useSelector((state) => state.user.loading.profile);
  const errorFetching = useSelector((state) => state.user.error.profile);

  const currentUser = useSelector((state) => state.user.user);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });

    const fetchUserData = async () => {
      try {
        await dispatch(getUserData(username)).unwrap();
      } catch (error) {
        toast.error("Something went wrong while fetching the user data");
      }
    };

    fetchUserData();

    return () => dispatch(reset());
  }, [dispatch, username]);

  if (userDataLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="text-gray-500 text-lg">Loading user data...</span>
      </div>
    );
  } else if (errorFetching) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-10 text-red-400 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
          />
        </svg>
        <span className="text-red-500 text-lg font-semibold">
          Failed to load the user data
        </span>
        <span className="text-gray-500 text-sm mt-1">
          Please check your connection or try again later.
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-6">
      <ProfileHeader myProfile={myProfile} />
      <ProfileDetail myProfile={myProfile} />
    </div>
  );
};

export default Profile;
