import { lessonListData, commentData } from '../mocks'

/**
 * Mock route definitions
 * Each route maps a URL path pattern to mock response data.
 *
 * - path: the URL path to match (matched with startsWith)
 * - method: HTTP method ('get', 'post', 'delete')
 * - data: static object OR function(config) => response data
 *
 * Routes are matched top-down, so put more specific paths first.
 */
const mockRoutes = [
  // --- Comment ---
  {
    path: '/comment/api',
    method: 'get',
    data: commentData,
  },

  // --- Lesson ---
  {
    path: '/lesson/lessonList',
    method: 'get',
    data: lessonListData,
  },
  {
    // /lesson/:sid (lesson detail)
    path: '/lesson/',
    method: 'get',
    data: (config) => {
      const parts = config.url.replace(/.*\/lesson\//, '')
      const sid = parseInt(parts, 10)
      const lesson = lessonListData.find((l) => l.sid === sid)
      return {
        rows: lesson ? [lesson] : [],
        teachers: [],
        comments: [],
        bookmark_member_sid: [],
        limit: [],
      }
    },
  },
]

export default mockRoutes
