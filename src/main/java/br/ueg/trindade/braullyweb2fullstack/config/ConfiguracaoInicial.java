package br.ueg.trindade.braullyweb2fullstack.config;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import br.ueg.trindade.braullyweb2fullstack.model.Categoria;
import br.ueg.trindade.braullyweb2fullstack.model.Pedido;
import br.ueg.trindade.braullyweb2fullstack.model.Permissao;
import br.ueg.trindade.braullyweb2fullstack.model.Produto;
import br.ueg.trindade.braullyweb2fullstack.model.Usuario;
import br.ueg.trindade.braullyweb2fullstack.repository.CategoriaRepository;
import br.ueg.trindade.braullyweb2fullstack.repository.PedidoRepository;
import br.ueg.trindade.braullyweb2fullstack.repository.PermissaoRepository;
import br.ueg.trindade.braullyweb2fullstack.repository.ProdutoRepository;
import br.ueg.trindade.braullyweb2fullstack.repository.UsuarioRepository;

@Configuration
public class ConfiguracaoInicial {

    private static final Pattern HASH_BCRYPT = Pattern.compile("^\\$2[aby]\\$\\d{2}\\$.{53}$");

    @Bean
    CommandLineRunner carregarDados(UsuarioRepository usuarios,
            PermissaoRepository permissoes,
            CategoriaRepository categorias,
            ProdutoRepository produtos,
            PedidoRepository pedidos,
            PasswordEncoder encoder) {
        return args -> {
            Permissao admin = buscarOuCriarPermissao(permissoes, "ADMIN", "Acesso total");
            Permissao user = buscarOuCriarPermissao(permissoes, "USER", "Acesso comum");

            Usuario usuarioAdmin = criarOuAtualizarUsuario(usuarios, encoder, "Admin", "admin", "admin123",
                    "admin@ueg.br", Set.of(admin, user));
            Usuario usuarioJoao = criarOuAtualizarUsuario(usuarios, encoder, "João", "joao", "joao123",
                    "joao@ueg.br", Set.of(user));

            // Senhas gravadas em texto puro por versões anteriores passam a ser hash.
            usuarios.findAll().forEach(usuario -> {
                if (usuario.getSenha() != null && !ehHashBcrypt(usuario.getSenha())) {
                    usuario.setSenha(encoder.encode(usuario.getSenha()));
                    usuarios.save(usuario);
                }
            });

            // Seed de Categorias
            Categoria catInformatica = buscarOuCriarCategoria(categorias, "Informática", "Computadores, notebooks e equipamentos");
            Categoria catPerifericos = buscarOuCriarCategoria(categorias, "Periféricos", "Mouses, teclados e monitores");
            Categoria catEscritorio = buscarOuCriarCategoria(categorias, "Escritório", "Mesas, cadeiras e mobília ergonômica");

            // Seed de Produtos associados a Categorias
            Produto prodNotebook = buscarOuCriarProduto(produtos, "Notebook Dell Inspiron", 4299.90, catInformatica);
            Produto prodMouse = buscarOuCriarProduto(produtos, "Mouse Sem Fio Logitech", 129.50, catPerifericos);
            Produto prodTeclado = buscarOuCriarProduto(produtos, "Teclado Mecânico RGB", 289.00, catPerifericos);
            Produto prodCadeira = buscarOuCriarProduto(produtos, "Cadeira Ergonômica", 850.00, catEscritorio);

            // Seed de Pedidos iniciais
            if (pedidos.count() == 0) {
                Pedido ped1 = new Pedido();
                ped1.setDataPedido(LocalDateTime.now().minusDays(2));
                ped1.setStatus("PAGO");
                ped1.setObservacoes("Entrega expressa solicitada");
                ped1.setUsuario(usuarioJoao);
                ped1.setProdutos(List.of(prodNotebook, prodMouse));
                ped1.setValorTotal(prodNotebook.getPreco() + prodMouse.getPreco());
                pedidos.save(ped1);

                Pedido ped2 = new Pedido();
                ped2.setDataPedido(LocalDateTime.now().minusHours(5));
                ped2.setStatus("PENDENTE");
                ped2.setObservacoes("Aguardando confirmação de pagamento PIX");
                ped2.setUsuario(usuarioAdmin);
                ped2.setProdutos(List.of(prodTeclado, prodCadeira));
                ped2.setValorTotal(prodTeclado.getPreco() + prodCadeira.getPreco());
                pedidos.save(ped2);
            }
        };
    }

    private Permissao buscarOuCriarPermissao(PermissaoRepository permissoes,
            String nome, String descricao) {
        return permissoes.findByNome(nome)
                .orElseGet(() -> permissoes.save(new Permissao(nome, descricao)));
    }

    private Categoria buscarOuCriarCategoria(CategoriaRepository categorias, String nome, String descricao) {
        return categorias.findByNome(nome)
                .orElseGet(() -> categorias.save(new Categoria(null, nome, descricao)));
    }

    private Produto buscarOuCriarProduto(ProdutoRepository produtos, String nome, Double preco, Categoria categoria) {
        return produtos.findByNome(nome)
                .map(p -> {
                    if (p.getCategoria() == null) {
                        p.setCategoria(categoria);
                        return produtos.save(p);
                    }
                    return p;
                })
                .orElseGet(() -> produtos.save(new Produto(null, nome, preco, categoria)));
    }

    private Usuario criarOuAtualizarUsuario(UsuarioRepository usuarios, PasswordEncoder encoder,
            String nome, String username, String senha, String email, Set<Permissao> permissoes) {

        Usuario usuario = usuarios.findByUsername(username).orElseGet(() -> {
            Usuario novo = new Usuario(nome, username, encoder.encode(senha), email);
            novo.setPermissoes(new HashSet<>(permissoes));
            return usuarios.save(novo);
        });

        if (usuario.getSenha() == null || !ehHashBcrypt(usuario.getSenha())) {
            usuario.setSenha(encoder.encode(senha));
            usuarios.save(usuario);
        }

        return usuario;
    }

    private boolean ehHashBcrypt(String senha) {
        return HASH_BCRYPT.matcher(senha).matches();
    }
}
