export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

export const formatTimeLeft = (dueDateString: string, dueTimeString: string) => {
  const dueDateTime = new Date(`${dueDateString}T${dueTimeString}`);
  const now = new Date();
  const timeDiff = dueDateTime.getTime() - now.getTime();

  if (isNaN(dueDateTime.getTime())) {
    return '';
  }

  const hours = String(dueDateTime.getHours()).padStart(2, '0');
  const minutes = String(dueDateTime.getMinutes()).padStart(2, '0');

  if (timeDiff <= 24 * 60 * 60 * 1000 && timeDiff > 0) {
    return `${formatDate(dueDateString)} ${hours}:${minutes}`;
  }

  return `${formatDate(dueDateString)} ${hours}:${minutes}`;
};

// 생성 기한 초 제거
export const formatCreatedAt = (createdAt: string) => {
  const date = new Date(createdAt);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

export const removeHtmlTags = (content: string) => {
  return content
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();
};

export const removeMarkdownTags = (content: string) => {
  return content
    .replace(/[#*_~`>+\-]/g, '')
    .replace(/\[.*?\]\(.*?\)/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\n/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
};
