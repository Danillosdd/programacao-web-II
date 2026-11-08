package br.ueg.trindade.braullyweb2fullstack.service;

import br.ueg.trindade.braullyweb2fullstack.model.Categoria;
import br.ueg.trindade.braullyweb2fullstack.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<Categoria> listarTodos() {
        return categoriaRepository.findAll();
    }

    public Categoria buscarPorId(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada com o id: " + id));
    }

    public Categoria criar(Categoria categoria) {
        if (categoria.getNome() == null || categoria.getNome().trim().isEmpty()) {
            throw new RuntimeException("O nome da categoria não pode ser vazio.");
        }
        if (categoriaRepository.existsByNomeIgnoreCase(categoria.getNome().trim())) {
            throw new RuntimeException("Já existe uma categoria cadastrada com o nome: " + categoria.getNome());
        }
        categoria.setNome(categoria.getNome().trim());
        return categoriaRepository.save(categoria);
    }

    public Categoria atualizar(Long id, Categoria atualizada) {
        Categoria categoria = buscarPorId(id);
        if (atualizada.getNome() == null || atualizada.getNome().trim().isEmpty()) {
            throw new RuntimeException("O nome da categoria não pode ser vazio.");
        }
        String novoNome = atualizada.getNome().trim();
        if (!categoria.getNome().equalsIgnoreCase(novoNome) && categoriaRepository.existsByNomeIgnoreCase(novoNome)) {
            throw new RuntimeException("Já existe outra categoria com o nome: " + novoNome);
        }
        categoria.setNome(novoNome);
        categoria.setDescricao(atualizada.getDescricao());
        return categoriaRepository.save(categoria);
    }

    public void excluir(Long id) {
        Categoria categoria = buscarPorId(id);
        if (categoria.getProdutos() != null && !categoria.getProdutos().isEmpty()) {
            throw new RuntimeException("Não é possível excluir a categoria pois existem "
                    + categoria.getProdutos().size() + " produto(s) vinculado(s) a ela.");
        }
        categoriaRepository.deleteById(id);
    }
}
