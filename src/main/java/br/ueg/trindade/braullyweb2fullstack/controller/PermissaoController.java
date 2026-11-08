package br.ueg.trindade.braullyweb2fullstack.controller;

import br.ueg.trindade.braullyweb2fullstack.model.Permissao;
import br.ueg.trindade.braullyweb2fullstack.service.PermissaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
public class PermissaoController {

    @Autowired
    private PermissaoService permissaoService;

    @GetMapping("/permissoes")
    public List<Permissao> getAllPermissoes() {
        return permissaoService.listarTodos();
    }

    @PostMapping("/permissoes")
    @PreAuthorize("hasRole('ADMIN')")
    public Permissao createPermissao(@RequestBody Permissao permissao) {
        return permissaoService.criar(permissao);
    }

    @GetMapping("/permissoes/{id}")
    public Permissao getPermissaoById(@PathVariable Long id) {
        return permissaoService.buscarPorId(id);
    }

    @PutMapping("/permissoes/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Permissao updatePermissao(@PathVariable Long id, @RequestBody Permissao permissaoAtualizada) {
        return permissaoService.atualizar(id, permissaoAtualizada);
    }

    @DeleteMapping("/permissoes/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deletePermissao(@PathVariable Long id) {
        permissaoService.excluir(id);
    }
}
