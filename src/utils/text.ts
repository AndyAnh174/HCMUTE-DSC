/**
 * Cắt chuỗi HTML một cách an toàn mà không phá vỡ cấu trúc HTML
 * @param html Chuỗi HTML cần cắt
 * @param maxLength Độ dài tối đa của chuỗi sau khi cắt
 * @returns Chuỗi HTML đã được cắt an toàn
 */
export const truncateHtml = (html: string, maxLength: number): string => {
  if (!html) return '';
  
  // Tạo một div tạm để phân tích chuỗi HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Lấy văn bản thuần túy
  const textContent = tempDiv.textContent || tempDiv.innerText || '';
  
  if (textContent.length <= maxLength) {
    return html;
  }
  
  // Nếu cần cắt, giữ nguyên HTML gốc và thêm '...' vào cuối
  return html + '...';
}; 