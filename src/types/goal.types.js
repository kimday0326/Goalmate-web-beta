// 목표 상태 enum
export const GoalStatus = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED'
}

// 목표 타입
export const Goal = {
  id: 0,
  title: '',
  topic: '',
  description: '',
  period: 0,
  daily_duration: 0,
  participants_limit: 0,
  current_participants: 0,
  is_closing_soon: false,
  goal_status: GoalStatus.OPEN,
  mentor_name: '',
  created_at: '',
  updated_at: '',
  main_image: null
}

// 페이지네이션 정보
export const PageInfo = {
  totalElements: 0,
  totalPages: 0,
  currentPage: 0,
  pageSize: 0,
  nextPage: null,
  prevPage: null,
  hasNext: false,
  hasPrev: false
} 