import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import ConnectionBanner from "./components/ConnectionBanner";
import ProtectedRoute from "./components/ProtectedRoute";
import AppProvider from "./context/AppProvider";
import Layout from "./layout/Layout";
import { Feed } from "./pages/Feed";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import Post from "./pages/Post";
import Profile from "./pages/Profile";
import { Registration } from "./pages/Registration";
import EditProfile from "./pages/EditProfile";
import ResetPassword from "./pages/ResetPassword";
import Explore from "./pages/Explore";
import { NotFound } from "./pages/NotFound";
import SearchPage from "./pages/SearchPage";

const Router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/feed" element={<Feed />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/post/:postId" element={<Post />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/search/:key?" element={<SearchPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

function App() {
  return (
    <AppProvider>
      <RouterProvider router={Router} />
      <ConnectionBanner />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </AppProvider>
  );
}

export default App;
