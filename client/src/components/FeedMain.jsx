import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import ProfileContext from "../context/ProfileContext";
import { cleanUp, toggleReadMore } from "../features/post/postSlice";
import {
  createAPost,
  getAllPosts,
  getUserPosts,
} from "../features/post/postThunks";
import { Button } from "./Button";
import ContentCard from "./ContentCard";
import CarouselImageViewer from "./CarouselImageViewer";
import InputContainer from "./InputContainer";
import ModifiedTextArea from "./ModifiedTextArea";

const FeedMain = ({ showExplore = false }) => {
  const dispatch = useDispatch();
  const [editable, setEditable] = useState(false);
  const [post, setPost] = useState("");

  const [files, setFiles] = useState([]);
  const [images, setImages] = useState([]);

  const [zoomedImage, setZoomedImage] = useState(null);

  const [currIdx, setCurrIdx] = useState(0);

  const allPosts = useSelector((state) => state.post.posts);
  const postsLoading = useSelector((state) => state.post.loading);
  const error = useSelector((state) => state.post.error);
  const currentUser = useSelector((state) => state.user.user);

  const createPostLoading = useSelector(
    (state) => state.post.createPostLoading
  );

  const fileInputRef = useRef(null);

  // const { getAProfile, amIFollowing, getAllProfiles } =
  //   useContext(ProfileContext);
  const navigate = useNavigate();

  const addImageHandler = (e) => {
    const inputFiles = Array.from(e.target.files);

    if (inputFiles.length > 10) {
      toast.warn("Max 10 images are allowed.");
      e.target.value = "";
      return;
    }

    setFiles((oldFiles) => [...oldFiles, ...inputFiles]);

    const images = inputFiles.map((file) => URL.createObjectURL(file));
    setImages((oldImages) => [...oldImages, ...images]);
  };

  const deleteImageHandler = (e, index) => {
    e.stopPropagation();

    setImages((images) => images.filter((_, i) => i !== index));
    setFiles((files) => files.filter((_, i) => i !== index));
  };

  const openImageHandler = (e, index) => {
    e.stopPropagation();

    setZoomedImage(images.at(index));
    setCurrIdx(index);
  };

  const handleCreatePost = async () => {
    try {
      await dispatch(createAPost({ content: post, images: files })).unwrap();
      setPost("");
      setImages([]);
      setFiles([]);
      setEditable(false);
      toast.success("Post created successfully!");
    } catch (error) {
      toast.error(error || "Something went wrong while creating the post");
    }
  };

  const handleProfileClick = (e, createdBy) => {
    e.stopPropagation();
    navigate(`/profile/${createdBy.username}`);
  };

  useEffect(() => {
    dispatch(toggleReadMore(false));

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
      <div className="flex justify-center items-center h-[calc(100vh-4.5rem)]">
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
    <>
      {/* {zoomedImage && (
        <div
          className="fixed inset-0 backdrop-blur-md w-full h-full flex justify-center items-center bg-black/70 z-1000"
          onClick={(e) => {
            if (e.target.tagName !== "IMG") setZoomedImage(null);
          }}
        >
          <Button extraStyle="absolute top-8 right-8 flex items-center justify-center w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 shadow-md transition-transform hover:scale-120">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </Button>

          <img
            src={zoomedImage}
            className="max-w-[80%] max-h-[80%] rounded-xl shadow-lg cursor-zoom-out"
          />
        </div>
      )} */}

      <CarouselImageViewer
        images={images}
        zoomedImage={zoomedImage}
        setZoomedImage={setZoomedImage}
        currIdx={currIdx}
        setCurrIdx={setCurrIdx}
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {allPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)]">
            <h1 className="text-3xl font-bold text bg-gradient-to-r from-rose-500 to-purple-500 bg-clip-text text-transparent">
              No posts here
            </h1>
            <h3 className="text-md text-gray-500">
              Follow other people to see their posts.
            </h3>
          </div>
        ) : (
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
                            {/* <textarea
                              value={post}
                              onChange={(e) => setPost(e.target.value)}
                              name="write-post"
                              id="write-post"
                              placeholder="Share your thoughts"
                              className="flex min-h-[80px] w-full border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 focus:border-gray-500 resize-none rounded-lg"
                              maxLength={1500}
                            ></textarea> */}
                            <ModifiedTextArea
                              value={post}
                              setValue={setPost}
                              mode={"post"}
                            />
                            <div className="text-gray-500 text-right mt-2">
                              <span>{post.length}</span>
                              <span>/1500</span>
                            </div>

                            <div className="flex space-x-4 px-4">
                              {images.length > 0 &&
                                images.slice(0, 4).map((src, index) => (
                                  <div className="relative w-18 h-18  bg-white/10 backdrop-blur-md border border-black/20 shadow-lg rounded-2xl">
                                    <div className="overflow-hidden w-full h-full rounded-2xl">
                                      {index === 3 && (
                                        <div
                                          className="absolute inset-0 bg-black/60 rounded-2xl z-100 flex items-center justify-center cursor-pointer"
                                          onClick={(e) =>
                                            openImageHandler(e, 3)
                                          }
                                        >
                                          <span className="text-white font-semibold text-lg">
                                            +{images.length - index}
                                          </span>
                                        </div>
                                      )}
                                      <img
                                        key={index}
                                        src={src}
                                        alt={`preview-${index}`}
                                        className="w-full h-full object-cover cursor-pointer transition-transform duration-250 hover:rotate-2 hover:scale-105"
                                        onClick={(e) =>
                                          openImageHandler(e, index)
                                        }
                                      />
                                    </div>

                                    <Button
                                      extraStyle="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 shadow-md transition-transform hover:scale-120 z-1000"
                                      onClick={(e) =>
                                        deleteImageHandler(e, index)
                                      }
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="white"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="w-2 h-2"
                                      >
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                      </svg>
                                    </Button>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            ref={fileInputRef}
                            onChange={addImageHandler}
                            style={{ display: "none" }}
                          />
                          <Button
                            extraStyle={
                              "hover:text-accent-foreground h-9 px-3 text-gray-500 hover:bg-gray-100 rounded-lg text-sm hover:text-gray-700"
                            }
                            isDisabled={images.length >= 10}
                            onClick={() => fileInputRef.current.click()}
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
                            Add Image{" "}
                            {images.length > 0 && `(${images.length} / 10)`}
                          </Button>

                          <div className="space-x-4">
                            <Button
                              extraStyle={
                                "h-10 px-4 py-2 hover:bg-red-100 rounded-lg hover:text-red-600"
                              }
                              onClick={() => setEditable((prev) => !prev)}
                              isDisabled={createPostLoading}
                            >
                              Cancel
                            </Button>
                            <Button
                              extraStyle={
                                "h-10 px-4 py-2 bg-gradient-to-r from-rose-400 to-purple-400 hover:from-rose-500 hover:to-purple-500 rounded-lg text-white"
                              }
                              onClick={handleCreatePost}
                              isDisabled={!post.trim() || createPostLoading}
                            >
                              {createPostLoading ? (
                                <span className="flex items-center">
                                  <svg
                                    className="animate-spin h-4 w-4 mr-2"
                                    viewBox="0 0 24 24"
                                  >
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
                                  Posting...
                                </span>
                              ) : (
                                "Post"
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // <InputContainer
                      //   clickHandler={handleCreatePost}
                      //   loadingState={createPostLoading}
                      //   user={currentUser}
                      //   setEditable={setEditable}
                      // />
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
                  profileClickHandler={(e) =>
                    handleProfileClick(e, post.createdBy)
                  }
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
        )}
      </div>
    </>
  );
};

export default FeedMain;
