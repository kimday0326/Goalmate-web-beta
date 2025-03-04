import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getParticipations } from "../services/participation.service";
import "../styles/GoalList.css";
import "../styles/ParticipationPage.css";
import LoadingSpinner from "../components/LoadingSpinner";

function ParticipationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialGoalId = queryParams.get("goalId") || "";

  const [goalId, setGoalId] = useState(initialGoalId);
  const [participations, setParticipations] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "ascending",
  });

  useEffect(() => {
    if (initialGoalId) {
      handleSearch();
    }
  }, []);

  const fetchParticipations = async (page) => {
    setLoading(true);
    setError(null);

    try {
      const { participations: participationData, pageInfo: pageInfoData } =
        await getParticipations(goalId, page);

      setParticipations(participationData);
      setPageInfo(pageInfoData);
      setCurrentPage(page);
    } catch (error) {
      console.error("참여 목록 불러오기 오류:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!goalId.trim()) {
      setError("목표 ID를 입력해주세요.");
      return;
    }

    fetchParticipations(1);
    setHasSearched(true);
  };

  const handleGoalIdChange = (e) => {
    setGoalId(e.target.value);
  };

  const handlePageChange = (page) => {
    fetchParticipations(page);
  };

  const goToGoalList = () => {
    navigate("/goals");
  };

  const viewCommentRoom = (participationId) => {
    navigate(`/comments?participationId=${participationId}`);
  };

  const viewParticipationDetail = (participationId) => {
    navigate(`/participations/${participationId}`);
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

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedParticipations = React.useMemo(() => {
    let sortableParticipations = [...participations];
    if (sortConfig.key) {
      sortableParticipations.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (
          sortConfig.key === "totalCompletedCount" ||
          sortConfig.key === "totalTodoCount"
        ) {
          const aPercent =
            a.totalTodoCount > 0
              ? (a.totalCompletedCount / a.totalTodoCount) * 100
              : 0;
          const bPercent =
            b.totalTodoCount > 0
              ? (b.totalCompletedCount / b.totalTodoCount) * 100
              : 0;
          aValue = aPercent;
          bValue = bPercent;
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableParticipations;
  }, [participations, sortConfig]);

  const getSortDirectionIcon = (key) => {
    if (sortConfig.key !== key) return "";
    return sortConfig.direction === "ascending" ? "↑" : "↓";
  };

  return (
    <div className="participation-page-container">
      <div className="participation-list-section">
        <div className="search-header">
          <div className="title-section">
            <h1>참여 현황</h1>
          </div>

          <div className="search-section">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="compact-search-form"
            >
              <div className="search-input-group">
                <input
                  type="text"
                  id="goalId"
                  value={goalId}
                  onChange={handleGoalIdChange}
                  placeholder="목표 ID 검색..."
                  className="search-input"
                />
                <button
                  type="submit"
                  className="search-icon-button"
                  disabled={loading}
                >
                  {loading ? (
                    <LoadingSpinner size="small" />
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

        {error && <p className="search-error-message">{error}</p>}

        {hasSearched && (
          <div className="participation-results">
            <h2>목표 ID: {goalId}의 참여 목록</h2>

            <div className="table-container">
              <table className="goal-table">
                <thead>
                  <tr>
                    <th
                      onClick={() => requestSort("id")}
                      data-icon={getSortDirectionIcon("id")}
                    >
                      참여 ID
                    </th>
                    <th
                      onClick={() => requestSort("menteeName")}
                      data-icon={getSortDirectionIcon("menteeName")}
                    >
                      멘티
                    </th>
                    <th
                      onClick={() => requestSort("mentorName")}
                      data-icon={getSortDirectionIcon("mentorName")}
                    >
                      멘토
                    </th>
                    <th
                      onClick={() => requestSort("title")}
                      data-icon={getSortDirectionIcon("title")}
                    >
                      목표 제목
                    </th>
                    <th
                      onClick={() => requestSort("startDate")}
                      data-icon={getSortDirectionIcon("startDate")}
                    >
                      시작일
                    </th>
                    <th
                      onClick={() => requestSort("endDate")}
                      data-icon={getSortDirectionIcon("endDate")}
                    >
                      종료일
                    </th>
                    <th
                      onClick={() => requestSort("participationStatus")}
                      data-icon={getSortDirectionIcon("participationStatus")}
                    >
                      진행 상태
                    </th>
                    <th
                      onClick={() => requestSort("todayCompletedCount")}
                      data-icon={getSortDirectionIcon("todayCompletedCount")}
                    >
                      오늘 할일
                    </th>
                    <th
                      onClick={() => requestSort("totalCompletedCount")}
                      data-icon={getSortDirectionIcon("totalCompletedCount")}
                    >
                      전체 진행률
                    </th>
                    <th>액션</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedParticipations.map((participation) => (
                    <tr
                      key={participation.id}
                      className="participation-row"
                      onClick={() => viewParticipationDetail(participation.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>{participation.id}</td>
                      <td>{participation.menteeName}</td>
                      <td>{participation.mentorName}</td>
                      <td>{participation.title}</td>
                      <td>{participation.startDate}</td>
                      <td>{participation.endDate}</td>
                      <td>
                        <span
                          className={`status-badge ${getStatusClass(
                            participation.participationStatus
                          )}`}
                        >
                          {getStatusText(participation.participationStatus)}
                        </span>
                      </td>
                      <td>
                        <div className="todo-progress">
                          <span className="todo-completed">
                            {participation.todayCompletedCount}
                          </span>
                          <span className="todo-separator">/</span>
                          <span className="todo-total">
                            {participation.todayTodoCount}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="progress-bar-container">
                          <div
                            className="progress-bar"
                            style={{
                              width: `${
                                participation.totalTodoCount > 0
                                  ? (participation.totalCompletedCount /
                                      participation.totalTodoCount) *
                                    100
                                  : 0
                              }%`,
                            }}
                          ></div>
                          <span className="progress-text">
                            {participation.totalTodoCount > 0
                              ? Math.round(
                                  (participation.totalCompletedCount /
                                    participation.totalTodoCount) *
                                    100
                                )
                              : 0}
                            %
                          </span>
                        </div>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <button
                          className="view-button"
                          onClick={() => viewCommentRoom(participation.id)}
                        >
                          코멘트 보기
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {participations.length === 0 && !loading && (
              <div className="no-results">
                <div className="no-results-content">
                  <svg
                    className="no-data-icon"
                    viewBox="0 0 24 24"
                    width="48"
                    height="48"
                  >
                    <path
                      fill="currentColor"
                      d="M20 6H4V4H20V6ZM21 12V14H3V12H21ZM17 19H7V17H17V19Z"
                    />
                  </svg>
                  <h3>참여 정보를 찾을 수 없습니다</h3>
                  <p>해당 목표에 대한 참여 정보가 없습니다.</p>
                  <button
                    className="back-to-list-button"
                    onClick={goToGoalList}
                  >
                    목표 목록으로 돌아가기
                  </button>
                </div>
              </div>
            )}

            {pageInfo && participations.length > 0 && (
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
          </div>
        )}
      </div>
    </div>
  );
}

export default ParticipationPage;
