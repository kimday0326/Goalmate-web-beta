import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ChatRoom from "../components/ChatRoom";
import { getCommentRooms } from "../services/comment.service";
import "../styles/CommentPage.css";
import LoadingSpinner from "../components/LoadingSpinner";

function CommentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialParticipationId = queryParams.get("participationId") || "";

  const [participationId, setParticipationId] = useState(
    initialParticipationId
  );
  const [commentRooms, setCommentRooms] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // 선택된 코멘트 방 관련 상태
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showChatPanel, setShowChatPanel] = useState(false);

  // 초기 participationId가 있으면 자동으로 검색 실행
  useEffect(() => {
    if (initialParticipationId) {
      handleSearch();
    }
  }, []);

  const handleSearch = async () => {
    // 코멘트 방 목록을 새로 검색할 때는 선택된 방 정보와 채팅 패널을 초기화
    setSelectedRoom(null);
    setShowChatPanel(false);

    if (!participationId.trim()) {
      setError("참여 ID를 입력해주세요.");
      return;
    }

    fetchCommentRooms(1);
    setHasSearched(true);
  };

  const fetchCommentRooms = async (page) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getCommentRooms(participationId, page);

      if (data.status === "SUCCESS") {
        setCommentRooms(data.data.content || []);
        setPageInfo({
          totalPages: data.data.totalPages,
          currentPage: data.data.currentPage,
          hasNext: data.data.hasNext,
          hasPrev: data.data.hasPrev,
          nextPage: data.data.nextPage,
          prevPage: data.data.prevPage,
        });

        setCurrentPage(page);
      } else {
        setError(data.message || "코멘트 방 목록을 불러오는데 실패했습니다.");
      }
    } catch (error) {
      console.error("코멘트 방 목록 불러오기 오류:", error);
      setError("코멘트 방 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleParticipationIdChange = (e) => {
    setParticipationId(e.target.value);
  };

  const handlePageChange = (page) => {
    fetchCommentRooms(page);
  };

  const goToParticipationList = () => {
    navigate("/participations");
  };

  // 코멘트 방 선택 처리
  const selectCommentRoom = (room) => {
    setSelectedRoom(room);
    setShowChatPanel(true);
  };

  // 채팅 패널 닫기
  const closeChatPanel = () => {
    setShowChatPanel(false);
    setSelectedRoom(null);
  };

  return (
    <div className="comment-page-container">
      <div
        className={`comment-list-section ${showChatPanel ? "with-chat" : ""}`}
      >
        <div className="search-header">
          <div className="title-section">
            <h1>코멘트 방</h1>
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
                  id="participationId"
                  value={participationId}
                  onChange={handleParticipationIdChange}
                  placeholder="참여 ID 검색..."
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
          <div className="comment-room-results">
            <h2>참여 ID: {participationId}의 코멘트 방 목록</h2>

            <div className="table-container">
              <table className="goal-table">
                <thead>
                  <tr>
                    <th>방 ID</th>
                    <th>멘티</th>
                    <th>멘토</th>
                    <th>목표 제목</th>
                    <th>시작일</th>
                    <th>종료일</th>
                    <th>새 코멘트</th>
                  </tr>
                </thead>
                <tbody>
                  {commentRooms.map((room) => (
                    <tr
                      key={room.commentRoomId}
                      className={`comment-room-row ${
                        selectedRoom &&
                        selectedRoom.commentRoomId === room.commentRoomId
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => selectCommentRoom(room)}
                    >
                      <td>{room.commentRoomId}</td>
                      <td>{room.menteeName}</td>
                      <td>{room.mentorName}</td>
                      <td>{room.title}</td>
                      <td>{room.startDate}</td>
                      <td>{room.endDate}</td>
                      <td>
                        {room.newCommentsCount > 0 ? (
                          <span className="new-comments-badge">
                            {room.newCommentsCount}
                          </span>
                        ) : (
                          <span className="no-new-comments">0</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {commentRooms.length === 0 && !loading && (
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
                  <h3>코멘트 방을 찾을 수 없습니다</h3>
                  <p>해당 참여에 대한 코멘트 방이 없습니다.</p>
                  <button
                    className="back-to-list-button"
                    onClick={goToParticipationList}
                  >
                    참여 현황으로 돌아가기
                  </button>
                </div>
              </div>
            )}

            {pageInfo && commentRooms.length > 0 && (
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

      {/* 채팅방 컴포넌트 */}
      {showChatPanel && selectedRoom && (
        <div className="chat-section">
          <ChatRoom room={selectedRoom} onClose={closeChatPanel} />
        </div>
      )}
    </div>
  );
}

export default CommentPage;
