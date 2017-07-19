export function getTitle (data) {
  return data.title || `${data.first_name} ${data.last_name}`.trim();
}
