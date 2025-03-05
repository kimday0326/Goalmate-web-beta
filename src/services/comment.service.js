import { API_BASE_URL } from "../config/api.config";

// 코멘트 방 목록 조회
export const getCommentRooms = async (participationId, page, size = 10) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/v2/participations/${participationId}/comment-rooms?page=${page}&size=${size}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    return await response.json();
  } catch (error) {
    console.error("코멘트 방 목록 조회 오류:", error);
    throw error;
  }
};

// 코멘트 목록 조회
export const getComments = async (commentRoomId, page, size = 20) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/comment-rooms/${commentRoomId}/comments?page=${page}&size=${size}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    return await response.json();
  } catch (error) {
    console.error("코멘트 목록 조회 오류:", error);
    throw error;
  }
};

// 코멘트 작성
export const createComment = async (commentRoomId, comment) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/comment-rooms/${commentRoomId}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({ comment }),
      }
    );

    return await response.json();
  } catch (error) {
    console.error("코멘트 작성 오류:", error);
    throw error;
  }
};
