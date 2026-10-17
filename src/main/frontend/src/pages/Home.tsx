import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h2>Bem-vindo ao sistema!</h2>
      <p style={{ marginBottom: "20px" }}>
        Navegue entre os módulos do sistema utilizando o menu superior ou os links rápidos abaixo:
      </p>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <Link to="/usuarios">
          <button type="button">Ir para Usuários</button>
        </Link>
        <Link to="/permissoes">
          <button type="button">Ir para Permissões</button>
        </Link>
        <Link to="/atribuir-permissoes">
          <button type="button">Atribuir Permissões</button>
        </Link>
        <Link to="/produtos">
          <button type="button">Ir para Produtos</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
