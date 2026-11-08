package br.ueg.trindade.braullyweb2fullstack.controller;

import br.ueg.trindade.braullyweb2fullstack.model.Categoria;
import br.ueg.trindade.braullyweb2fullstack.service.CategoriaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
public class CategoriaController {

    @Autowired
    private CategoriaService categoriaService;

    @GetMapping("/categorias")
    public List<Categoria> getAllCategorias() {
        return categoriaService.listarTodos();
    }

    @GetMapping("/categorias/{id}")
    public Categoria getCategoriaById(@PathVariable Long id) {
        return categoriaService.buscarPorId(id);
    }

    @PostMapping("/categorias")
    @PreAuthorize("hasRole('ADMIN')")
    public Categoria createCategoria(@Valid @RequestBody Categoria categoria) {
        return categoriaService.criar(categoria);
    }

    @PutMapping("/categorias/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Categoria updateCategoria(@PathVariable Long id, @Valid @RequestBody Categoria categoriaAtualizada) {
        return categoriaService.atualizar(id, categoriaAtualizada);
    }

    @DeleteMapping("/categorias/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteCategoria(@PathVariable Long id) {
        categoriaService.excluir(id);
    }
}
