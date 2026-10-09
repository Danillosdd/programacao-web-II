#!/bin/bash
BASE_PKG="src/main/java/br/ueg/trindade/braullyweb2fullstack"
mkdir -p "$BASE_PKG/model"
mkdir -p "$BASE_PKG/controller"

# Usuario
cat << 'INNER_EOF' > "$BASE_PKG/model/Usuario.java"
package br.ueg.trindade.braullyweb2fullstack.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class Usuario {
    private String nome;
    private String username;
    
    @JsonIgnore
    private String senha;
    
    private String email;

    public Usuario() {}

    public Usuario(String nome, String username, String senha, String email) {
        this.nome = nome;
        this.username = username;
        this.senha = senha;
        this.email = email;
    }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
INNER_EOF

# Permissao
cat << 'INNER_EOF' > "$BASE_PKG/model/Permissao.java"
package br.ueg.trindade.braullyweb2fullstack.model;

public class Permissao {
    private Long id;
    private String nome;
    private String descricao;

    public Permissao() {}

    public Permissao(Long id, String nome, String descricao) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
}
INNER_EOF

# Produto
cat << 'INNER_EOF' > "$BASE_PKG/model/Produto.java"
package br.ueg.trindade.braullyweb2fullstack.model;

public class Produto {
    private Long id;
    private String nome;
    private Double preco;

    public Produto() {}

    public Produto(Long id, String nome, Double preco) {
        this.id = id;
        this.nome = nome;
        this.preco = preco;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public Double getPreco() { return preco; }
    public void setPreco(Double preco) { this.preco = preco; }
}
INNER_EOF

# UsuarioController
cat << 'INNER_EOF' > "$BASE_PKG/controller/UsuarioController.java"
package br.ueg.trindade.braullyweb2fullstack.controller;

import br.ueg.trindade.braullyweb2fullstack.model.Usuario;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class UsuarioController {

    @GetMapping("/usuarios")
    public List<Usuario> getAllUsuarios() {
        List<Usuario> users = new ArrayList<>();
        users.add(new Usuario("João", "joao123", "senha123", "joao@example.com"));
        users.add(new Usuario("Maria", "maria456", "senha456", "maria@example.com"));
        return users;
    }
}
INNER_EOF

# PermissaoController
cat << 'INNER_EOF' > "$BASE_PKG/controller/PermissaoController.java"
package br.ueg.trindade.braullyweb2fullstack.controller;

import br.ueg.trindade.braullyweb2fullstack.model.Permissao;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class PermissaoController {

    @GetMapping("/permissoes")
    public List<Permissao> getAllPermissoes() {
        List<Permissao> permissoes = new ArrayList<>();
        permissoes.add(new Permissao(1L, "ADMIN", "Permissão de administrador"));
        permissoes.add(new Permissao(2L, "USER", "Permissão de usuário comum"));
        return permissoes;
    }
}
INNER_EOF

# ProdutoController
cat << 'INNER_EOF' > "$BASE_PKG/controller/ProdutoController.java"
package br.ueg.trindade.braullyweb2fullstack.controller;

import br.ueg.trindade.braullyweb2fullstack.model.Produto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ProdutoController {

    @GetMapping("/produtos")
    public List<Produto> getAllProdutos() {
        List<Produto> produtos = new ArrayList<>();
        produtos.add(new Produto(1L, "Notebook", 4500.00));
        produtos.add(new Produto(2L, "Mouse", 120.00));
        return produtos;
    }
}
INNER_EOF

chmod +x generate_classes.sh
./generate_classes.sh
