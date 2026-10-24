import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import api from "../services/api";
import type { Usuario } from "../types/Usuario";
import Botao from "./Botao";

interface UsuarioFormProps {
  onUsuarioSalvo: () => void;
  usuarioEditando?: Usuario | null;
}

function UsuarioForm({ onUsuarioSalvo, usuarioEditando }: UsuarioFormProps) {
  const [nome, setNome] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (usuarioEditando) {
      setNome(usuarioEditando.nome);
      setUsername(usuarioEditando.username);
      setEmail(usuarioEditando.email);
    } else {
      setNome("");
      setUsername("");
      setEmail("");
    }
  }, [usuarioEditando]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const dados = { nome, username, email };

    try {
      if (usuarioEditando) {
        await api.put(`/usuarios/${usuarioEditando.id}`, dados);
      } else {
        await api.post("/usuarios", dados);
      }
      onUsuarioSalvo();
      if (!usuarioEditando) {
        setNome("");
        setUsername("");
        setEmail("");
      }
    } catch {
      alert("Erro ao salvar usuário.");
    }
  }

  const campo =
    "rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none";

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 grid gap-3 rounded-lg bg-white p-4 shadow md:grid-cols-4"
    >
      <input
        className={campo}
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Nome"
        required
      />
      <input
        className={campo}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        className={campo}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="E-mail"
        required
      />
      <div className="flex gap-2">
        <Botao type="submit" className="w-full">
          {usuarioEditando ? "Salvar alterações" : "Cadastrar"}
        </Botao>
        {usuarioEditando && (
          <Botao type="button" variante="neutro" onClick={onUsuarioSalvo}>
            Cancelar
          </Botao>
        )}
      </div>
    </form>
  );
}

export default UsuarioForm;
