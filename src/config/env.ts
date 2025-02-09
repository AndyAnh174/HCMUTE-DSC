export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5051',
  uploadUrl: import.meta.env.VITE_UPLOAD_URL || 'http://localhost:5051/static',
  defaultAvatar: import.meta.env.VITE_DEFAULT_AVATAR || '/static/images/members/default-avatar.png',
}; 
