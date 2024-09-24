import api from "@/api/http-common";

export function getAllAtendimentos(page: number, size: number) {
  return api.get(`/appointments?page=${page}&size=${size}`);
}
