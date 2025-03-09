interface ProfilePopupProps {
  userDetail: UserDetailResponse | undefined;
}

export default function ProfilePopup({userDetail}: ProfilePopupProps) {
  if (!userDetail) return null;

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <img
        src={userDetail.profileImageUrl || '/assets/profile.png'}
        alt={userDetail.username || "프로필 사진"}
        className="w-10 h-10 rounded-full mx-auto mb-4"
      />
      <h3 className="text-subtitle font-semibold text-center">
        {userDetail.username}
        <br />
        <p className="text-body-bold text-gray-5 text-center">({userDetail.role})</p>
      </h3>
      <p className="text-body-regular text-gray-6 text-center">{userDetail.email}</p>
    </div>
  );
}
