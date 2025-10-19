import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Button } from "./Button";

const ProfileHeader = ({ myProfile = false }) => {
  const navigate = useNavigate();

  const user = useSelector((state) => {
    if (myProfile) {
      return state.user.user;
    } else {
      return state.user.currentUserData;
    }
  });

  console.log(myProfile);

  return (
    <header className="bg-white w-full border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex space-x-4 items-center">
            <Button
              extraStyle={"h-10 px-3 py-2 hover:bg-gray-200 rounded-lg "}
              onClick={() => navigate(-1)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-arrow-left w-4 h-4"
              >
                <path d="m12 19-7-7 7-7"></path>
                <path d="M19 12H5"></path>
              </svg>
            </Button>

            <div className="flex-1 flex flex-col">
              <span className="font-bold  text-xl text-gray-900">
                {user.displayName}
              </span>
              <span className="text-gray-500 text-sm">{`${user.posts.length} Posts`}</span>
            </div>
          </div>

          <Button
            extraStyle={
              "h-10 px-3 py-2 hover:bg-gray-100 text-gray-800 text-sm font-semibold hover:text-gray-900 rounded-lg"
            }
            title="Home"
            onClick={() => navigate("/feed")}
          />
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;
