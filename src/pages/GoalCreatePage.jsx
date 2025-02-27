import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/GoalForm.css";
import { createGoal } from "../services/goal.service";

function GoalCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  // 기본 정보 상태
  const [basicInfo, setBasicInfo] = useState({
    title: "",
    topic: "",
    period: 30,
    daily_duration: 60,
    participants_limit: 5,
    description: "",
  });

  // 중간 목표 상태
  const [midObjectives, setMidObjectives] = useState([
    { sequence: 1, description: "" },
  ]);

  // 주간 목표 상태
  const [weeklyObjectives, setWeeklyObjectives] = useState([
    { week_number: 1, description: "" },
  ]);

  // 할 일 목록 상태
  const [todoList, setTodoList] = useState([
    { dayNumber: 1, estimated_minutes: 30, description: "", mentor_tip: "" },
  ]);

  // 이미지 상태
  const [thumbnailImages, setThumbnailImages] = useState([]);
  const [contentImages, setContentImages] = useState([]);

  // 파일 선택을 위한 ref (썸네일)
  const thumbnailInputRef = useRef(null);

  // 기본 정보 변경 핸들러
  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo({
      ...basicInfo,
      [name]:
        name === "period" ||
        name === "daily_duration" ||
        name === "participants_limit"
          ? parseInt(value) || 0
          : value,
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
      { sequence: midObjectives.length + 1, description: "" },
    ]);
  };

  // 중간 목표 삭제 핸들러
  const handleRemoveMidObjective = (index) => {
    if (midObjectives.length > 1) {
      const updated = midObjectives
        .filter((_, i) => i !== index)
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
      { week_number: weeklyObjectives.length + 1, description: "" },
    ]);
  };

  // 주간 목표 삭제 핸들러
  const handleRemoveWeeklyObjective = (index) => {
    if (weeklyObjectives.length > 1) {
      const updated = weeklyObjectives
        .filter((_, i) => i !== index)
        .map((item, i) => ({ ...item, week_number: i + 1 }));
      setWeeklyObjectives(updated);
    }
  };

  // 할 일 변경 핸들러
  const handleTodoChange = (index, field, value) => {
    const updated = [...todoList];
    updated[index][field] =
      field === "estimated_minutes" ? parseInt(value) || 0 : value;
    setTodoList(updated);
  };

  // 할 일 추가 핸들러
  const handleAddTodo = () => {
    setTodoList([
      ...todoList,
      {
        dayNumber: todoList.length + 1,
        estimated_minutes: 30,
        description: "",
        mentor_tip: "",
      },
    ]);
  };

  // 할 일 삭제 핸들러
  const handleRemoveTodo = (index) => {
    if (todoList.length > 1) {
      const updated = todoList
        .filter((_, i) => i !== index)
        .map((item, i) => ({ ...item }));
      setTodoList(updated);
    }
  };

  // 썸네일 이미지 파일 선택 후 핸들러
  const handleThumbnailFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newImage = {
        sequence: thumbnailImages.length + 1,
        imageUrl: URL.createObjectURL(file),
        file, // 실제 파일 데이터를 저장할 수 있음
      };
      setThumbnailImages((prev) => [...prev, newImage]);
    }
  };

  // 이미지 추가 버튼 클릭 시 파일 선택 다이얼로그 트리거
  const handleAddThumbnailImage = () => {
    thumbnailInputRef.current?.click();
  };

  // 콘텐츠 이미지 추가 핸들러 (필요시 동일하게 파일 입력 구현 가능)
  const handleAddContentImage = () => {
    setContentImages([
      ...contentImages,
      { sequence: contentImages.length + 1, imageUrl: "" },
    ]);
  };

  // 썸네일 이미지 삭제 핸들러
  const handleRemoveThumbnailImage = (index) => {
    const updated = thumbnailImages
      .filter((_, i) => i !== index)
      .map((item, i) => ({ ...item, sequence: i + 1 }));
    setThumbnailImages(updated);
  };

  // 콘텐츠 이미지 삭제 핸들러
  const handleRemoveContentImage = (index) => {
    const updated = contentImages
      .filter((_, i) => i !== index)
      .map((item, i) => ({ ...item, sequence: i + 1 }));
    setContentImages(updated);
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const goalData = {
      ...basicInfo,
      mid_objectives: midObjectives,
      weekly_objectives: weeklyObjectives,
      todo_list: todoList,
      thumbnail_images: thumbnailImages,
      content_images: contentImages,
    };

    try {
      // 내가 어드민 계정인지 확인
      const isAdmin = localStorage.getItem("isAdmin") === "true";
      if (isAdmin) {
        // mentor_id 모달 띄워서 입력받기
        const mentorId = prompt("[관리자] 멘토 ID를 입력해주세요.");
        goalData.mentor_id = mentorId;
      }
      const response = await createGoal(goalData);
      console.log("목표를 생성합니다:", goalData);

      alert("목표가 성공적으로 생성되었습니다!");
      navigate("/goals");
    } catch (error) {
      console.error("목표 생성 실패:", error);
      alert("목표 생성에 실패했습니다.");
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
            className={`tab-button ${activeTab === "basic" ? "active" : ""}`}
            onClick={() => handleTabChange("basic")}
            type="button"
          >
            기본 정보
          </button>
          <button
            className={`tab-button ${activeTab === "mid" ? "active" : ""}`}
            onClick={() => handleTabChange("mid")}
            type="button"
          >
            중간 목표
          </button>
          <button
            className={`tab-button ${activeTab === "weekly" ? "active" : ""}`}
            onClick={() => handleTabChange("weekly")}
            type="button"
          >
            주간 목표
          </button>
          <button
            className={`tab-button ${activeTab === "todo" ? "active" : ""}`}
            onClick={() => handleTabChange("todo")}
            type="button"
          >
            할 일
          </button>
          <button
            className={`tab-button ${activeTab === "image" ? "active" : ""}`}
            onClick={() => handleTabChange("image")}
            type="button"
          >
            이미지
          </button>
        </div>

        {/* 기본 정보 탭 */}
        <div className={`tab-content ${activeTab === "basic" ? "active" : ""}`}>
          <h2>기본 정보</h2>
          <div className="form-group">
            <label htmlFor="title" className="required">
              제목
            </label>
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
            <label htmlFor="topic" className="required">
              주제
            </label>
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
            <label htmlFor="period" className="required">
              기간 (일)
            </label>
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
            <label htmlFor="daily_duration" className="required">
              평균 소요시간 (분)
            </label>
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
            <label htmlFor="participants_limit" className="required">
              참가자 제한
            </label>
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
            <label htmlFor="description" className="required">
              설명
            </label>
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
        <div className={`tab-content ${activeTab === "mid" ? "active" : ""}`}>
          <h2>중간 목표</h2>
          {midObjectives.map((item, index) => (
            <div className="repeating-item" key={`mid-${index}`}>
              <div className="item-header">
                <span className="item-title required">
                  중간 목표 {index + 1}
                </span>
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
                  onChange={(e) =>
                    handleMidObjectiveChange(index, e.target.value)
                  }
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
        <div
          className={`tab-content ${activeTab === "weekly" ? "active" : ""}`}
        >
          <h2>주간 목표</h2>
          {weeklyObjectives.map((item, index) => (
            <div className="repeating-item" key={`weekly-${index}`}>
              <div className="item-header">
                <span className="item-title required">{index + 1}주차</span>
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
                  onChange={(e) =>
                    handleWeeklyObjectiveChange(index, e.target.value)
                  }
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
        <div className={`tab-content ${activeTab === "todo" ? "active" : ""}`}>
          <h2>할 일 목록</h2>
          {todoList.map((item, index) => (
            <div className="repeating-item" key={`todo-${index}`}>
              <div className="item-header">
                <span className="item-title"># {index + 1}</span>
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
                <label htmlFor={`todo-day-${index}`} className="required">
                  N일차
                </label>
                <input
                  type="number"
                  id={`todo-day-${index}`}
                  value={item.dayNumber}
                  onChange={(e) =>
                    handleTodoChange(index, "dayNumber", e.target.value)
                  }
                  className="form-control"
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor={`todo-desc-${index}`} className="required">
                  할 일 내용
                </label>
                <textarea
                  id={`todo-desc-${index}`}
                  value={item.description}
                  onChange={(e) =>
                    handleTodoChange(index, "description", e.target.value)
                  }
                  className="form-control"
                  rows="3"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor={`todo-time-${index}`} className="required">
                  예상 소요 시간(분)
                </label>
                <input
                  type="number"
                  id={`todo-time-${index}`}
                  value={item.estimated_minutes}
                  onChange={(e) =>
                    handleTodoChange(index, "estimated_minutes", e.target.value)
                  }
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
                  onChange={(e) =>
                    handleTodoChange(index, "mentor_tip", e.target.value)
                  }
                  className="form-control"
                  rows="2"
                />
              </div>
            </div>
          ))}
          <button type="button" className="add-button" onClick={handleAddTodo}>
            할 일 추가
          </button>
        </div>

        {/* 이미지 탭 */}
        <div className={`tab-content ${activeTab === "image" ? "active" : ""}`}>
          <h2>썸네일 이미지</h2>
          {thumbnailImages.map((item, index) => (
            <div className="image-item" key={`thumbnail-${index}`}>
              <span>이미지 {item.sequence}</span>
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={`썸네일 ${item.sequence}`}
                  style={{ width: "100px", height: "auto", marginLeft: "10px" }}
                />
              )}
              <button
                type="button"
                className="remove-button"
                onClick={() => handleRemoveThumbnailImage(index)}
              >
                삭제
              </button>
            </div>
          ))}
          {/* 숨김 파일 input */}
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={thumbnailInputRef}
            onChange={handleThumbnailFileChange}
          />
          <button
            type="button"
            className="add-button"
            onClick={handleAddThumbnailImage}
          >
            이미지 추가
          </button>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/goals")}
          >
            취소
          </button>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? <span className="loading-spinner-small"></span> : "생성"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default GoalCreatePage;
