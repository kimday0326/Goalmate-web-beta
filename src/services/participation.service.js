import axios from "axios";

const API_URL = "http://localhost:8080";

/**
 * 특정 날짜의 참여 목표 상세 정보를 가져옵니다.
 * @param {number} goalId - 목표 ID
 * @param {string} date - 조회할 날짜 (YYYY-MM-DD 형식)
 * @returns {Promise<Object>} - 참여 목표 상세 정보
 */
export const getParticipationDetail = async (goalId, date) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.");
  }

  try {
    const response = await axios.get(
      `${API_URL}/mentees/my/goals/${goalId}?date=${date}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.status === "SUCCESS") {
      return response.data.data;
    } else {
      throw new Error(
        response.data.message || "데이터를 불러오는데 실패했습니다."
      );
    }
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
    }
    throw error;
  }
};

/**
 * 날짜 형식을 YYYY-MM-DD 문자열로 변환합니다.
 * @param {Date} date - 변환할 날짜 객체
 * @returns {string} - YYYY-MM-DD 형식의 문자열
 */
export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * YYYY-MM-DD 형식의 문자열을 Date 객체로 변환합니다.
 * @param {string} dateString - YYYY-MM-DD 형식의 날짜 문자열
 * @returns {Date|null} - 변환된 Date 객체 또는 null
 */
export const parseApiDate = (dateString) => {
  if (!dateString) return null;
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};
