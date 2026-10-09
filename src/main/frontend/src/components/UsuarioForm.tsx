import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import api from "../services/api";
import type { Usuario } from "../types/Usuario";

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
    } catch (error) {
      alert("Erro ao salvar usuário.");
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Nome"
        required
      />
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="E-mail"
        required
      />
      <button type="submit">
        {usuarioEditando ? "Salvar alterações" : "Cadastrar"}
      </button>
      {usuarioEditando && (
        <button type="button" onClick={onUsuarioSalvo} style={{ marginLeft: "5px" }}>
          Cancelar
        </button>
      )}
    </form>
  );
}

export default UsuarioForm;
