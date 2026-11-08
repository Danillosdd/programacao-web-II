// src/services/auth.ts
const TOKEN = "token";
const USUARIO = "usuario";

export interface Sessao {
  token: string;
  nome: string;
  permissoes: string[];
}

export function salvarSessao(sessao: Sessao) {
  localStorage.setItem(TOKEN, sessao.token);
  localStorage.setItem(USUARIO, JSON.stringify(sessao));
}

export function obterToken(): string | null {
  return localStorage.getItem(TOKEN);
}

export function obterSessao(): Sessao | null {
  const usuario = localStorage.getItem(USUARIO);
  if (!usuario) return null;

  try {
    return JSON.parse(usuario) as Sessao;
  } catch {
    return null;
  }
}

export function temPapel(papel: string): boolean {
  const sessao = obterSessao();
  return sessao ? sessao.permissoes.includes(papel) : false;
}

export function sair() {
  localStorage.removeItem(TOKEN);
  localStorage.removeItem(USUARIO);
}
