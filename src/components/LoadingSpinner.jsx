import React from "react";
import "../styles/LoadingSpinner.css";

// small, medium, large
// text 표시 여부 선택
const LoadingSpinner = ({ size = "medium", text = false }) => {
  return (
    <div className="loading-container">
      <div className={`loading-spinner ${size}`}></div>
      {text && <p className="loading-text">로딩 중...</p>}
    </div>
  );
};

export default LoadingSpinner;
