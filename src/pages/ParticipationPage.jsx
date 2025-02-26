import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/GoalList.css';
import '../styles/ParticipationPage.css';

function ParticipationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialGoalId = queryParams.get('goalId') || '';
  
  const [goalId, setGoalId] = useState(initialGoalId);
  const [participations, setParticipations] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  // 초기 goalId가 있으면 자동으로 검색 실행
  useEffect(() => {
    if (initialGoalId) {
      handleSearch();
    }
  }, []);
  
  const handleSearch = async () => {
    if (!goalId.trim()) {
      setError('목표 ID를 입력해주세요.');
      return;
    }
    
    fetchParticipations(1);
    setHasSearched(true);
  };
  
  const fetchParticipations = async (page) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:8080/api/v2/admin/goals/${goalId}/participations?page=${page}&size=10`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      
      const data = await response.json();
      
      if (data.status === 'SUCCESS') {
        setParticipations(data.data.content || []);
        setPageInfo({
          totalPages: data.data.totalPages,
          currentPage: data.data.currentPage,
          hasNext: data.data.hasNext,
          hasPrev: data.data.hasPrev,
          nextPage: data.data.nextPage,
          prevPage: data.data.prevPage
        });
        
        setCurrentPage(page);
      } else {
        setError(data.message || '참여 목록을 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('참여 목록 불러오기 오류:', error);
      setError('참여 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoalIdChange = (e) => {
    setGoalId(e.target.value);
  };
  
  const handlePageChange = (page) => {
    fetchParticipations(page);
  };
  
  const goToGoalList = () => {
    navigate('/goals');
  };
  
  const viewCommentRoom = (participationId) => {
    navigate(`/comments?participationId=${participationId}`);
  };
  
  const getStatusClass = (status) => {
    switch(status) {
      case 'IN_PROGRESS': return 'status-in-progress';
      case 'COMPLETED': return 'status-completed';
      case 'FAILED': return 'status-failed';
      case 'CANCELLED': return 'status-cancelled';
      default: return '';
    }
  };
  
  const getStatusText = (status) => {
    switch(status) {
      case 'IN_PROGRESS': return '진행중';
      case 'COMPLETED': return '완료됨';
      case 'FAILED': return '실패';
      case 'CANCELLED': return '취소됨';
      default: return status;
    }
  };
  
  return (
    <div className="participation-page-container">
      <div className="participation-list-section">
        <div className="search-header">
          <div className="title-section">
            <h1>참여 현황</h1>
          </div>
          
          <div className="search-section">
            <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="compact-search-form">
              <div className="search-input-group">
                <input
                  type="text"
                  id="goalId"
                  value={goalId}
                  onChange={handleGoalIdChange}
                  placeholder="목표 ID 검색..."
                  className="search-input"
                />
                <button type="submit" className="search-icon-button" disabled={loading}>
                  {loading ? 
                    <span className="loading-spinner-small"></span> : 
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  }
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
                    <th>참여 ID</th>
                    <th>멘티</th>
                    <th>멘토</th>
                    <th>목표 제목</th>
                    <th>시작일</th>
                    <th>종료일</th>
                    <th>진행 상태</th>
                    <th>오늘 할일</th>
                    <th>전체 진행률</th>
                    <th>액션</th>
                  </tr>
                </thead>
                <tbody>
                  {participations.map(participation => (
                    <tr key={participation.id} className="participation-row">
                      <td>{participation.id}</td>
                      <td>{participation.menteeName}</td>
                      <td>{participation.mentorName}</td>
                      <td>{participation.title}</td>
                      <td>{participation.startDate}</td>
                      <td>{participation.endDate}</td>
                      <td>
                        <span className={`status-badge ${getStatusClass(participation.participationStatus)}`}>
                          {getStatusText(participation.participationStatus)}
                        </span>
                      </td>
                      <td>
                        <div className="todo-progress">
                          <span className="todo-completed">{participation.todayCompletedCount}</span>
                          <span className="todo-separator">/</span>
                          <span className="todo-total">{participation.todayTodoCount}</span>
                        </div>
                      </td>
                      <td>
                        <div className="progress-bar-container">
                          <div 
                            className="progress-bar" 
                            style={{
                              width: `${participation.totalTodoCount > 0 
                                ? (participation.totalCompletedCount / participation.totalTodoCount) * 100 
                                : 0}%`
                            }}
                          ></div>
                          <span className="progress-text">
                            {participation.totalTodoCount > 0 
                              ? Math.round((participation.totalCompletedCount / participation.totalTodoCount) * 100) 
                              : 0}%
                          </span>
                        </div>
                      </td>
                      <td>
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
                  <svg className="no-data-icon" viewBox="0 0 24 24" width="48" height="48">
                    <path fill="currentColor" d="M20 6H4V4H20V6ZM21 12V14H3V12H21ZM17 19H7V17H17V19Z"/>
                  </svg>
                  <h3>참여 정보를 찾을 수 없습니다</h3>
                  <p>해당 목표에 대한 참여 정보가 없습니다.</p>
                  <button className="back-to-list-button" onClick={goToGoalList}>
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