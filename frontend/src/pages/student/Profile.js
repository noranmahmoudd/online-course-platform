import useAuth from "../../hooks/useAuth";
import { formatDate } from "../../utils/helpers";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1>My Profile</h1>
      <div className="card card-body profile-card">
        <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
        <dl className="profile-list">
          <dt>Name</dt>
          <dd>{user.name}</dd>
          <dt>Email</dt>
          <dd>{user.email}</dd>
          <dt>Role</dt>
          <dd className="capitalize">{user.role}</dd>
          <dt>Member since</dt>
          <dd>{formatDate(user.createdAt)}</dd>
        </dl>
      </div>
    </div>
  );
};

export default Profile;
