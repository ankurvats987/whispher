import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "./Button";
import { createAPost } from "../features/post/postThunks";
import { toast } from "react-toastify";

const InputContainer = ({
  user,
  length = 1500,
  feed = true,
  clickHandler,
  loadingState,
  setEditable,
}) => {
  const [content, setContent] = useState("");

  const dispatch = useDispatch();

  const [files, setFiles] = useState([]);
  const [images, setImages] = useState([]);

  const [currIdx, setCurrIdx] = useState(0);

  const fileInputRef = useRef(null);

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
      await dispatch(createAPost({ content, images: files })).unwrap();
      setContent("");
      setImages([]);
      setFiles([]);
      setEditable(false);
      toast.success("Post created successfully!");
    } catch (error) {
      toast.error(error || "Something went wrong while creating the post");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <img
          src={user.profilePicture}
          alt="Your Profile Picture"
          className="h-12 w-12 rounded-full object-cover"
        />

        <div className="flex flex-col flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            name="write-content"
            id="write-content"
            placeholder={feed ? "Share your thoughts" : "Add a comment..."}
            className="flex min-h-[80px] w-full border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 focus:border-gray-500 resize-none rounded-lg"
            maxLength={length}
          ></textarea>

          {feed && (
            <div className="text-gray-500 text-right mt-2">
              <span>{content.length}</span>
              <span>/{length}</span>
            </div>
          )}

          {feed && (
            <div className="flex space-x-4 px-4">
              {images.length > 0 &&
                images.slice(0, 4).map((src, index) => (
                  <div className="relative w-18 h-18  bg-white/10 backdrop-blur-md border border-black/20 shadow-lg rounded-2xl">
                    <div className="overflow-hidden w-full h-full rounded-2xl">
                      {index === 3 && (
                        <div
                          className="absolute inset-0 bg-black/60 rounded-2xl z-100 flex items-center justify-center cursor-pointer"
                          onClick={(e) => openImageHandler(e, 3)}
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
                        onClick={(e) => openImageHandler(e, index)}
                      />
                    </div>

                    <Button
                      extraStyle="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 shadow-md transition-transform hover:scale-120 z-1000"
                      onClick={(e) => deleteImageHandler(e, index)}
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
          )}
        </div>
      </div>

      <div className="flex justify-between items-center">
        {feed ? (
          <>
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
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                <circle cx="9" cy="9" r="2"></circle>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
              </svg>
              Add Image {images.length > 0 && `(${images.length} / 10)`}
            </Button>
          </>
        ) : (
          <div className="text-gray-400 text-sm">
            <span>{comment.length}/300</span>
          </div>
        )}

        <div className="space-x-4">
          {feed && (
            <Button
              extraStyle={
                "h-10 px-4 py-2 hover:bg-red-100 rounded-lg hover:text-red-600"
              }
              onClick={() => setEditable((prev) => !prev)}
              isDisabled={loadingState}
            >
              Cancel
            </Button>
          )}

          <Button
            extraStyle={
              "h-10 px-4 py-2 bg-gradient-to-r from-rose-400 to-purple-400 hover:from-rose-500 hover:to-purple-500 rounded-lg text-white"
            }
            onClick={feed ? handleCreatePost : clickHandler}
            isDisabled={!content.trim() || loadingState}
          >
            {loadingState ? (
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
                {feed ? "Posting..." : "Commenting..."}
              </span>
            ) : feed ? (
              "Post"
            ) : (
              "Comment"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InputContainer;
