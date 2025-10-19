import ProfileEditForm from "../components/ProfileEditForm";
import ProfileHeader from "../components/ProfileHeader";

const EditProfile = () => {
  return (
    <div className="min-h-screen">
      <ProfileHeader myProfile={true} />;
      <ProfileEditForm />
    </div>
  );
};

export default EditProfile;
