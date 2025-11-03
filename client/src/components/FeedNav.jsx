import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../features/auth/authThunks";
import { Button } from "./Button";
import { Logo } from "./Logo";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import getDateStamp from "../helper/accurate_timestamp";
import { markNotificationsRead } from "../features/user/userThunks";

const FeedNav = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");

  const [showNotification, setShowNotification] = useState(false);
  const showRedCircle = useSelector((state) => state.user.showRedCircle);
  const dropdownRef = useRef(null);

  const notifications = useSelector((state) => state.user.user.notifications);

  const handleLogout = async () => {
    await dispatch(logoutUser());
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") navigate(`/search/${query}`);
  };

  const myProfile = useSelector((state) => state.user.user);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotification(false);
      }
    };

    window.addEventListener("click", handleOutsideClick);
    window.addEventListener("touchstart", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
      window.removeEventListener("touchstart", handleOutsideClick);
    };
  }, []);

  const handleNotificationClick = (e, notification) => {
    e.stopPropagation();

    if (
      notification.type === "comment" ||
      notification.type === "comment-mention" ||
      notification.type === "like-comment"
    ) {
      navigate(`/post/${notification.post}`, {
        state: {
          comment: notification.comment,
        },
      });
    } else if (notification.type === "follow") {
      navigate(`/profile/${notification.sender.username}`);
    } else {
      navigate(`/post/${notification.post}`);
    }
  };

  const handleBellClick = async (e) => {
    e.stopPropagation();
    setShowNotification((prev) => !prev);

    try {
      if (showRedCircle) {
        await dispatch(markNotificationsRead()).unwrap();
      }
    } catch (error) {}
  };

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
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-home w-4 h-4 mr-2"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              Home
            </NavLink>
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
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-user w-4 h-4 mr-2"
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
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-user w-4 h-4 mr-2"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Profile
            </NavLink>
          </nav>
        </div>
        <div className="flex space-x-8 items-center">
          <div className="relative">
            <button
              className="h-10 px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg cursor-pointer transition-transform duration-300 hover:scale-110"
              onClick={handleBellClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                stroke="currentColor"
                fill="none"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6"
              >
                <path d="M12 22a1.8 1.8 0 0 0 1.8-1.8H10.2A1.8 1.8 0 0 0 12 22zM18 16V10a6 6 0 1 0-12 0v6l-2 2h16l-2-2z" />
                {showRedCircle && (
                  <circle cx="18.5" cy="5.5" r="4" fill="#ff3b30" />
                )}
              </svg>
            </button>

            <div
              ref={dropdownRef}
              className={`flex flex-col  items-center absolute bottom-0 top-full left-4 w-[450px] h-80  bg-gray-50 rounded-lg shadow-lg border border-gray-200 z-[100] transition-all duration-200 ease-in-out ${
                showNotification
                  ? "opacity-100 translate-y-2"
                  : "opacity-0 -translate-y-2 pointer-events-none"
              } `}
            >
              <div className="inline-flex items-center gap-2  bg-gradient-to-r from-rose-400 to-purple-400 text-white font-semibold w-full px-4 py-4 ">
                Notifications
              </div>
              <div
                className={`w-full flex-1 flex items-center overflow-x-auto flex-col ${
                  (!notifications || notifications?.length === 0) &&
                  "justify-center"
                }`}
              >
                {notifications &&
                  (notifications.length > 0 ? (
                    notifications.slice(0, 15).map((notification) => {
                      return (
                        <div
                          key={notification._id}
                          className="w-full h-10 border-b border-gray-200 flex items-center gap-4 cursor-pointer hover:bg-gray-100 px-4 py-8"
                          onClick={(e) =>
                            handleNotificationClick(e, notification)
                          }
                        >
                          <div className="relative flex items-center justify-center flex-shrink-0">
                            <img
                              src={notification.sender.profilePicture}
                              alt={`${notification.sender._id}-sender-pfp`}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          </div>

                          <div className="flex flex-col flex-1 gap-y-1 min-w-0">
                            <span className="text-sm text-black leading-snug break-words">
                              {notification.message
                                .split(/(@\w+)/g)
                                .map((part, i) =>
                                  part.startsWith("@") ? (
                                    <span
                                      key={i}
                                      className="font-bold text-gray-950"
                                    >
                                      {part}
                                    </span>
                                  ) : (
                                    part
                                  )
                                )}
                            </span>

                            <span className="block text-xs text-gray-500">
                              {getDateStamp(notification.createdAt)}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <span className="text-md text-gray-500">
                      No new notifications.
                    </span>
                  ))}
              </div>
            </div>
          </div>

          <div className="relative cursor-text">
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
              className="lucide lucide-search absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-64 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:bg-white"
              onKeyDown={handleKeyDown}
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
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-log-out w-4 h-4"
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
