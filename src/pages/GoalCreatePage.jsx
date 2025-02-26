import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/GoalForm.css';

function GoalCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  
  // 기본 정보 상태
  const [basicInfo, setBasicInfo] = useState({
    title: '',
    topic: '',
    period: 30,
    daily_duration: 60,
    participants_limit: 5,
    description: ''
  });
  
  // 중간 목표 상태
  const [midObjectives, setMidObjectives] = useState([
    { sequence: 1, description: '' }
  ]);
  
  // 주간 목표 상태
  const [weeklyObjectives, setWeeklyObjectives] = useState([
    { week_number: 1, description: '' }
  ]);
  
  // 할 일 목록 상태
  const [todoList, setTodoList] = useState([
    { dayNumber: 1, estimated_minutes: 30, description: '', mentor_tip: '' }
  ]);
  
  // 폼 유효성 상태를 관리할 state 추가
  const [isFormValid, setIsFormValid] = useState(false);
  
  // 기본 정보 변경 핸들러
  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo({
      ...basicInfo,
      [name]: name === 'period' || name === 'daily_duration' || name === 'participants_limit' 
        ? parseInt(value) || 0 
        : value
    });
  };
  
  // 중간 목표 변경 핸들러
  const handleMidObjectiveChange = (index, value) => {
    const updated = [...midObjectives];
    updated[index].description = value;
    setMidObjectives(updated);
  };
  
  // 중간 목표 추가 핸들러
  const handleAddMidObjective = () => {
    setMidObjectives([
      ...midObjectives,
      { sequence: midObjectives.length + 1, description: '' }
    ]);
  };
  
  // 중간 목표 삭제 핸들러
  const handleRemoveMidObjective = (index) => {
    if (midObjectives.length > 1) {
      const updated = midObjectives.filter((_, i) => i !== index)
        .map((item, i) => ({ ...item, sequence: i + 1 }));
      setMidObjectives(updated);
    }
  };
  
  // 주간 목표 변경 핸들러
  const handleWeeklyObjectiveChange = (index, value) => {
    const updated = [...weeklyObjectives];
    updated[index].description = value;
    setWeeklyObjectives(updated);
  };
  
  // 주간 목표 추가 핸들러
  const handleAddWeeklyObjective = () => {
    setWeeklyObjectives([
      ...weeklyObjectives,
      { week_number: weeklyObjectives.length + 1, description: '' }
    ]);
  };
  
  // 주간 목표 삭제 핸들러
  const handleRemoveWeeklyObjective = (index) => {
    if (weeklyObjectives.length > 1) {
      const updated = weeklyObjectives.filter((_, i) => i !== index)
        .map((item, i) => ({ ...item, week_number: i + 1 }));
      setWeeklyObjectives(updated);
    }
  };
  
  // 할 일 변경 핸들러
  const handleTodoChange = (index, field, value) => {
    const updated = [...todoList];
    updated[index][field] = field === 'estimated_minutes' ? parseInt(value) || 0 : value;
    setTodoList(updated);
  };
  
  // 할 일 추가 핸들러
  const handleAddTodo = () => {
    setTodoList([
      ...todoList,
      { dayNumber: todoList.length + 1, estimated_minutes: 30, description: '', mentor_tip: '' }
    ]);
  };
  
  // 할 일 삭제 핸들러
  const handleRemoveTodo = (index) => {
    if (todoList.length > 1) {
      const updated = todoList.filter((_, i) => i !== index)
        .map((item, i) => ({ ...item, dayNumber: i + 1 }));
      setTodoList(updated);
    }
  };
  
  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid) {
      alert('모든 필수 정보를 입력해주세요');
      return;
    }
    
    setLoading(true);
    
    const goalData = {
      ...basicInfo,
      midObjectives,
      weeklyObjectives,
      todoList
    };
    
    try {
      // API 호출
      // const response = await createGoal(goalData);
      console.log('목표를 생성합니다:', goalData);
      
      alert('목표가 성공적으로 생성되었습니다!');
      navigate('/goals');
    } catch (error) {
      console.error('목표 생성 실패:', error);
      alert('목표 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  // 탭 전환 핸들러
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };
  
  return (
    <div className="goal-create-container">
      <h1>목표 생성</h1>
      
      <form onSubmit={handleSubmit} className="goal-form">
        <div className="form-tabs">
          <button 
            className={`tab-button ${activeTab === 'basic' ? 'active' : ''}`}
            onClick={() => handleTabChange('basic')}
            type="button"
          >
            기본 정보
          </button>
          <button 
            className={`tab-button ${activeTab === 'mid' ? 'active' : ''}`}
            onClick={() => handleTabChange('mid')}
            type="button"
          >
            중간 목표
          </button>
          <button 
            className={`tab-button ${activeTab === 'weekly' ? 'active' : ''}`}
            onClick={() => handleTabChange('weekly')}
            type="button"
          >
            주간 목표
          </button>
          <button 
            className={`tab-button ${activeTab === 'todo' ? 'active' : ''}`}
            onClick={() => handleTabChange('todo')}
            type="button"
          >
            할 일
          </button>
        </div>
        
        {/* 기본 정보 탭 */}
        <div className={`tab-content ${activeTab === 'basic' ? 'active' : ''}`}>
          <h2>기본 정보</h2>
          <div className="form-group">
            <label htmlFor="title">제목</label>
            <input
              type="text"
              id="title"
              name="title"
              value={basicInfo.title}
              onChange={handleBasicInfoChange}
              required
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="topic">주제</label>
            <input
              type="text"
              id="topic"
              name="topic"
              value={basicInfo.topic}
              onChange={handleBasicInfoChange}
              required
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="period">기간 (일)</label>
            <input
              type="number"
              id="period"
              name="period"
              value={basicInfo.period}
              onChange={handleBasicInfoChange}
              min="1"
              max="90"
              required
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="daily_duration">하루 목표 시간 (분)</label>
            <input
              type="number"
              id="daily_duration"
              name="daily_duration"
              value={basicInfo.daily_duration}
              onChange={handleBasicInfoChange}
              min="10"
              max="300"
              required
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="participants_limit">참가자 제한</label>
            <input
              type="number"
              id="participants_limit"
              name="participants_limit"
              value={basicInfo.participants_limit}
              onChange={handleBasicInfoChange}
              min="1"
              max="20"
              required
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">설명</label>
            <textarea
              id="description"
              name="description"
              value={basicInfo.description}
              onChange={handleBasicInfoChange}
              rows="4"
              required
              className="form-control"
            />
          </div>
        </div>
        
        {/* 중간 목표 탭 */}
        <div className={`tab-content ${activeTab === 'mid' ? 'active' : ''}`}>
          <h2>중간 목표</h2>
          {midObjectives.map((item, index) => (
            <div className="repeating-item" key={`mid-${index}`}>
              <div className="item-header">
                <span className="item-title">중간 목표 {index + 1}</span>
                <button 
                  type="button" 
                  className="remove-button"
                  onClick={() => handleRemoveMidObjective(index)}
                  disabled={midObjectives.length <= 1}
                >
                  삭제
                </button>
              </div>
              <div className="form-group">
                <label htmlFor={`mid-obj-${index}`}>목표 내용</label>
                <textarea
                  id={`mid-obj-${index}`}
                  value={item.description}
                  onChange={(e) => handleMidObjectiveChange(index, e.target.value)}
                  className="form-control"
                  rows="3"
                  required
                />
              </div>
            </div>
          ))}
          <button 
            type="button" 
            className="add-button"
            onClick={handleAddMidObjective}
          >
            중간 목표 추가
          </button>
        </div>
        
        {/* 주간 목표 탭 */}
        <div className={`tab-content ${activeTab === 'weekly' ? 'active' : ''}`}>
          <h2>주간 목표</h2>
          {weeklyObjectives.map((item, index) => (
            <div className="repeating-item" key={`weekly-${index}`}>
              <div className="item-header">
                <span className="item-title">주 {index + 1}</span>
                <button 
                  type="button" 
                  className="remove-button"
                  onClick={() => handleRemoveWeeklyObjective(index)}
                  disabled={weeklyObjectives.length <= 1}
                >
                  삭제
                </button>
              </div>
              <div className="form-group">
                <label htmlFor={`weekly-obj-${index}`}>목표 내용</label>
                <textarea
                  id={`weekly-obj-${index}`}
                  value={item.description}
                  onChange={(e) => handleWeeklyObjectiveChange(index, e.target.value)}
                  className="form-control"
                  rows="3"
                  required
                />
              </div>
            </div>
          ))}
          <button 
            type="button" 
            className="add-button"
            onClick={handleAddWeeklyObjective}
          >
            주간 목표 추가
          </button>
        </div>
        
        {/* 할 일 탭 */}
        <div className={`tab-content ${activeTab === 'todo' ? 'active' : ''}`}>
          <h2>할 일 목록</h2>
          {todoList.map((item, index) => (
            <div className="repeating-item" key={`todo-${index}`}>
              <div className="item-header">
                <span className="item-title">Day {index + 1}</span>
                <button 
                  type="button" 
                  className="remove-button"
                  onClick={() => handleRemoveTodo(index)}
                  disabled={todoList.length <= 1}
                >
                  삭제
                </button>
              </div>
              <div className="form-group">
                <label htmlFor={`todo-desc-${index}`}>할 일 내용</label>
                <textarea
                  id={`todo-desc-${index}`}
                  value={item.description}
                  onChange={(e) => handleTodoChange(index, 'description', e.target.value)}
                  className="form-control"
                  rows="3"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor={`todo-time-${index}`}>예상 소요 시간(분)</label>
                <input
                  type="number"
                  id={`todo-time-${index}`}
                  value={item.estimated_minutes}
                  onChange={(e) => handleTodoChange(index, 'estimated_minutes', e.target.value)}
                  className="form-control"
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor={`todo-tip-${index}`}>멘토 팁(선택)</label>
                <textarea
                  id={`todo-tip-${index}`}
                  value={item.mentor_tip}
                  onChange={(e) => handleTodoChange(index, 'mentor_tip', e.target.value)}
                  className="form-control"
                  rows="2"
                />
              </div>
            </div>
          ))}
          <button 
            type="button" 
            className="add-button"
            onClick={handleAddTodo}
          >
            할 일 추가
          </button>
        </div>
        
        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={() => navigate('/goals')}>취소</button>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? <span className="loading-spinner-small"></span> : "생성"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default GoalCreatePage; 
