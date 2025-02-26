import React, { useState, useEffect } from 'react';
import '../styles/ChatRoom.css';

function ChatRoom({ room, onClose }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (room) {
      fetchComments(room.commentRoomId);
    }
    
    // ESC 키 이벤트 리스너 추가
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [room, onClose]);
  
  const fetchComments = async (roomId) => {
    setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:8080/api/v2/admin/comment-rooms/${roomId}/comments?page=1&size=50`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      
      const data = await response.json();
      
      if (data.status === 'SUCCESS') {
        setComments(data.data.content || []);
      } else {
        console.error('코멘트 불러오기 실패:', data.message);
      }
    } catch (error) {
      console.error('코멘트 불러오기 오류:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim() || !room) return;
    
    try {
      const response = await fetch(`http://localhost:8080/api/v2/admin/comment-rooms/${room.commentRoomId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ content: newComment })
      });
      
      const data = await response.json();
      
      if (data.status === 'SUCCESS') {
        setNewComment('');
        fetchComments(room.commentRoomId);
      } else {
        alert(data.message || '코멘트 작성에 실패했습니다.');
      }
    } catch (error) {
      console.error('코멘트 작성 오류:', error);
      alert('코멘트 작성에 실패했습니다.');
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
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div className="chat-body">
        {loading ? (
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
            {comments.map(comment => (
              <div key={comment.id} className="comment-item">
                <div className="comment-header">
                  <div className="comment-user">
                    <strong>{comment.userName}</strong>
                    <span className="comment-date">
                      {new Date(comment.createdAt).toLocaleString('ko-KR')}
                    </span>
                  </div>
                </div>
                <p className="comment-content">{comment.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="chat-footer">
        <form onSubmit={handleSubmitComment} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="코멘트를 작성해주세요..."
            rows="3"
            disabled={loading}
          />
          <button type="submit" className="submit-button" disabled={loading || !newComment.trim()}>
            전송
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatRoom; 