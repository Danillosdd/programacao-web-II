import { useEffect, useState } from "react";
import api from "../services/api";
import type { Pedido } from "../types/Pedido";
import PedidoForm from "../components/PedidoForm";
import Botao from "../components/Botao";
import { temPapel } from "../services/auth";

function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [editando, setEditando] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("TODOS");
  const [mostrarForm, setMostrarForm] = useState(false);

  const isAdmin = temPapel("ADMIN");

  function carregarPedidos() {
    setLoading(true);
    setErro("");
    api.get<Pedido[]>("/pedidos")
      .then((res) => {
        setPedidos(res.data);
      })
      .catch((err) => {
        const msg = err?.response?.data?.message || "Erro ao carregar lista de pedidos.";
        setErro(msg);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    carregarPedidos();
  }, []);

  async function excluir(id: number) {
    if (!window.confirm(`Tem certeza que deseja excluir o Pedido #${id}?`)) {
      return;
    }

    try {
      await api.delete(`/pedidos/${id}`);
      carregarPedidos();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Não foi possível excluir o pedido. Pedidos pagos não podem ser removidos.";
      alert(msg);
    }
  }

  async function alterarStatus(id: number, novoStatus: string) {
    try {
      await api.put(`/pedidos/${id}`, { status: novoStatus });
      carregarPedidos();
    } catch {
      alert("Erro ao alterar status do pedido.");
    }
  }

  const pedidosFiltrados = pedidos.filter((p) => {
    if (filtroStatus === "TODOS") return true;
    return p.status === filtroStatus;
  });

  function getBadgeStatus(status: string) {
    switch (status) {
      case "PAGO":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "PENDENTE":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "CANCELADO":
        return "bg-rose-100 text-rose-800 border-rose-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  }

  function formatarData(dataStr?: string) {
    if (!dataStr) return "Data não informada";
    try {
      const d = new Date(dataStr);
      return d.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dataStr;
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pedidos de Venda</h1>
          <p className="text-sm text-gray-500">
            Acompanhe histórico de vendas, valores e status de pagamento.
          </p>
        </div>
        <Botao
          variante="primario"
          onClick={() => {
            setEditando(null);
            setMostrarForm(!mostrarForm);
          }}
        >
          {mostrarForm ? "Ocultar Formulário" : "+ Novo Pedido"}
        </Botao>
      </div>

      {(mostrarForm || editando) && (
        <PedidoForm
          key={editando?.id ?? "novo"}
          pedidoEditando={editando}
          onPedidoSalvo={() => {
            carregarPedidos();
            setEditando(null);
            setMostrarForm(false);
          }}
          onCancelar={() => {
            setEditando(null);
            setMostrarForm(false);
          }}
        />
      )}

      {/* Barra de Filtros */}
      <div className="mb-4 flex gap-2 border-b border-gray-200 pb-2">
        {["TODOS", "PENDENTE", "PAGO", "CANCELADO"].map((status) => (
          <button
            key={status}
            onClick={() => setFiltroStatus(status)}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
              filtroStatus === status
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {loading && <p className="text-gray-500">Carregando pedidos...</p>}
      {erro && <p className="text-red-600">{erro}</p>}

      {!loading && !erro && pedidosFiltrados.length === 0 && (
        <div className="rounded-lg bg-white p-6 text-center text-gray-500 shadow">
          Nenhum pedido encontrado para o filtro selecionado.
        </div>
      )}

      {!loading && !erro && pedidosFiltrados.length > 0 && (
        <div className="space-y-4">
          {pedidosFiltrados.map((pedido) => (
            <div
              key={pedido.id}
              className="rounded-lg bg-white p-5 shadow border border-gray-100"
            >
              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-gray-100 pb-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-gray-800">
                      Pedido #{pedido.id}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${getBadgeStatus(
                        pedido.status
                      )}`}
                    >
                      {pedido.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Realizado em {formatarData(pedido.dataPedido)}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-gray-500 block">Valor Total</span>
                  <span className="text-lg font-extrabold text-emerald-600">
                    R$ {pedido.valorTotal?.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-3">
                <div>
                  <span className="font-semibold text-gray-700">Cliente: </span>
                  <span className="text-gray-600">
                    {pedido.usuario?.nome || "Cliente Padrão"} ({pedido.usuario?.email || "Sem e-mail"})
                  </span>
                </div>
                {pedido.observacoes && (
                  <div>
                    <span className="font-semibold text-gray-700">Observações: </span>
                    <span className="text-gray-600">{pedido.observacoes}</span>
                  </div>
                )}
              </div>

              {/* Itens do Pedido */}
              {pedido.produtos && pedido.produtos.length > 0 && (
                <div className="mb-4 rounded bg-gray-50 p-2.5">
                  <span className="text-xs font-semibold text-gray-500 uppercase block mb-1.5">
                    Itens Inclusos ({pedido.produtos.length}):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {pedido.produtos.map((p, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center rounded-md bg-white px-2 py-1 text-xs border border-gray-200 text-gray-700"
                      >
                        {p.nome} — R$ {p.preco?.toFixed(2).replace(".", ",")}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Ações */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500 mr-1">Mudar Status:</span>
                  {pedido.status !== "PAGO" && (
                    <button
                      onClick={() => alterarStatus(pedido.id, "PAGO")}
                      className="rounded bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                    >
                      Marcar Pago
                    </button>
                  )}
                  {pedido.status !== "CANCELADO" && (
                    <button
                      onClick={() => alterarStatus(pedido.id, "CANCELADO")}
                      className="rounded bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700 hover:bg-rose-100 border border-rose-200"
                    >
                      Cancelar
                    </button>
                  )}
                  {pedido.status !== "PENDENTE" && (
                    <button
                      onClick={() => alterarStatus(pedido.id, "PENDENTE")}
                      className="rounded bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 hover:bg-amber-100 border border-amber-200"
                    >
                      Marcar Pendente
                    </button>
                  )}
                </div>

                <div className="flex gap-2">
                  <Botao variante="neutro" onClick={() => setEditando(pedido)}>
                    Editar
                  </Botao>
                  {isAdmin && (
                    <Botao variante="perigo" onClick={() => excluir(pedido.id)}>
                      Excluir
                    </Botao>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PedidosPage;
