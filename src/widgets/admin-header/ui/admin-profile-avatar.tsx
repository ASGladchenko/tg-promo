import "./admin-profile-avatar.scss";

type AdminProfileAvatarProps = {
  imgUrl?: string | null;
  initials: string | null;
};

export function AdminProfileAvatar({ imgUrl, initials }: AdminProfileAvatarProps) {
  return (
    <span className="admin-profile-avatar" aria-hidden="true">
      {imgUrl && <img className="admin-profile-avatar__image" src={imgUrl} alt="" />}
      {!imgUrl && initials && <span>{initials}</span>}
    </span>
  );
}
