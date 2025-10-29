import React, { useState, useEffect } from "react";

const CarouselPosts = ({ images = [], extraStyle = "" }) => {
  const [currIdx, setCurrIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imageKey, setImageKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    setImageKey((prev) => prev + 1);
  }, [currIdx]);

  const navigate = (e, direction) => {
    e.stopPropagation();

    if (direction == 1) {
      setCurrIdx((idx) => Math.max(idx - 1, 0));
    } else {
      setCurrIdx((idx) => (idx + 1) % images.length);
    }
  };

  return images.length > 0 ? (
    <div className={`relative w-full overflow-hidden rounded-lg ${extraStyle}`}>
      {images.length > 1 && currIdx !== 0 && (
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/70 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          onClick={(e) => navigate(e, 1)}
          disabled={currIdx === 0 || loading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      <div
        className={`relative bg-gray-100 w-full ${
          loading ? "h-[450px]" : "min-h-[350px] max-h-[450px]"
        }  rounded-lg overflow-hidden`}
      >
        <div
          className={`absolute inset-0 bg-gray-200 z-10 transition-opacity duration-200 ${
            loading ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-16 h-16 text-gray-400/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        <img
          key={imageKey}
          src={images.at(currIdx)}
          alt={`post-image-${currIdx}`}
          className={` absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
            loading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
        />
      </div>

      {images.length > 1 && (
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/70 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          onClick={(e) => navigate(e, -1)}
          disabled={loading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-2 right-2 bg-black/60 text-white rounded-full px-2 py-1 text-xs pointer-events-none z-20">
          {currIdx + 1} / {images.length}
        </div>
      )}
    </div>
  ) : null;
};

export default CarouselPosts;
