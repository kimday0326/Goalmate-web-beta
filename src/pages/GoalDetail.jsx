import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGoalDetail } from "../services/goal.service";
import "../styles/GoalDetail.css";

function GoalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [goal, setGoal] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoalDetail();
  }, [id]);

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

  if (error)
    return (
      <div className="goal-detail-container">
        <div className="error-message">Error: {error}</div>
      </div>
    );

  if (loading)
    return (
      <div className="goal-detail-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>데이터를 불러오는 중...</p>
        </div>
      </div>
    );

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
