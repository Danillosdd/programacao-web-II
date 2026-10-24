import { Link } from "react-router-dom";
import type { Usuario } from "../types/Usuario";
import Botao from "./Botao";

interface UsuarioItemProps {
  usuario: Usuario;
  onEdit: (usuario: Usuario) => void;
  onDelete: (id: number) => void;
}

function UsuarioItem({ usuario, onEdit, onDelete }: UsuarioItemProps) {
  return (
    <li className="flex items-center justify-between p-4">
      <div>
        <Link
          to={`/usuarios/${usuario.id}`}
          className="font-medium text-blue-600 hover:underline"
        >
          {usuario.nome}{" "}
          <span className="text-gray-500">({usuario.username})</span>
        </Link>
        <p className="text-sm text-gray-500">{usuario.email}</p>
      </div>
      <div className="flex gap-2">
        <Botao variante="neutro" onClick={() => onEdit(usuario)}>
          Editar
        </Botao>
        <Botao variante="perigo" onClick={() => onDelete(usuario.id)}>
          Excluir
        </Botao>
      </div>
    </li>
  );
}

export default UsuarioItem;