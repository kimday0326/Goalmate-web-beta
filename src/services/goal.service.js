import { API_BASE_URL } from "../config/api.config";

/**
 * 목표 목록을 조회합니다
 * @param {number} page - 페이지 번호 (1부터 시작)
 * @param {number} size - 페이지당 항목 수
 * @returns {Promise<{goals: Array, page: Object}>}
 */
export const getGoals = async (page = 1, size = 10) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/goals?page=${page}&size=${size}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    return await response.json();
  } catch (error) {
    console.error("목표 목록 조회 오류:", error);
    throw error;
  }
};

/**
 * 목표 상세 정보를 조회합니다
 * @param {number} goalId - 목표 ID
 * @returns {Promise<Object>}
 */
export const getGoalDetail = async (goalId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/goals/${goalId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    return await response.json();
  } catch (error) {
    console.error("목표 상세 조회 오류:", error);
    throw error;
  }
};

// 목표 생성 API
export const createGoal = async (goalData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/goals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(goalData),
    });

    return await response.json();
  } catch (error) {
    console.error("목표 생성 오류:", error);
    throw error;
  }
};

// 이미지 업로드 서비스 함수 추가
export const uploadGoalImage = async (file, onProgress) => {
  return await uploadFile(file, onProgress);
};

/**
 * 목표 수정
 * @param {string} goalId - 수정할 목표 ID
 * @param {object} goalData - 수정할 목표 데이터
 * @returns {Promise<object>} - 응답 객체
 */
export const updateGoal = async (goalId, goalData) => {
  try {
    // 여기에 실제 API 호출 코드가 들어갈 예정
    // 현재는 임시로 성공 응답을 반환
    return {
      status: "SUCCESS",
      message: "목표가 성공적으로 수정되었습니다.",
      data: goalData,
    };
  } catch (error) {
    console.error("목표 수정 실패:", error);
    return {
      status: "FAIL",
      message: error.message || "목표 수정에 실패했습니다.",
    };
  }
};
