import api from "../API/api";

export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

export const setToken = (token: string): void => {
  localStorage.setItem("token", token);
}

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const logout = (): void => {
  localStorage.removeItem("token");
};

export const login = async (username: string, password: string) => {
  const formData = new FormData();

  formData.append('username', username);
  formData.append('password', password);

  const response = await api.post(`/auth/login/`, formData);

  return response.data;
}