export interface FaceSimilarityResponse {
  // 常见返回字段（根据后端约定可调整）
  similarity?: number
  score?: number
  passed?: boolean
  code?: number | string
  message?: string
  data?: any
  [key: string]: any
}

export interface FaceSimilarityPayload {
  image1: string // 图片1的 base64 字符串
  image2: string // 图片2的 base64 字符串
}