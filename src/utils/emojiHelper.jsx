import React from 'react';

/**
 * Lấy URL hình ảnh Facebook Emoji từ CDN cdnjs chính thức của emoji-datasource-facebook
 * @param {string} emoji - Ký tự unicode emoji gốc
 */
export function getFacebookEmojiUrl(emoji) {
  const codePoints = [...emoji].map(char => char.codePointAt(0).toString(16).toLowerCase());
  
  // Loại bỏ biến thể FE0F nếu nó đứng một mình hoặc không cần thiết để tăng khả năng tương thích với CDN
  let hex = codePoints.join('-');
  
  // CDN URL của emoji-datasource-facebook
  return `https://cdnjs.cloudflare.com/ajax/libs/emoji-datasource-facebook/16.0.0/img/facebook/64/${hex}.png`;
}

/**
 * Component hiển thị Facebook-style Emoji chất lượng cao, có cơ chế fallback về native emoji nếu lỗi tải CDN
 */
export function FacebookEmoji({ emoji, size = 18, inline = true, alt = '' }) {
  const url = getFacebookEmojiUrl(emoji);
  
  const style = {
    width: `${size}px`,
    height: `${size}px`,
    display: inline ? 'inline-block' : 'block',
    verticalAlign: inline ? 'middle' : 'initial',
    margin: inline ? '0 0.15em' : '0',
    objectFit: 'contain',
  };

  return (
    <img
      src={url}
      alt={alt || emoji}
      style={style}
      className="facebook-emoji"
      loading="lazy"
      onError={(e) => {
        // Nếu CDN không tải được (ngoại tuyến hoặc lỗi link), ẩn ảnh đi và chèn native emoji làm fallback
        e.target.style.display = 'none';
        const fallback = document.createElement('span');
        fallback.textContent = emoji;
        fallback.className = 'fallback-emoji';
        fallback.style.fontSize = `${size}px`;
        e.target.parentNode.insertBefore(fallback, e.target);
      }}
    />
  );
}

/**
 * Hàm phân tách chuỗi văn bản chứa cả chữ và emoji thành một mảng các phần tử React
 * Để render emoji dạng hình ảnh Facebook mà không dùng dangerouslySetInnerHTML (an toàn bảo mật XSS)
 * @param {string} text - Đoạn văn bản chứa unicode emojis
 * @param {number} size - Kích thước của emoji hiển thị
 */
export function parseEmojisToReact(text, size = 18) {
  if (!text) return '';
  
  // Regex để nhận diện chuẩn xác các cụm unicode emoji
  const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji_Modifier_Base}|\p{Emoji_Modifier}|[\u2764\u2705\u270A\u270B])\uFE0F?/gu;
  
  const parts = text.split(emojiRegex);
  
  return parts.map((part, index) => {
    if (part.match(emojiRegex)) {
      return (
        <FacebookEmoji
          key={`emoji-${index}`}
          emoji={part}
          size={size}
          inline={true}
        />
      );
    }
    return part;
  });
}
