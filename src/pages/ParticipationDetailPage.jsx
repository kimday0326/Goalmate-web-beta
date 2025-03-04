import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/ParticipationDetailPage.css";
import {
  getParticipationDetail,
  formatDate,
  parseApiDate,
} from "../services/participation.service";

function ParticipationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [goalData, setGoalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  const fetchGoalData = async (date) => {
    setLoading(true);
    setError(null);

    try {
      const formattedDate = formatDate(date);
      const data = await getParticipationDetail(id, formattedDate);
      setGoalData(data);

      // 시작일과 종료일 설정
      if (data.mentee_goal) {
        setDateRange({
          startDate: parseApiDate(data.mentee_goal.start_date),
          endDate: parseApiDate(data.mentee_goal.end_date),
        });
      }
    } catch (err) {
      console.error("목표 데이터 불러오기 오류:", err);
      setError(err.message || "데이터를 불러오는데 실패했습니다.");

      // 인증 오류인 경우 로그인 페이지로 리다이렉트
      if (err.message.includes("인증") || err.message.includes("로그인")) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoalData(selectedDate);
  }, [id, selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "IN_PROGRESS":
        return "status-in-progress";
      case "COMPLETED":
        return "status-completed";
      case "FAILED":
        return "status-failed";
      case "CANCELLED":
        return "status-cancelled";
      default:
        return "";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "IN_PROGRESS":
        return "진행중";
      case "COMPLETED":
        return "완료됨";
      case "FAILED":
        return "실패";
      case "CANCELLED":
        return "취소됨";
      default:
        return status;
    }
  };

  const getTodoStatusClass = (status) => {
    switch (status) {
      case "TODO":
        return "todo-status-todo";
      case "IN_PROGRESS":
        return "todo-status-in-progress";
      case "COMPLETED":
        return "todo-status-completed";
      default:
        return "";
    }
  };

  const getTodoStatusText = (status) => {
    switch (status) {
      case "TODO":
        return "할 일";
      case "IN_PROGRESS":
        return "진행중";
      case "COMPLETED":
        return "완료";
      default:
        return status;
    }
  };

  const viewCommentRoom = () => {
    if (goalData?.mentee_goal?.comment_room_id) {
      navigate(
        `/comments?participationId=${goalData.mentee_goal.comment_room_id}`
      );
    }
  };

  const goBack = () => {
    navigate(-1); // 브라우저 히스토리에서 뒤로 이동
  };

  return (
    <div className="participation-detail-container">
      <div className="detail-header">
        <div className="title-section">
          <h1>
            {goalData?.mentee_goal?.title ? (
              <>
                {goalData.mentee_goal.title}{" "}
                <span className="mentor-highlight">
                  with {goalData.mentee_goal.mentor_name}
                </span>
              </>
            ) : (
              "참여 상세 정보"
            )}
          </h1>
          {goalData?.date && (
            <p className="current-date">{goalData.date} 현황</p>
          )}
        </div>
        <div className="date-picker-container">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            className="date-picker"
            minDate={dateRange.startDate}
            maxDate={dateRange.endDate}
            placeholderText="날짜 선택"
          />
        </div>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>데이터를 불러오는 중...</p>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {!loading && !error && goalData && (
        <div className="goal-detail-content">
          <div className="goal-info-card">
            <div className="goal-header">
              <h2>{goalData.mentee_goal.title}</h2>
              <span
                className={`status-badge ${getStatusClass(
                  goalData.mentee_goal.mentee_goal_status
                )}`}
              >
                {getStatusText(goalData.mentee_goal.mentee_goal_status)}
              </span>
            </div>

            <div className="goal-info-grid">
              <div className="info-item">
                <span className="info-label">목표 ID</span>
                <span className="info-value">
                  {goalData.mentee_goal.goal_id}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">주제</span>
                <span className="info-value">{goalData.mentee_goal.topic}</span>
              </div>
              <div className="info-item">
                <span className="info-label">멘토</span>
                <span className="info-value">
                  {goalData.mentee_goal.mentor_name}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">시작일</span>
                <span className="info-value">
                  {goalData.mentee_goal.start_date}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">종료일</span>
                <span className="info-value">
                  {goalData.mentee_goal.end_date}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">생성일</span>
                <span className="info-value">
                  {new Date(
                    goalData.mentee_goal.created_at
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>

            {goalData.mentee_goal.mentor_letter && (
              <div className="mentor-letter">
                <h3>멘토의 편지</h3>
                <p>{goalData.mentee_goal.mentor_letter}</p>
              </div>
            )}

            <div className="progress-section">
              <h3>진행 상황</h3>
              <div className="progress-stats">
                <div className="progress-stat-item">
                  <span className="stat-label">오늘 할 일</span>
                  <div className="stat-value-container">
                    <span className="stat-value completed">
                      {goalData.mentee_goal.today_completed_count}
                    </span>
                    <span className="stat-separator">/</span>
                    <span className="stat-value total">
                      {goalData.mentee_goal.today_todo_count}
                    </span>
                  </div>
                </div>
                <div className="progress-stat-item">
                  <span className="stat-label">전체 진행률</span>
                  <div className="stat-value-container">
                    <span className="stat-value completed">
                      {goalData.mentee_goal.total_completed_count}
                    </span>
                    <span className="stat-separator">/</span>
                    <span className="stat-value total">
                      {goalData.mentee_goal.total_todo_count}
                    </span>
                  </div>
                </div>
              </div>

              {/* 오늘 진행률 프로그래스 바 */}
              <div className="progress-item">
                <span className="progress-label">오늘 진행률</span>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar today-progress"
                    style={{
                      width: `${
                        goalData.mentee_goal.today_todo_count > 0
                          ? (goalData.mentee_goal.today_completed_count /
                              goalData.mentee_goal.today_todo_count) *
                            100
                          : 0
                      }%`,
                    }}
                  ></div>
                  <span className="progress-text">
                    {goalData.mentee_goal.today_todo_count > 0
                      ? Math.round(
                          (goalData.mentee_goal.today_completed_count /
                            goalData.mentee_goal.today_todo_count) *
                            100
                        )
                      : 0}
                    %
                  </span>
                </div>
              </div>

              {/* 전체 진행률 프로그래스 바 */}
              <div className="progress-item">
                <span className="progress-label">전체 진행률</span>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar total-progress"
                    style={{
                      width: `${
                        goalData.mentee_goal.total_todo_count > 0
                          ? (goalData.mentee_goal.total_completed_count /
                              goalData.mentee_goal.total_todo_count) *
                            100
                          : 0
                      }%`,
                    }}
                  ></div>
                  <span className="progress-text">
                    {goalData.mentee_goal.total_todo_count > 0
                      ? Math.round(
                          (goalData.mentee_goal.total_completed_count /
                            goalData.mentee_goal.total_todo_count) *
                            100
                        )
                      : 0}
                    %
                  </span>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button className="comment-button" onClick={viewCommentRoom}>
                코멘트룸 보기
              </button>
              <button className="back-list-button" onClick={goBack}>
                목록으로 돌아가기
              </button>
            </div>
          </div>

          <div className="todos-section">
            <h3>
              {formatDate(selectedDate)} 할 일 ({goalData.todos.length})
            </h3>
            {goalData.todos.length === 0 ? (
              <div className="no-todos">
                <p>이 날짜에 예정된 할 일이 없습니다.</p>
              </div>
            ) : (
              <div className="todos-list">
                {goalData.todos.map((todo) => (
                  <div key={todo.id} className="todo-item">
                    <div className="todo-header">
                      <span
                        className={`todo-status ${getTodoStatusClass(
                          todo.todo_status
                        )}`}
                      >
                        {getTodoStatusText(todo.todo_status)}
                      </span>
                      <span className="todo-time">
                        예상 소요시간: {todo.estimated_minutes}분
                      </span>
                    </div>
                    <div className="todo-description">{todo.description}</div>
                    {todo.mentor_tip && (
                      <div className="mentor-tip">
                        <span className="tip-label">멘토 팁:</span>{" "}
                        {todo.mentor_tip}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ParticipationDetailPage;
