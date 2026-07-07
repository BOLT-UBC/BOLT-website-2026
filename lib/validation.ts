/**
 * Common validation utilities for API routes
 */

/**
 * Validates if a string is a valid UUID v4 format
 * @param uuid - The string to validate
 * @returns true if valid UUID, false otherwise
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

/**
 * Validates file upload parameters
 * @param file - The file to validate
 * @returns validation result with success status and optional error message
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only PDF and Word documents are allowed' }
  }

  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 5MB' }
  }

  // Check file name
  if (file.name.length > 255) {
    return { valid: false, error: 'File name too long' }
  }

  // Check for suspicious file names
  const suspiciousPatterns = /[<>:"/\\|?*]|\.\.|script|javascript|vbscript/i
  if (suspiciousPatterns.test(file.name)) {
    return { valid: false, error: 'Invalid file name' }
  }

  return { valid: true }
}

/**
 * Simple in-memory rate limiting implementation
 * Note: For production, use Redis or similar persistent storage
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

/**
 * Checks if a request should be rate limited
 * @param identifier - Unique identifier for rate limiting (e.g., IP address)
 * @param limit - Maximum number of requests allowed
 * @param windowMs - Time window in milliseconds
 * @returns true if request is allowed, false if rate limited
 */
export function checkRateLimit(identifier: string, limit: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= limit) {
    return false
  }

  record.count++
  return true
}
