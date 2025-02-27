import { useState, useEffect } from "react";
import { getGoals } from "../services/goal.service";
import "../styles/GoalList.css";
import { useNavigate } from "react-router-dom";

function GoalList() {
  const [goals, setGoals] = useState([]);
  const [pageInfo, setPageInfo] = useState(null);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showPopup, setShowPopup] = useState(false);
  const [goalIdInput, setGoalIdInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchGoals(currentPage);

    // 반응형 디자인을 위한 리사이즈 이벤트 리스너
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentPage]);

  const fetchGoals = async (page) => {
    try {
      const response = await getGoals(page, 10);
      if (response.status === "SUCCESS") {
        setGoals(response.data.goals);
        setPageInfo(response.data.page);
      } else {
        setError(response.message);
      }
    } catch (error) {
      console.error("API 에러:", error);
      setError("목표 목록을 불러오는데 실패했습니다.");
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedGoals = [...goals].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setGoals(sortedGoals);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? " ↑" : " ↓";
    }
    return "";
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleGoalClick = (goalId) => {
    navigate(`/goals/${goalId}`);
  };

  const handleMenteeStatus = (e, goalId) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/goals/${goalId}/participation`);
  };

  const handlePopupSubmit = (e) => {
    e.preventDefault();
    if (goalIdInput.trim()) {
      navigate(`/goals/${goalIdInput}/mentees`);
      setShowPopup(false);
      setGoalIdInput("");
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    setGoalIdInput("");
  };

  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="goal-list-container">
      <h1>목표 목록</h1>

      {!isMobile ? (
        // 데스크탑 테이블 뷰
        <div className="table-container">
          <table className="goal-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("id")}>ID{getSortIcon("id")}</th>
                <th onClick={() => handleSort("title")}>
                  제목{getSortIcon("title")}
                </th>
                <th onClick={() => handleSort("topic")}>
                  주제{getSortIcon("topic")}
                </th>
                <th onClick={() => handleSort("period")}>
                  기간{getSortIcon("period")}
                </th>
                <th onClick={() => handleSort("daily_duration")}>
                  일일시간{getSortIcon("daily_duration")}
                </th>
                <th onClick={() => handleSort("current_participants")}>
                  참여자{getSortIcon("current_participants")}
                </th>
                <th onClick={() => handleSort("mentor_name")}>
                  멘토{getSortIcon("mentor_name")}
                </th>
                <th onClick={() => handleSort("goal_status")}>
                  상태{getSortIcon("goal_status")}
                </th>
                <th>마감임박</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {goals.map((goal) => (
                <tr
                  key={goal.id}
                  className={goal.is_closing_soon ? "closing-soon" : ""}
                >
                  <td
                    onClick={() => handleGoalClick(goal.id)}
                    style={{ cursor: "pointer" }}
                  >
                    {goal.id}
                  </td>
                  <td
                    onClick={() => handleGoalClick(goal.id)}
                    style={{ cursor: "pointer" }}
                  >
                    {goal.title}
                  </td>
                  <td
                    onClick={() => handleGoalClick(goal.id)}
                    style={{ cursor: "pointer" }}
                  >
                    {goal.topic}
                  </td>
                  <td
                    onClick={() => handleGoalClick(goal.id)}
                    style={{ cursor: "pointer" }}
                  >
                    {goal.period}일
                  </td>
                  <td
                    onClick={() => handleGoalClick(goal.id)}
                    style={{ cursor: "pointer" }}
                  >
                    {goal.daily_duration}분
                  </td>
                  <td
                    onClick={() => handleGoalClick(goal.id)}
                    style={{ cursor: "pointer" }}
                  >
                    {goal.current_participants}/{goal.participants_limit}
                  </td>
                  <td
                    onClick={() => handleGoalClick(goal.id)}
                    style={{ cursor: "pointer" }}
                  >
                    {goal.mentor_name}
                  </td>
                  <td
                    onClick={() => handleGoalClick(goal.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <span
                      className={`status ${goal.goal_status.toLowerCase()}`}
                    >
                      {goal.goal_status}
                    </span>
                  </td>
                  <td
                    onClick={() => handleGoalClick(goal.id)}
                    style={{ cursor: "pointer" }}
                  >
                    {goal.is_closing_soon && (
                      <span className="closing-badge">마감임박</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="mentee-button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigate(`/participations?goalId=${goal.id}`);
                        return false;
                      }}
                    >
                      참여현황
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        // 모바일 카드 뷰
        <div className="card-container">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className={`goal-card ${
                goal.is_closing_soon ? "closing-soon" : ""
              }`}
              onClick={() => handleGoalClick(goal.id)}
            >
              <div className="card-header">
                <div>
                  <span className="goal-id">#{goal.id}</span>
                  <h3>{goal.title}</h3>
                </div>
                {goal.is_closing_soon && (
                  <span className="closing-badge">마감임박</span>
                )}
              </div>

              <div className="card-content">
                <div className="card-info">
                  <div className="info-item">
                    <span className="label">주제:</span>
                    <span className="value">{goal.topic}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">멘토:</span>
                    <span className="value">{goal.mentor_name}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">기간:</span>
                    <span className="value">{goal.period}일</span>
                  </div>
                  <div className="info-item">
                    <span className="label">일일시간:</span>
                    <span className="value">{goal.daily_duration}분</span>
                  </div>
                  <div className="info-item">
                    <span className="label">참여자:</span>
                    <span className="value">
                      {goal.current_participants}/{goal.participants_limit}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">상태:</span>
                    <span
                      className={`status ${goal.goal_status.toLowerCase()}`}
                    >
                      {goal.goal_status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card-footer">
                <button
                  className="mentee-button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate(`/participations?goalId=${goal.id}`);
                    return false;
                  }}
                >
                  참여현황
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {pageInfo && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(pageInfo.prevPage)}
            disabled={!pageInfo.hasPrev}
            className="page-button"
          >
            이전
          </button>

          <span className="page-info">
            {pageInfo.currentPage} / {pageInfo.totalPages}
          </span>

          <button
            onClick={() => handlePageChange(pageInfo.nextPage)}
            disabled={!pageInfo.hasNext}
            className="page-button"
          >
            다음
          </button>
        </div>
      )}

      {/* 멘티 현황 팝업 */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <div className="popup-header">
              <h3>멘티 현황 조회</h3>
              <button className="close-button" onClick={handlePopupClose}>
                ×
              </button>
            </div>
            <form onSubmit={handlePopupSubmit}>
              <div className="popup-content">
                <label htmlFor="goalId">목표 ID</label>
                <input
                  type="text"
                  id="goalId"
                  value={goalIdInput}
                  onChange={(e) => setGoalIdInput(e.target.value)}
                  placeholder="목표 ID를 입력하세요"
                  autoFocus
                />
              </div>
              <div className="popup-footer">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={handlePopupClose}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="search-icon-button"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading-spinner-small"></span>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GoalList;
