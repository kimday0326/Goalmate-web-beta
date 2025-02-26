import axios from 'axios';
import { API_BASE_URL } from '../config/api.config';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;

// 파일 업로드 함수 추가
export const uploadFile = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await fetch('http://localhost:8080/api/v2/admin/uploads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
      body: formData,
      // XMLHttpRequest를 사용하여 진행률 트래킹
      xhr: () => {
        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable && onProgress) {
            const percentCompleted = Math.round((event.loaded * 100) / event.total);
            onProgress(percentCompleted);
          }
        });
        return xhr;
      }
    });
    
    const data = await response.json();
    
    if (data.status === 'SUCCESS') {
      return {
        success: true,
        imageUrl: data.data.imageUrl,
        message: '이미지 업로드 성공'
      };
    } else {
      return {
        success: false,
        message: data.message || '이미지 업로드 실패'
      };
    }
  } catch (error) {
    console.error('이미지 업로드 오류:', error);
    return {
      success: false,
      message: '이미지 업로드 중 오류가 발생했습니다.'
    };
  }
}; 