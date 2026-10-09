import { useEffect, useState } from "react";
import api from "../services/api";
import type { Usuario } from "../types/Usuario";
import UsuarioItem from "../components/UsuarioItem";
import UsuarioForm from "../components/UsuarioForm";

function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [editando, setEditando] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  function carregarUsuarios() {
    setLoading(true);
    setErro("");
    api.get<Usuario[]>("/usuarios")
      .then((resposta) => {
        setUsuarios(resposta.data);
      })
      .catch(() => {
        setErro("Erro ao carregar usuários. O backend está rodando?");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    carregarUsuarios();
  }, []);

  async function excluir(id: number) {
    if (window.confirm("Tem certeza que deseja excluir?")) {
      try {
        await api.delete(`/usuarios/${id}`);
        carregarUsuarios();
      } catch (error) {
        alert("Erro ao excluir usuário.");
      }
    }
  }

  return (
    <div>
      <h2>Usuários</h2>
      
      <UsuarioForm
        key={editando?.id ?? "novo"}
        usuarioEditando={editando}
        onUsuarioSalvo={() => {
          carregarUsuarios();
          setEditando(null);
        }}
      />

      {loading && <p>Carregando usuários...</p>}
      {erro && <p style={{ color: "red" }}>{erro}</p>}

      {!loading && !erro && (
        <ul>
          {usuarios.map((usuario) => (
            <UsuarioItem 
              key={usuario.id} 
              usuario={usuario} 
              onEdit={setEditando} 
              onDelete={excluir} 
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default UsuariosPage;