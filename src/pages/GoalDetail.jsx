import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGoalDetail } from "../services/goal.service";
import "../styles/GoalDetail.css";

function GoalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [goal, setGoal] = useState(null);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetchGoalDetail();
  }, [id]);

  const fetchGoalDetail = async () => {
    try {
      const response = await getGoalDetail(id);
      if (response.status === "SUCCESS") {
        setGoal(response.data);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError("목표 상세 정보를 불러오는데 실패했습니다.");
    }
  };

  const handleEdit = () => {
    navigate(`/goals/${id}/edit`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (error) return <div className="error-message">Error: {error}</div>;
  if (!goal) return <div className="loading">Loading...</div>;

  return (
    <div className="goal-detail-container">
      <div className="detail-header">
        <div className="header-buttons">
          <button className="back-button" onClick={() => navigate("/goals")}>
            <span className="icon">←</span>
            목록으로
          </button>
        </div>
        <h1>{goal.title}</h1>
      </div>

      {goal.thumbnail_images && goal.thumbnail_images.length > 0 && (
        <div className="thumbnail-scroll">
          <div className="thumbnail-container">
            {goal.thumbnail_images.map((image) => (
              <img
                key={image.sequence}
                src={image.imageUrl}
                alt={`썸네일 ${image.sequence}`}
                className="thumbnail-image"
              />
            ))}
          </div>
        </div>
      )}

      <div className="goal-info">
        <div className="info-row">
          <span>주제:</span> {goal.topic}
        </div>
        <div className="info-row">
          <span>멘토:</span> {goal.mentor_name}
        </div>
        <div className="info-row">
          <span>기간:</span> {goal.period}일
        </div>
        <div className="info-row">
          <span>일일 학습 시간:</span> {goal.daily_duration}분
        </div>
        <div className="info-row">
          <span>참여자:</span> {goal.current_participants}/
          {goal.participants_limit}명
        </div>
      </div>

      <div className="goal-description">
        <h2>목표 설명</h2>
        <p>{goal.description}</p>
      </div>

      <div className="goal-objectives">
        <h2>주차별 목표</h2>
        {goal.weekly_objectives.map((objective) => (
          <div key={objective.week_number} className="objective-item">
            <h3>{objective.week_number}주차</h3>
            <p>{objective.description}</p>
          </div>
        ))}

        <h2>중간 목표</h2>
        {goal.mid_objectives.map((objective) => (
          <div key={objective.sequence} className="objective-item">
            <h3>목표 {objective.sequence}</h3>
            <p>{objective.description}</p>
          </div>
        ))}
      </div>

      {goal.content_images && goal.content_images.length > 0 && (
        <div className="content-images">
          <h2>상세 이미지</h2>
          <div className="content-image-grid">
            {goal.content_images.map((image) => (
              <img
                key={image.sequence}
                src={image.imageUrl}
                alt={`상세 이미지 ${image.sequence}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* 플로팅 메뉴 */}
      <div className={`floating-menu ${isMenuOpen ? "open" : ""}`}>
        <button
          className="menu-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ⋮
        </button>
        {isMenuOpen && (
          <div className="menu-items">
            <button onClick={() => navigate("/goals")}>목록으로</button>
            <button onClick={() => navigate(`/goals/${id}/edit`)}>
              수정하기
            </button>
            <button onClick={() => navigate(`/participations?goalId=${id}`)}>
              참여 현황
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default GoalDetail;
