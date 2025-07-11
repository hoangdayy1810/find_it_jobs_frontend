export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng trong JS bắt đầu từ 0
  const year = String(date.getFullYear());
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0"); // Lấy ngày, thêm 0 phía trước nếu < 10
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng tính từ 0 -> +1
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}
