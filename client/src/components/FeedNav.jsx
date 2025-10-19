import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { logoutUser } from "../features/auth/authThunks";
import { Button } from "./Button";
import { Logo } from "./Logo";

const FeedNav = () => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await dispatch(logoutUser());
  };

  const myProfile = useSelector((state) => state.user.user);

  return (
    <header className="px-6 py-4 bg-white">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex space-x-8 items-center">
          <Logo />
          <nav className="flex space-x-6 items-center">
            <NavLink
              to="/feed"
              className={({ isActive }) =>
                `inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 cursor-pointer rounded-lg h-10 px-4 py-2 hover:bg-accent ${
                  isActive
                    ? "hover:text-accent-foreground  text-purple-700 bg-gradient-to-r from-rose-100 to-purple-100"
                    : "text-gray-600 hover:text-gray-900 rounded-lg"
                } `
              }
              fdprocessedid="nscs5r"
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
                class="lucide lucide-home w-4 h-4 mr-2"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              Home
            </NavLink>
            {/* <button
              class=" cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent h-10 px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg"
              fdprocessedid="nx4dqd"
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
                class="lucide lucide-compass w-4 h-4 mr-2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
              </svg>
              Explore
            </button> */}
            <NavLink
              to={`/explore`}
              className={({ isActive }) =>
                `inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 cursor-pointer rounded-lg h-10 px-4 py-2 hover:bg-accent ${
                  isActive
                    ? "hover:text-accent-foreground  text-purple-700 bg-gradient-to-r from-rose-100 to-purple-100"
                    : "text-gray-600 hover:text-gray-900 rounded-lg"
                } `
              }
              fdprocessedid="dqgo6g"
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
                class="lucide lucide-user w-4 h-4 mr-2"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Explore
            </NavLink>
            <NavLink
              to={`/profile/${myProfile.username}`}
              className={({ isActive }) =>
                `inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 cursor-pointer rounded-lg h-10 px-4 py-2 hover:bg-accent ${
                  isActive
                    ? "hover:text-accent-foreground  text-purple-700 bg-gradient-to-r from-rose-100 to-purple-100"
                    : "text-gray-600 hover:text-gray-900 rounded-lg"
                } `
              }
              fdprocessedid="dqgo6g"
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
                class="lucide lucide-user w-4 h-4 mr-2"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Profile
            </NavLink>
          </nav>
        </div>
        <div className="flex space-x-8 items-center">
          <div className="relative cursor-text">
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
              class="lucide lucide-search absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-64 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:bg-white"
            />
          </div>
          <Button
            extraStyle={
              "hover:bg-gray-100 h-10 px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg"
            }
            onClick={handleLogout}
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
              class="lucide lucide-log-out w-4 h-4"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" x2="9" y1="12" y2="12"></line>
            </svg>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default FeedNav;
