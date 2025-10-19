import { useNavigate } from "react-router";
import { Button } from "./Button";

const PostHeader = () => {
  const navigate = useNavigate();
  return (
    <header className="w-full bg-white">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex space-x-4 items-center">
            <Button
              extraStyle={
                "h-10 px-4 rounded-lg hover:bg-gray-100 hover:text-gray-800"
              }
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

            <h3 className="text-gray-900 font-bold text-xl">Post</h3>
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

export default PostHeader;
