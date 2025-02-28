import { API_BASE_URL } from "../config/api.config";

// 이미지 업로드 API
export const uploadImages = async (files) => {
  try {
    const formData = new FormData();

    // 여러 파일 추가
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    const response = await fetch(`${API_BASE_URL}/uploads`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: formData,
    });

    return await response.json();
  } catch (error) {
    console.error("이미지 업로드 오류:", error);
    throw error;
  }
};
