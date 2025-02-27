import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";
import goalmateLogo from "../assets/goalmate.svg";
import { login } from "../services/auth.service";

function LoginPage() {
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
    isAdmin: false,
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await login(
        {
          username: loginForm.username,
          password: loginForm.password,
        },
        loginForm.isAdmin
      );

      if (response.status === "SUCCESS") {
        navigate("/goals");
      } else {
        setError(response.message || "로그인에 실패했습니다.");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "로그인 중 오류가 발생했습니다."
      );
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div className="App">
      <div className="login-page">
        <div className="left-section">
          <img src={goalmateLogo} alt="Goalmate Logo" className="main-logo" />
          <h1>Goalmate</h1>
          <p className="slogan">목표를 향한 여정을 함께하세요</p>
        </div>

        <div className="right-section">
          <div className="login-box">
            <h2>로그인</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="login-form">
              <div className="input-group">
                <label>아이디</label>
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, username: e.target.value })
                  }
                />
              </div>
              <div className="input-group">
                <label>비밀번호</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  onKeyPress={handleKeyPress}
                />
              </div>
              <div className="admin-checkbox">
                <input
                  type="checkbox"
                  id="isAdmin"
                  checked={loginForm.isAdmin}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, isAdmin: e.target.checked })
                  }
                />
                <label htmlFor="isAdmin">관리자로 로그인</label>
              </div>
              <button type="submit">로그인</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
