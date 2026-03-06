import axios from 'axios'
import { HOST } from '../components/api_config'
import * as mockData from '../mocks'

// Check if mock mode is enabled
const USE_MOCK = process.env.REACT_APP_USE_MOCK === 'true'

/**
 * Helper to build image URL
 * Auto-detects full URL vs local path
 */
export const getImageUrl = (path, folder = 'lesson') => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${HOST}/images/${folder}/${path}`
}

/**
 * API wrapper that switches between mock data and real API calls
 * based on REACT_APP_USE_MOCK environment variable
 */

// Lesson API
export const getLessonList = async () => {
  if (USE_MOCK) {
    return mockData.lessonListData
  }
  const res = await axios.get(`${HOST}/lesson/lessonList`)
  return res.data
}

export const getLessonDetail = async (sid) => {
  if (USE_MOCK) {
    const lesson = mockData.lessonListData.find((l) => l.sid === Number(sid))
    return {
      rows: lesson ? [lesson] : [],
      teachers: [],
      comments: [],
      bookmark_member_sid: [],
      limit: [],
    }
  }
  const res = await axios.get(`${HOST}/lesson/${sid}`)
  return res.data
}
// Add more API functions as needed:
// export const getProductList = async () => { ... }
// export const getMemberData = async () => { ... }
