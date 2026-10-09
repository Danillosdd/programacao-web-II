package br.ueg.trindade.braullyweb2fullstack.service;

import br.ueg.trindade.braullyweb2fullstack.model.Produto;
import br.ueg.trindade.braullyweb2fullstack.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    public List<Produto> listarTodos() {
        return produtoRepository.findAll();
    }

    public Produto buscarPorId(Long id) {
        return produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
    }

    public Produto criar(Produto produto) {
        validarProduto(produto);
        return produtoRepository.save(produto);
    }

    public Produto atualizar(Long id, Produto produtoAtualizado) {
        validarProduto(produtoAtualizado);
        Produto produto = buscarPorId(id);
        produto.setNome(produtoAtualizado.getNome());
        produto.setPreco(produtoAtualizado.getPreco());
        return produtoRepository.save(produto);
    }

    public void excluir(Long id) {
        produtoRepository.deleteById(id);
    }

    private void validarProduto(Produto produto) {
        if (produto.getPreco() == null || produto.getPreco() <= 0) {
            throw new RuntimeException("Regra de Negócio: O preço do produto deve ser maior que zero.");
        }
        if (produto.getNome() == null || produto.getNome().trim().isEmpty()) {
            throw new RuntimeException("Regra de Negócio: O nome do produto não pode ser vazio.");
        }
    }
}
