// src/pages/LoginPage.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { salvarSessao } from "../services/auth";
import type { Sessao } from "../services/auth";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  async function entrar(e: FormEvent) {
    e.preventDefault();
    setErro("");

    try {
      const resposta = await api.post<Sessao>("/login", { username, senha });
      salvarSessao(resposta.data);
      navigate("/", { replace: true });
    } catch {
      setErro("Usuário ou senha inválidos");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={entrar}
        className="w-full max-w-sm rounded-lg bg-white p-6 shadow"
      >
        <h1 className="mb-4 text-2xl font-bold text-gray-800">Entrar</h1>

        <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="username">
          Usuário
        </label>
        <input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Usuário"
          autoComplete="username"
          className="mb-3 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
        />

        <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="senha">
          Senha
        </label>
        <input
          id="senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Senha"
          autoComplete="current-password"
          className="mb-3 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
        />

        {erro && <p className="mb-3 text-sm text-red-600">{erro}</p>}

        <button className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700">
          Entrar
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
