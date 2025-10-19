import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import ProfileContext from "../context/ProfileContext";
import { cleanUp } from "../features/post/postSlice";
import {
  createAPost,
  getAllPosts,
  getUserPosts,
} from "../features/post/postThunks";
import { Button } from "./Button";
import ContentCard from "./ContentCard";

const FeedMain = ({ showExplore = false }) => {
  const dispatch = useDispatch();
  const [editable, setEditable] = useState(false);
  const [post, setPost] = useState("");
  const allPosts = useSelector((state) => state.post.posts);
  const postsLoading = useSelector((state) => state.post.loading);
  const error = useSelector((state) => state.post.error);
  const currentUser = useSelector((state) => state.user.user);

  const { getAProfile, amIFollowing, getAllProfiles } =
    useContext(ProfileContext);
  const navigate = useNavigate();

  const handleProfileClick = (e, createdBy) => {
    e.stopPropagation();
    console.log("profile clicked");
    navigate(`/profile/${createdBy.username}`);
  };

  const handleCreatePost = async () => {
    try {
      await dispatch(createAPost(post)).unwrap();
      setPost("");
      setEditable(false);
      toast.success("Post created successfully!");
    } catch (error) {
      toast.error(error || "Something went wrong while creating the post");
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (showExplore) {
          await dispatch(getAllPosts()).unwrap();
        } else {
          await dispatch(getUserPosts()).unwrap();
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();

    return () => dispatch(cleanUp());
  }, [dispatch]);

  if (postsLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-6rem)] bg-gradient-to-br from-rose-50 via-purple-50 to-teal-50">
        <span className="text-gray-500 text-lg">Loading posts...</span>
      </div>
    );
  } else if (error) {
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
          Failed to load posts
        </span>
        <span className="text-gray-500 text-sm mt-1">
          Please check your connection or try again later.
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          {showExplore && (
            <div className="text-card-foreground bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                {editable ? (
                  <div className="space-y-4">
                    <div className="flex space-x-4">
                      <img
                        src={currentUser.profilePicture}
                        alt="Your Profile Picture"
                        className="h-12 w-12 rounded-full object-cover"
                      />

                      <div className="flex flex-col flex-1">
                        <textarea
                          value={post}
                          onChange={(e) => setPost(e.target.value)}
                          name="write-post"
                          id="write-post"
                          placeholder="Share your thoughts"
                          className="flex min-h-[80px] w-full border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 focus:border-gray-500 resize-none rounded-lg"
                          maxLength={300}
                        ></textarea>
                        <div className="text-gray-500 text-right mt-2">
                          <span>{post.length}</span>
                          <span>/300</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <Button
                        extraStyle={
                          "hover:text-accent-foreground h-9 px-3 text-gray-500 hover:bg-gray-100 rounded-lg text-sm hover:text-gray-700"
                        }
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
                          class="lucide lucide-image w-4 h-4 mr-2"
                        >
                          <rect
                            width="18"
                            height="18"
                            x="3"
                            y="3"
                            rx="2"
                            ry="2"
                          ></rect>
                          <circle cx="9" cy="9" r="2"></circle>
                          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                        </svg>
                        Add Image
                      </Button>

                      <div className="space-x-4">
                        <Button
                          extraStyle={
                            "h-10 px-4 py-2 hover:bg-red-100 rounded-lg hover:text-red-600"
                          }
                          onClick={() => setEditable((prev) => !prev)}
                        >
                          Cancel
                        </Button>
                        <Button
                          extraStyle={
                            "h-10 px-4 py-2 bg-gradient-to-r from-rose-400 to-purple-400 hover:from-rose-500 hover:to-purple-500 rounded-lg text-white"
                          }
                          onClick={handleCreatePost}
                          isDisabled={!post.trim()}
                        >
                          Post
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Button
                    extraStyle={
                      "hover:text-accent-foreground px-4 py-2 w-full justify-start text-left text-gray-500 hover:bg-gray-50 rounded-lg h-12 cursor-text"
                    }
                    onClick={() => setEditable((prev) => !prev)}
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
                      class="lucide lucide-plus w-5 h-5 mr-3"
                    >
                      <path d="M5 12h14"></path>
                      <path d="M12 5v14"></path>
                    </svg>
                    What's on your mind?
                  </Button>
                )}
              </div>
            </div>
          )}

          {allPosts.map((post) => (
            <ContentCard
              key={post._id}
              content={post}
              cardClickHandler={() =>
                navigate(`/post/${post._id}`, {
                  state: { postId: post._id },
                })
              }
              profileClickHandler={(e) => handleProfileClick(e, post.createdBy)}
            />
          ))}
        </div>
        <div className="space-y-6 lg:col-span-2">
          <div className="text-card-foreground bg-white shadow-sm rounded-xl border border-gray-200">
            <div className="p-6">
              <h3 className="text-gray-900 font-semibold mb-4">
                Suggested for you
              </h3>
              <div className="space-y-4">
                {/* {getAllProfiles()
                  .filter(
                    (profile) =>
                      !amIFollowing(currentUser, profile.userId) &&
                      currentUser !== profile.userId
                  )
                  .sort(() => Math.random() - 0.5)
                  .slice(0, 4)
                  .map((profile) => {
                    console.log(profile);
                    return <ProfileCard key={profile.userId} user={profile} />;
                  })} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedMain;
