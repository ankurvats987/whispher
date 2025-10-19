import { data, Link, useNavigate } from "react-router";
import { Button } from "../components/Button";
import { Logo } from "../components/Logo";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError } from "../features/auth/authSlice";
import ErrorMessage from "../components/ErrorMessage";
import { useEffect, useRef, useState } from "react";
import { registerUser } from "../features/auth/authThunks";

export const Registration = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const dispatch = useDispatch();
  const authLoading = useSelector((state) => state.auth.loading);

  const navigate = useNavigate();

  const from = location.state?.from?.pathname || "/feed";

  const fileInputRef = useRef();

  const handleInputClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return null;

    const url = URL.createObjectURL(file);
    setImageFile(file);
    setImageUrl(url);
  };

  const {
    register,
    setError,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("pwd");

  const onSubmit = async (data) => {
    const formdata = new FormData();

    formdata.append("email", data.email);
    formdata.append("displayName", data.fullName);
    formdata.append("username", data.username);
    formdata.append("password", data.pwd);

    if (imageFile) formdata.append("avatar", imageFile);

    const resultAction = await dispatch(registerUser(formdata));

    if (registerUser.fulfilled.match(resultAction)) {
      navigate(from, { replace: true });
    }

    if (registerUser.rejected.match(resultAction)) {
      setError("root", {
        type: "manual",
        message: resultAction.payload,
      });
    }
  };

  useEffect(() => {
    return () => clearAuthError();
  }, [dispatch]);

  return (
    <main className="min-h-screen p-6 flex items-center justify-center">
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-teal-200/30 to-cyan-200/30 rounded-full blur-3xl"></div>
        <div class="absolute bottom-1/4 left-1/4 w-48 h-48 bg-gradient-to-r from-rose-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
        <div class="absolute top-3/4 right-1/3 w-32 h-32 bg-gradient-to-r from-yellow-200/30 to-orange-200/30 rounded-full blur-2xl"></div>
      </div>
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Logo />
        </div>
        <div className="bg-white/80 text-card-foreground backdrop-blur-sm rounded-2xl shadow-3xl border-0">
          <div className="flex flex-col space-y-1.5 p-6 pb-6 text-center">
            <h3 className="tracking-tight text-2xl font-bold text-gray-800">
              Join Whisper
            </h3>
            <p className="text-gray-600 mt-2">
              Create your account and start sharing
            </p>
          </div>
          <div className="p-6 pt-0 space-y-6">
            <div className="flex items-center justify-center">
              <div className="relative">
                <div
                  className="w-20 h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:from-gray-300 hover:to-gray-400 transition-colors"
                  onClick={handleInputClick}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Profile Picture"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
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
                      class="lucide lucide-upload w-8 h-8 text-gray-500"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" x2="12" y1="3" y2="15"></line>
                    </svg>
                  )}
                </div>

                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-rose-400 to-purple-400 rounded-full flex items-center justify-center cursor-pointer hover:from-rose-500 hover:to-purple-500">
                  <span
                    className="text-xs text-white"
                    onClick={handleInputClick}
                  >
                    +
                  </span>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {errors.root && <ErrorMessage message={errors.root.message} />}
              <div className="space-y-2">
                <label
                  class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 font-medium"
                  for="email"
                >
                  Email
                </label>

                <input
                  {...register("email", {
                    required: "Email is required.",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address ",
                    },
                  })}
                  class="mt-2 flex w-full border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-xl border-gray-200 focus:border-purple-300 focus:ring-purple-200 h-12"
                  id="email"
                  placeholder="Enter your email"
                  type="email"
                ></input>
                {errors.email && (
                  <div className="text-red-500 text-xs ml-2">
                    {errors.email.message}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label
                  class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 font-medium"
                  for="fullName"
                >
                  Full Name
                </label>

                <input
                  {...register("fullName", {
                    required: "Full Name is required.",
                  })}
                  class="mt-2 flex w-full border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-xl border-gray-200 focus:border-purple-300 focus:ring-purple-200 h-12"
                  id="fullName"
                  placeholder="Enter your full name"
                  type="text"
                ></input>
                {errors.fullName && (
                  <div className="text-red-500 text-xs ml-2">
                    {errors.fullName.message}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label
                  class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 font-medium"
                  for="username"
                >
                  Username
                </label>
                <input
                  {...register("username", {
                    required: "Username is required.",
                    pattern: {
                      value: /^[a-z]+$/,
                      message: "Only lowercase characters are allowed.",
                    },
                  })}
                  class="mt-2 flex w-full border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-xl border-gray-200 focus:border-purple-300 focus:ring-purple-200 h-12"
                  id="username"
                  placeholder="Choose a username"
                  type="text"
                  fdprocessedid="44s6ic"
                ></input>
                {errors.username && (
                  <div className="text-red-500 text-xs ml-2">
                    {errors.username.message}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label
                  class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 font-medium"
                  for="password"
                >
                  Password
                </label>

                <input
                  {...register("pwd", {
                    required: "Password is required.",
                    minLength: {
                      value: 8,
                      message: "Password must have atleast 8 characters.",
                    },
                  })}
                  className="mt-2 flex w-full border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-xl border-gray-200 focus:border-purple-300 focus:ring-purple-200 h-12"
                  id="password"
                  placeholder="Create a password"
                  type="password"
                ></input>
                {errors.pwd && (
                  <div className="text-red-500 text-xs ml-2">
                    {errors.pwd.message}
                  </div>
                )}
              </div>

              <div class="space-y-2">
                <label
                  class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 font-medium"
                  for="confirm-password"
                >
                  Confirm Password
                </label>

                <input
                  {...register("confirmpwd", {
                    required: "Confirm password is required.",
                    validate: (value) =>
                      value === password || "Passwords do not match.",
                  })}
                  class="mt-2 flex w-full border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-xl border-gray-200 focus:border-purple-300 focus:ring-purple-200 h-12"
                  id="confirm-password"
                  placeholder="Confirm your password"
                  type="password"
                ></input>
                {errors.confirmpwd && (
                  <div className="text-red-500 text-xs ml-2">
                    {errors.confirmpwd.message}
                  </div>
                )}
              </div>

              <Button
                isDisabled={isSubmitting || authLoading}
                extraStyle={
                  "bg-primary hover:bg-primary/90 px-4 py-2 w-full bg-gradient-to-r from-rose-400 to-purple-400 hover:from-rose-500 hover:to-purple-500 text-white rounded-xl h-12 text-lg"
                }
                title={
                  isSubmitting || authLoading
                    ? "Submitting..."
                    : "Create Account"
                }
              />
            </form>

            <div className="text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
