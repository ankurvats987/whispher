import { useEffect } from "react";

const CarouselImageViewer = ({
  images,
  currIdx,
  setCurrIdx,
  zoomedImage,
  setZoomedImage,
}) => {
  useEffect(() => {
    if (zoomedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [zoomedImage]);

  useEffect(() => {
    if (!zoomedImage) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setZoomedImage(null);
      } else if (e.key === "ArrowLeft" && currIdx > 0) {
        setCurrIdx((idx) => Math.max(idx - 1, 0));
      } else if (e.key === "ArrowRight" && currIdx < images.length - 1) {
        setCurrIdx((idx) => Math.min(idx + 1, images.length - 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zoomedImage, currIdx, images.length, setCurrIdx, setZoomedImage]);

  if (!zoomedImage) return null;

  const handleBackdropClick = (e) => {
    if (e.target.tagName === "DIV") {
      setZoomedImage(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      {/* Close button */}
      <button
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/80 hover:bg-black shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white"
        onClick={() => setZoomedImage(null)}
        aria-label="Close image viewer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 sm:w-6 sm:h-6"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Main content container */}
      <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-6 md:p-8">
        {/* Left navigation button */}
        {images.length > 1 && currIdx > 0 && (
          <button
            className="absolute left-2 sm:left-4 md:left-6 z-40 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-black/80 hover:bg-black rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white"
            onClick={() => setCurrIdx((idx) => Math.max(idx - 1, 0))}
            aria-label="Previous image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}

        {/* Image container */}
        <div className="relative max-w-[90vw] max-h-[90vh]   sm:max-w-[85vw] sm:max-h-[85vh] md:max-w-[80vw] md:max-h-[80vh] flex flex-col items-center justify-center">
          {/* Main image */}
          <img
            key={currIdx}
            src={images.at(currIdx)}
            alt={`Image ${currIdx + 1} of ${images.length}`}
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-fadeIn"
            onClick={handleBackdropClick}
          />

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white rounded-full px-4 py-2 text-sm sm:text-base font-medium shadow-lg pointer-events-none">
              {currIdx + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Right navigation button */}
        {images.length > 1 && currIdx < images.length - 1 && (
          <button
            className="absolute right-2 sm:right-4 md:right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-black/80 hover:bg-black rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white"
            onClick={() =>
              setCurrIdx((idx) => Math.min(idx + 1, images.length - 1))
            }
            aria-label="Next image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default CarouselImageViewer;
