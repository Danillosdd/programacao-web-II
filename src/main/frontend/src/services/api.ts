import axios from "axios";
import { obterToken, sair } from "./auth";

const api = axios.create({
  baseURL: "http://localhost:8090/api",
});

api.interceptors.request.use((config) => {
  const token = obterToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (resposta) => resposta,
  (erro) => {
    const url: string = erro?.config?.url ?? "";
    // 401 em /login é credencial errada, não sessão expirada.
    if (erro?.response?.status === 401 && !url.includes("/login")) {
      sair();
      window.location.href = "/login";
    }
    return Promise.reject(erro);
  }
);

export default api;
