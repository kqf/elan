export default function tokenHeader() {
  if (localStorage.getItem("accessToken") === null) return null;

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };
}
