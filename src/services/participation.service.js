import { API_BASE_URL } from "../config/api.config";

export const getParticipations = async (goalId, page = 1, size = 10) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v2/admin/goals/${goalId}/participations?page=${page}&size=${size}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    const data = await response.json();

    if (data.status === "SUCCESS") {
      return {
        participations: data.data.content || [],
        pageInfo: {
          totalPages: data.data.totalPages,
          currentPage: data.data.currentPage,
          hasNext: data.data.hasNext,
          hasPrev: data.data.hasPrev,
          nextPage: data.data.nextPage,
          prevPage: data.data.prevPage,
        },
      };
    } else {
      throw new Error(data.message || "참여 목록을 불러오는데 실패했습니다.");
    }
  } catch (error) {
    throw new Error("참여 목록을 불러오는데 실패했습니다.");
  }
};
