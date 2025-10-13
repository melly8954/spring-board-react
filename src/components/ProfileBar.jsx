import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/axiosInstance";
import { logout } from '../api/auth';
import handleServerError from "../utils/handleServerError";
import '../styles/profileBar.css';

function ProfileBar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authApi.get("/members/me");
        console.log(response);
        setUser(response.data.data);
      } catch (error) {
        console.log(error);
        navigate("/");
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await logout();
      alert(response.message);
      navigate("/");
    } catch (error) {
      handleServerError(error);
    }
  };

  if (!user) return null;

  return (
    <div className="profile-bar">
      <div className="profile-icon">
        {user.profileImage ? (
          <img src={user.profileImage} alt="프로필" />
        ) : (
          <div className="placeholder-icon">{user.name}</div>
        )}
      </div>
      <span className="profile-name">{user.name} 님 접속 중</span>
      <button className="logout-btn" onClick={handleLogout}>로그아웃</button>
    </div>
  );
}

export default ProfileBar;