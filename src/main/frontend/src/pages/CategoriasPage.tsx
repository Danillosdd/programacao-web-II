import { useEffect, useState } from "react";
import api from "../services/api";
import type { Categoria } from "../types/Categoria";
import CategoriaForm from "../components/CategoriaForm";
import Botao from "../components/Botao";
import { temPapel } from "../services/auth";

function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [editando, setEditando] = useState<Categoria | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const isAdmin = temPapel("ADMIN");

  function carregarCategorias() {
    setLoading(true);
    setErro("");
    api.get<Categoria[]>("/categorias")
      .then((resposta) => {
        setCategorias(resposta.data);
      })
      .catch((err) => {
        const msg = err?.response?.data?.message || "Erro ao carregar categorias.";
        setErro(msg);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    carregarCategorias();
  }, []);

  async function excluir(id: number, nome: string) {
    if (!window.confirm(`Tem certeza que deseja excluir a categoria "${nome}"?`)) {
      return;
    }

    try {
      await api.delete(`/categorias/${id}`);
      carregarCategorias();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Não foi possível excluir esta categoria. Verifique se existem produtos associados.";
      alert(msg);
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categorias</h1>
          <p className="text-sm text-gray-500">
            Gerencie as categorias dos produtos comercializados no sistema.
          </p>
        </div>
      </div>

      {isAdmin && (
        <CategoriaForm
          key={editando?.id ?? "nova"}
          categoriaEditando={editando}
          onCategoriaSalva={() => {
            carregarCategorias();
            setEditando(null);
          }}
          onCancelar={() => setEditando(null)}
        />
      )}

      {loading && <p className="text-gray-500">Carregando categorias...</p>}
      {erro && <p className="text-red-600">{erro}</p>}

      {!loading && !erro && categorias.length === 0 && (
        <div className="rounded-lg bg-white p-6 text-center text-gray-500 shadow">
          Nenhuma categoria cadastrada até o momento.
        </div>
      )}

      {!loading && !erro && categorias.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categorias.map((cat) => (
            <div
              key={cat.id}
              className="rounded-lg bg-white p-5 shadow border border-gray-100 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-lg font-bold text-gray-800">{cat.nome}</h3>
                  <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                    {cat.produtos ? cat.produtos.length : 0} produto(s)
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {cat.descricao || "Sem descrição informada."}
                </p>
              </div>

              {isAdmin && (
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <Botao variante="neutro" onClick={() => setEditando(cat)}>
                    Editar
                  </Botao>
                  <Botao variante="perigo" onClick={() => excluir(cat.id, cat.nome)}>
                    Excluir
                  </Botao>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoriasPage;
