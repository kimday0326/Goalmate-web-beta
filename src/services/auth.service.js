import apiClient from './api.service';
import { API_ENDPOINTS } from '../config/api.config';

export const login = async (credentials, isAdmin) => {
  const endpoint = isAdmin ? API_ENDPOINTS.LOGIN.ADMIN : API_ENDPOINTS.LOGIN.MENTOR;
  
  try {
    const response = await apiClient.post(endpoint, {
      id: credentials.username,
      password: credentials.password
    });
    
    if (response.data?.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      localStorage.setItem('isAdmin', isAdmin);
    }
    
    return response;
  } catch (error) {
    throw error;
  }
}; 

// 로그아웃
export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

// 토큰 갱신
export const refreshToken = async () => {
  const refresh_token = localStorage.getItem('refresh_token');
  // refresh_token을 사용해 새로운 access_token 발급 요청
};

// 현재 로그인 상태 확인
export const isAuthenticated = () => {
  return !!localStorage.getItem('access_token');
};