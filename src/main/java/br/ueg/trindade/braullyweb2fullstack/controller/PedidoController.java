package br.ueg.trindade.braullyweb2fullstack.controller;

import br.ueg.trindade.braullyweb2fullstack.model.Pedido;
import br.ueg.trindade.braullyweb2fullstack.service.PedidoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @GetMapping("/pedidos")
    public List<Pedido> getAllPedidos(@RequestParam(required = false) Long usuarioId) {
        if (usuarioId != null) {
            return pedidoService.listarPorUsuario(usuarioId);
        }
        return pedidoService.listarTodos();
    }

    @GetMapping("/pedidos/{id}")
    public Pedido getPedidoById(@PathVariable Long id) {
        return pedidoService.buscarPorId(id);
    }

    @PostMapping("/pedidos")
    public Pedido createPedido(@Valid @RequestBody Pedido pedido) {
        return pedidoService.criar(pedido);
    }

    @PutMapping("/pedidos/{id}")
    public Pedido updatePedido(@PathVariable Long id, @RequestBody Pedido pedidoAtualizado) {
        return pedidoService.atualizar(id, pedidoAtualizado);
    }

    @DeleteMapping("/pedidos/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deletePedido(@PathVariable Long id) {
        pedidoService.excluir(id);
    }
}
