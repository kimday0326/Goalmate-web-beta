import React, { useState, useEffect, useRef, useCallback } from "react";
import "../styles/ChatRoom.css";

function ChatRoom({ room, onClose }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const chatBodyRef = useRef(null);
  const isInitialLoad = useRef(true);

  // 스크롤을 맨 아래로 이동시키는 함수
  const scrollToBottom = useCallback(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    if (room) {
      fetchComments(room.commentRoomId, 1, true);
    }

    // ESC 키 이벤트 리스너 추가
    const handleEscapeKey = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscapeKey);

    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, [room, onClose]);

  // 새 메시지가 추가되거나 초기 로드 시 스크롤을 맨 아래로
  useEffect(() => {
    if (isInitialLoad.current && comments.length > 0) {
      chatBodyRef.current?.scrollTo(0, chatBodyRef.current.scrollHeight);
      isInitialLoad.current = false;
    }
  }, [comments]);

  // 초기 로드와 새 메시지 작성 시에만 스크롤 아래로
  useEffect(() => {
    if (page === 1) {
      scrollToBottom();
    }
  }, [comments, page, scrollToBottom]);

  const fetchComments = async (roomId, pageNum, isInitial = false) => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8080/comment-rooms/${roomId}/comments?page=${pageNum}&size=20`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      const data = await response.json();

      if (data.status === "SUCCESS") {
        // 시간순으로 정렬 (오래된 순)
        const sortedComments = data.data.comments.sort(
          (a, b) => new Date(a.commented_at) - new Date(b.commented_at)
        );

        if (isInitial) {
          setComments(sortedComments);
          setPage(1);
          // 초기 로드 시 스크롤 맨 아래로
          setTimeout(scrollToBottom, 100);
        } else {
          // 이전 메시지 로드 시 위에 추가
          setComments((prev) => [...sortedComments, ...prev]);
          setPage(pageNum);
        }
        setHasMore(data.data.page.hasNext);
      }
    } catch (error) {
      console.error("코멘트 불러오기 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = useCallback(() => {
    const chatBody = chatBodyRef.current;
    if (!chatBody || loading || !hasMore) return;

    // 스크롤이 상단에 가까워졌을 때 이전 메시지 로드
    if (chatBody.scrollTop < 100) {
      fetchComments(room.commentRoomId, page + 1);
    }
  }, [loading, hasMore, page, room]);

  useEffect(() => {
    const chatBody = chatBodyRef.current;
    if (chatBody) {
      chatBody.addEventListener("scroll", handleScroll);
      return () => chatBody.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim() || !room) return;

    try {
      const response = await fetch(
        `http://localhost:8080/comment-rooms/${room.commentRoomId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({ comment: newComment }),
        }
      );

      const data = await response.json();

      if (data.status === "SUCCESS") {
        setNewComment("");
        await fetchComments(room.commentRoomId, 1, true);
      } else {
        alert(data.message || "코멘트 작성에 실패했습니다.");
      }
    } catch (error) {
      console.error("코멘트 작성 오류:", error);
      alert("코멘트 작성에 실패했습니다.");
    }
  };

  const isRightAligned = (role) => {
    return role === "MENTOR" || role === "ADMIN";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSubmitComment(e);
    }
  };

  if (!room) return null;

  return (
    <div className="chat-room">
      <div className="chat-header">
        <div className="chat-title">
          <h3>{room.menteeName}님의 코멘트</h3>
          <p className="chat-subtitle">{room.title}</p>
        </div>
        <button className="close-chat-button" onClick={onClose}>
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className="chat-body" ref={chatBodyRef}>
        {loading && page === 1 ? (
          <div className="loading-spinner-container">
            <div className="spinner"></div>
            <p>코멘트를 불러오는 중...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="no-comments">
            <p>아직 코멘트가 없습니다.</p>
          </div>
        ) : (
          <div className="comments-list">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className={`comment-item ${
                  isRightAligned(comment.writer_role)
                    ? "right-aligned"
                    : "left-aligned"
                }`}
              >
                <div className="comment-header">
                  <div className="comment-user">
                    <strong>{comment.writer}</strong>
                    <span className="comment-date">
                      {new Date(comment.commented_at).toLocaleString("ko-KR")}
                    </span>
                  </div>
                </div>
                <p className="comment-content">{comment.comment}</p>
              </div>
            ))}
            {loading && page > 1 && (
              <div className="loading-more">
                <div className="spinner"></div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="chat-footer">
        <form onSubmit={handleSubmitComment} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="코멘트를 작성해주세요... (Cmd/Ctrl + Enter로 전송)"
            rows="3"
            disabled={loading}
          />
          <button
            type="submit"
            className="submit-button"
            disabled={loading || !newComment.trim()}
          >
            전송
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatRoom;
