package br.ueg.trindade.braullyweb2fullstack.service;

import br.ueg.trindade.braullyweb2fullstack.model.Pedido;
import br.ueg.trindade.braullyweb2fullstack.model.Produto;
import br.ueg.trindade.braullyweb2fullstack.model.Usuario;
import br.ueg.trindade.braullyweb2fullstack.repository.PedidoRepository;
import br.ueg.trindade.braullyweb2fullstack.repository.ProdutoRepository;
import br.ueg.trindade.braullyweb2fullstack.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    public List<Pedido> listarTodos() {
        return pedidoRepository.findAll();
    }

    public Pedido buscarPorId(Long id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado com o id: " + id));
    }

    public List<Pedido> listarPorUsuario(Long usuarioId) {
        return pedidoRepository.findByUsuarioId(usuarioId);
    }

    public Pedido criar(Pedido pedido) {
        if (pedido.getDataPedido() == null) {
            pedido.setDataPedido(LocalDateTime.now());
        }
        if (pedido.getStatus() == null || pedido.getStatus().isBlank()) {
            pedido.setStatus("PENDENTE");
        }

        // Se produtos foram informados por ID, carregar do banco e calcular valor total se não informado
        if (pedido.getProdutos() != null && !pedido.getProdutos().isEmpty()) {
            List<Produto> produtosCarregados = new ArrayList<>();
            double total = 0.0;
            for (Produto p : pedido.getProdutos()) {
                if (p.getId() != null) {
                    Produto prodBanco = produtoRepository.findById(p.getId())
                            .orElseThrow(() -> new RuntimeException("Produto não encontrado com id: " + p.getId()));
                    produtosCarregados.add(prodBanco);
                    if (prodBanco.getPreco() != null) {
                        total += prodBanco.getPreco();
                    }
                }
            }
            pedido.setProdutos(produtosCarregados);
            if (pedido.getValorTotal() == null || pedido.getValorTotal() <= 0) {
                pedido.setValorTotal(total);
            }
        }

        if (pedido.getValorTotal() == null || pedido.getValorTotal() <= 0) {
            throw new RuntimeException("O valor total do pedido deve ser maior que zero.");
        }

        // Vincular usuário se ID fornecido
        if (pedido.getUsuario() != null && pedido.getUsuario().getId() != null) {
            Usuario usuario = usuarioRepository.findById(pedido.getUsuario().getId())
                    .orElseThrow(() -> new RuntimeException("Usuário informado para o pedido não foi encontrado."));
            pedido.setUsuario(usuario);
        }

        return pedidoRepository.save(pedido);
    }

    public Pedido atualizar(Long id, Pedido atualizado) {
        Pedido pedido = buscarPorId(id);

        if (atualizado.getStatus() != null && !atualizado.getStatus().isBlank()) {
            String status = atualizado.getStatus().toUpperCase();
            if (!List.of("PENDENTE", "PAGO", "CANCELADO").contains(status)) {
                throw new RuntimeException("Status inválido. Use PENDENTE, PAGO ou CANCELADO.");
            }
            pedido.setStatus(status);
        }

        if (atualizado.getObservacoes() != null) {
            pedido.setObservacoes(atualizado.getObservacoes());
        }

        if (atualizado.getValorTotal() != null && atualizado.getValorTotal() > 0) {
            pedido.setValorTotal(atualizado.getValorTotal());
        }

        return pedidoRepository.save(pedido);
    }

    public void excluir(Long id) {
        Pedido pedido = buscarPorId(id);
        if ("PAGO".equalsIgnoreCase(pedido.getStatus())) {
            throw new RuntimeException("Não é permitido excluir um pedido com status PAGO. Cancele o pedido em vez disso.");
        }
        pedidoRepository.deleteById(id);
    }
}
