import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "../styles/Navbar.css";
import goalmateLogo from "../assets/goalmate.svg";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  // 드롭다운 외부 클릭시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-content">
        <div className="nav-left">
          <Link to="/goals" className="nav-brand">
            <img src={goalmateLogo} alt="Goalmate" className="brand-icon" />
            <span className="brand-name">Goalmate</span>
          </Link>

          <div className="nav-links">
            <Link
              to="/goals"
              className={`nav-link ${
                location.pathname === "/goals" ? "active" : ""
              }`}
            >
              목표 목록
            </Link>
            <Link
              to="/goals/create"
              className={`nav-link ${
                location.pathname === "/goals/create" ? "active" : ""
              }`}
            >
              목표 등록
            </Link>
            <Link
              to="/participations"
              className={`nav-link ${
                location.pathname === "/participations" ? "active" : ""
              }`}
            >
              참여 현황
            </Link>
            <Link
              to="/comments"
              className={`nav-link ${
                location.pathname === "/comments" ? "active" : ""
              }`}
            >
              코멘트
            </Link>
          </div>
        </div>

        <div className="user-menu" ref={dropdownRef}>
          <button
            className="user-button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="dropdown-menu">
              <Link to="/profile" className="dropdown-item">
                내 정보
              </Link>
              <button onClick={handleLogout} className="dropdown-item">
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
