import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGoalDetail, updateGoalStatus } from "../services/goal.service";
import "../styles/GoalDetail.css";
import LoadingSpinner from "../components/LoadingSpinner";

function GoalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [goal, setGoal] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchGoalDetail();
  }, [id]);

  useEffect(() => {
    // 드롭다운 외부 클릭 시 닫기
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchGoalDetail = async () => {
    setLoading(true);
    try {
      const response = await getGoalDetail(id);
      if (response.status === "SUCCESS") {
        setGoal(response.data);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError("목표 상세 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/goals/${id}/edit`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  // 상태 변경 핸들러
  const handleStatusChange = async (newStatus) => {
    if (statusLoading || goal.goal_status === newStatus) {
      setDropdownOpen(false);
      return;
    }

    setStatusLoading(true);
    setDropdownOpen(false);

    try {
      const response = await updateGoalStatus(id, newStatus);
      if (response.status === "SUCCESS") {
        // 상태 업데이트 성공 시 목표 정보 다시 불러오기
        fetchGoalDetail();
      } else {
        alert(response.message || "상태 변경에 실패했습니다.");
      }
    } catch (error) {
      console.error("상태 변경 오류:", error);
      alert("상태 변경에 실패했습니다.");
    } finally {
      setStatusLoading(false);
    }
  };

  // 상태에 따른 스타일 클래스 반환
  const getStatusClass = (status) => {
    switch (status) {
      case "OPEN":
        return "status-open";
      case "CLOSED":
        return "status-closed";
      case "DISABLED":
        return "status-disabled";
      default:
        return "status-unknown";
    }
  };

  if (error)
    return (
      <div className="goal-detail-container">
        <div className="error-message">Error: {error}</div>
      </div>
    );

  if (loading) return <LoadingSpinner size="big" text={true} />;

  return (
    <div className="goal-detail-container">
      <div className="detail-header">
        <button className="back-button" onClick={handleBack}>
          &larr;
        </button>
        <h1 className="goal-title">{goal.title}</h1>
        <div className="header-actions">
          <button className="action-button edit" onClick={handleEdit}>
            수정
          </button>
          <button
            className="action-button participants"
            onClick={() => navigate(`/participations?goalId=${id}`)}
          >
            참여 현황
          </button>
        </div>
      </div>

      <div className="goal-content">
        {goal.thumbnail_images && goal.thumbnail_images.length > 0 && (
          <div className="thumbnail-gallery">
            {goal.thumbnail_images.map((image) => (
              <img
                key={image.sequence}
                src={image.imageUrl}
                alt={`썸네일 ${image.sequence}`}
                className="thumbnail-image"
              />
            ))}
          </div>
        )}

        <div className="goal-summary">
          <div className="goal-meta">
            <div className="meta-item">
              <span className="meta-label">주제</span>
              <span className="meta-value">{goal.topic}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">멘토</span>
              <span className="meta-value">{goal.mentor_name}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">기간</span>
              <span className="meta-value">{goal.period}일</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">일평균 소요 시간</span>
              <span className="meta-value">{goal.daily_duration}시간</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">참여자</span>
              <span className="meta-value participants-count">
                {goal.current_participants}/{goal.participants_limit}명
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">상태</span>
              <div className="status-dropdown-container" ref={dropdownRef}>
                <button
                  className={`status-dropdown-button ${getStatusClass(
                    goal.goal_status
                  )}`}
                  onClick={() =>
                    !statusLoading && setDropdownOpen(!dropdownOpen)
                  }
                  disabled={statusLoading}
                >
                  {statusLoading ? (
                    <span className="loading-spinner-small"></span>
                  ) : (
                    <>
                      {goal.goal_status || "상태 미정"}
                      <span className="dropdown-arrow">▼</span>
                    </>
                  )}
                </button>
                {dropdownOpen && (
                  <div className="status-dropdown-menu">
                    <div
                      className={`status-option ${getStatusClass("OPEN")}`}
                      onClick={() => handleStatusChange("OPEN")}
                    >
                      OPEN
                    </div>
                    <div
                      className={`status-option ${getStatusClass("CLOSED")}`}
                      onClick={() => handleStatusChange("CLOSED")}
                    >
                      CLOSED
                    </div>
                    <div
                      className={`status-option ${getStatusClass("DISABLED")}`}
                      onClick={() => handleStatusChange("DISABLED")}
                    >
                      DISABLED
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="goal-description">
            <h2>목표 설명</h2>
            <p>{goal.description}</p>
          </div>
        </div>

        <div className="goal-objectives">
          <h2>목표 계획</h2>

          <div className="objectives-container">
            <div className="weekly-objectives">
              <h3>주차별 목표</h3>
              <ul className="objectives-list">
                {goal.weekly_objectives.map((objective) => (
                  <li key={objective.week_number} className="objective-item">
                    <span className="objective-week">
                      {objective.week_number}주차
                    </span>
                    <p>{objective.description}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mid-objectives">
              <h3>중간 목표</h3>
              <ul className="objectives-list">
                {goal.mid_objectives.map((objective) => (
                  <li key={objective.sequence} className="objective-item">
                    <span className="objective-seq">
                      목표 {objective.sequence}
                    </span>
                    <p>{objective.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {goal.content_images && goal.content_images.length > 0 && (
          <div className="content-images">
            <h2>상세 이미지</h2>
            <div className="image-gallery">
              {goal.content_images.map((image) => (
                <div key={image.sequence} className="gallery-item">
                  <img
                    src={image.imageUrl}
                    alt={`상세 이미지 ${image.sequence}`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GoalDetail;
