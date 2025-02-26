import apiClient from './api.service'
import { API_ENDPOINTS } from '../config/api.config'
import { uploadFile } from './api.service'

/**
 * 목표 목록을 조회합니다
 * @param {number} page - 페이지 번호 (1부터 시작)
 * @param {number} size - 페이지당 항목 수
 * @returns {Promise<{goals: Array, page: Object}>}
 */
export const getGoals = async (page = 1, size = 10) => {
  try {
    const response = await apiClient.get('/goals', {
      params: { page, size }
    })
    
    return response
  } catch (error) {
    console.error('목표 목록 조회 실패:', error)
    throw error
  }
}

/**
 * 목표 상세 정보를 조회합니다
 * @param {number} goalId - 목표 ID
 * @returns {Promise<Object>}
 */
export const getGoalDetail = async (goalId) => {
  try {
    const response = await apiClient.get(`/goals/${goalId}`)
    return response
  } catch (error) {
    console.error('목표 상세 조회 실패:', error)
    throw error
  }
}

// 이미지 업로드 서비스 함수 추가
export const uploadGoalImage = async (file, onProgress) => {
  return await uploadFile(file, onProgress);
}; 