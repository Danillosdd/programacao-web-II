import type { Usuario } from "../types/Usuario";
interface UsuarioItemProps {
    usuario: Usuario;
    onEdit: (usuario: Usuario) => void;
    onDelete: (id: number) => void;
}
function UsuarioItem({ usuario, onEdit, onDelete }: UsuarioItemProps) {
    return (
        <li>
            <div className="item-info">
                <span className="item-title"><strong>Nome:</strong> {usuario.nome}</span>
                <span className="item-subtitle"><strong>Username:</strong> {usuario.username}</span>
                <span className="item-subtitle"><strong>E-mail:</strong> {usuario.email}</span>
            </div>
            <div className="item-actions">
                <button className="btn-edit" onClick={() => onEdit(usuario)}>Editar</button>
                <button className="btn-delete" onClick={() => onDelete(usuario.id)}>Excluir</button>
            </div>
        </li>
    );
}
export default UsuarioItem;