"use client";

import { useState, useEffect } from "react";
import styles from "../../styles/Home.module.css";
import Link from "next/link";

const ModalAviso = ({
  mensagem,
  aoFechar,
  aoConfirmar,
}: {
  mensagem: string;
  aoFechar: () => void;
  aoConfirmar?: () => void;
}) => {
  if (!mensagem) return null;
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalConteudo}>
        <img
          src="/icone-GB.png"
          alt="Logo GeekBay"
          className={styles.logoCard}
        />
        <p>{mensagem}</p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          {aoConfirmar ? (
            <>
              <button onClick={aoConfirmar} className={styles.btnAcao}>
                Sim, Excluir
              </button>
              <button
                onClick={aoFechar}
                className={styles.btnAcao}
                style={{ backgroundColor: "#757575" }}
              >
                Cancelar
              </button>
            </>
          ) : (
            <button onClick={aoFechar} className={styles.btnAcao}>
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Produtos() {
  const normalizarListaPedidos = (payload: any): any[] => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.content)) return payload.content;
    if (Array.isArray(payload?.pedidos)) return payload.pedidos;
    return [];
  };

  const [produtos, setProdutos] = useState<any[]>([]);
  const [estoque, setEstoque] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<any>(null);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState<any>(null);
  const [carregandoEndereco, setCarregandoEndereco] = useState(false);
  const [erroEndereco, setErroEndereco] = useState("");
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [pedidosOriginais, setPedidosOriginais] = useState<any[]>([]);
  const [pedidoParaExcluir, setPedidoParaExcluir] = useState<number | null>(
    null,
  );
  const [mensagemModal, setMensagemModal] = useState("");
  const [mostrarModalBusca, setMostrarModalBusca] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");
  const [pedidoClienteModal, setPedidoClienteModal] = useState<any>(null);
  const [pedidoProdutosModal, setPedidoProdutosModal] = useState<any>(null);
  const [idParaExcluir, setIdParaExcluir] = useState<any>(null);
  const [editandoEstoqueId, setEditandoEstoqueId] = useState<number | null>(
    null,
  );
  const [formEstoque, setFormEstoque] = useState({
    quantidade: 0,
  });

    // Cadastro de produto
  const [formCadastrar, setFormCadastrar] = useState({
    categoria: "",
    nome: "",
    preco: "",
    imagem: "",
    quantidade: "",
  });

    // Edição de produto
  const [formEditar, setFormEditar] = useState({
    id: "",
    categoria: "",
    nome: "",
    preco: "",
    descricao: "",
    imagem: "",
    quantidade: 0,
  });

  useEffect(() => {
    listarTodos();
    listarEstoque();
    listarCategorias();
    listarPedidos();
    listarClientes();
  }, []);

    // Lista clientes - usuários dentro do Back
  const listarClientes = async () => {
    try {
      const response = await fetch("http://localhost:8080/usuarios");
      const dados = await response.json();
      setClientes(dados);
    } catch (error) {
      console.error("Erro ao carregar clientes.");
    }
  };

    // Lista produtos - Endpoint: GET /api/produto
    // Retorna lista de ProdutoResponseDTO com campos: id, nome, descricao, preco, imagem, categoriaResponseDTO, ativo
  const listarTodos = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/produto");
      if (!response.ok) throw new Error("Falha na requisição");
      const dados = await response.json();
      setProdutos(dados);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      setMensagemModal("Erro ao carregar produtos. Verifique se o backend está rodando.");
    }
  };

    // Lista estoque - Endpoint: GET /api/estoque
    // Retorna lista de EstoqueResponseDTO com campos: quantidade, produtoResponseDTO (id, nome, preco, imagem, categoriaResponseDTO)
  const listarEstoque = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/estoque");
      if (!response.ok) throw new Error("Falha na requisição");
      const dados = await response.json();
      setEstoque(dados.map(mapEstoque));
    } catch (error) {
      console.error("Erro ao carregar estoque:", error);
    }
  };

    // Lista categorias
  const listarCategorias = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/categoria");
      if (!response.ok) throw new Error();
      const dados = await response.json();
      setCategorias(dados);
    } catch (error) {
      setMensagemModal("Erro ao carregar categorias.");
    }
  };

    // Lista pedidos - Endpoint: GET /api/pedidos
    // Retorna lista de PedidoResponseDTO do backend Spring Boot
  const listarPedidos = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/pedidos");
      if (!response.ok) throw new Error("Falha ao carregar pedidos");

      const dados = await response.json();
      const listaPedidos = normalizarListaPedidos(dados);

      setPedidos(listaPedidos);
      setPedidosOriginais(listaPedidos);
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
      setPedidos([]);
      setPedidosOriginais([]);
    }
  };

    // Exclui pedido
  const prepararExclusaoPedido = (id: number) => {
    setPedidoParaExcluir(id);
    setMensagemModal(
      `Tem certeza que deseja excluir o pedido #${id}? Esta ação não pode ser desfeita.`,
    );
  };

  // Excluir pedido - Endpoint: DELETE /api/pedidos/{id}
  // OBS: Backend precisa implementar este endpoint ainda
  const confirmarExclusaoPedido = async () => {
    if (!pedidoParaExcluir) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/pedidos/${pedidoParaExcluir}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        setMensagemModal(`Pedido #${pedidoParaExcluir} removido com sucesso!`);
        const novaLista = pedidos.filter((p) => p.id !== pedidoParaExcluir);
        setPedidos(novaLista);
        setPedidosOriginais(novaLista);
        setPedidoParaExcluir(null);
      } else {
        setMensagemModal("Erro: Backend não implementou endpoint DELETE /api/pedidos/{id}");
      }
    } catch (error) {
      setMensagemModal("Erro ao excluir pedido: " + error);
    }
  };

    // Cadastrar produto - Endpoint: POST /api/produto
    // Backend espera ProdutoRequestDTO: { nome, descricao, preco, imagem, categoria_id, ativo }
  const handleCadastrar = async (e: any) => {
    e.preventDefault();
    try {
      // 1. Busca categoria pelo nome para obter o ID
      const responseCategoria = await fetch(`http://localhost:8080/api/categoria/nome/${formCadastrar.categoria}`);
      if(!responseCategoria.ok) throw new Error("Categoria inexistente");
     
        const categoria = await responseCategoria.json();
      
      // 2. Cria produto com DTO compatível com backend
      const responseProduto = await fetch("http://localhost:8080/api/produto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: formCadastrar.nome,
          descricao: "",  // Campo obrigatório no backend, mas não usado no frontend
          preco: Number(formCadastrar.preco),
          imagem: formCadastrar.imagem || "",
          categoria_id: categoria.id,
          ativo: true  // Produto nasce ativo por padrão
        }),
      });
      if (!responseProduto.ok) throw new Error("Erro no cadastro do produto");

      // 3. Busca produto cadastrado para obter o ID gerado
      const responseProdutoCadastrado = await fetch(`http://localhost:8080/api/produto/nome/${formCadastrar.nome}`);
      if(!responseProdutoCadastrado.ok) throw new Error("Erro na busca do produto cadastrado");
      const idProduto = await responseProdutoCadastrado.json();

      // 4. Cadastra estoque vinculado ao produto
      const novoEstoque = {
        produto_id: idProduto.id,
        quantidade: Number(formCadastrar.quantidade),
      };

      await fetch("http://localhost:8080/api/estoque", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoEstoque),
      });

      setMensagemModal("Produto e estoque cadastrados com sucesso!");
      setFormCadastrar({
        categoria: "",
        nome: "",
        preco: "",
        imagem: "",
        quantidade: "",
      });
      listarTodos();
      listarEstoque();
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      setMensagemModal("Erro ao cadastrar produto ou estoque.");
    }
  };

  // Prepara formulário de edição com dados do produto
  // Backend retorna ProdutoResponseDTO: { id, nome, descricao, preco, imagem, categoriaResponseDTO, ativo }
  const prepararEdicao = (produto: any) => {
    const itemEstoque = estoque.find(
      (e) => String(e.produto_id) === String(produto.id),
    );

    setFormEditar({
      id: produto.id,
      categoria: produto.categoriaResponseDTO?.nome || produto.categoria || "",
      nome: produto.nome || "",
      preco: produto.preco != null ? String(produto.preco) : "",
      descricao: produto.descricao || "",  // Campo do backend
      imagem: produto.imagem || "",
      quantidade: itemEstoque ? itemEstoque.quantidade : 0,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

    // Salvar edição do produto - Endpoint: PUT /api/produto/{id}
    // Backend espera ProdutoUpdateRequestDTO: { nome, descricao, preco, imagem, categoria_id, ativo }
  const handleSalvarEdicao = async (e: any) => {
    e.preventDefault();
    try {
      // 1. Busca categoria pelo nome para obter o ID atualizado
      const categoriaAtualizada = await fetch(
        `http://localhost:8080/api/categoria/nome/${formEditar.categoria}`
      );
      if (!categoriaAtualizada.ok) throw new Error("Categoria não encontrada.");
      const categoriaAtualizadaResponse = await categoriaAtualizada.json();

      // 2. Atualiza produto com DTO compatível com backend
      const response = await fetch(
        `http://localhost:8080/api/produto/${formEditar.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome: formEditar.nome,
            descricao: formEditar.descricao,
            preco: Number(formEditar.preco),
            imagem: formEditar.imagem,
            categoria_id: categoriaAtualizadaResponse.id,
            ativo: true  
          }),
        },
      );
      if (!response.ok) throw new Error("Falha ao atualizar produto");

      // 3. Atualiza estoque do produto
      // Backend endpoint: PUT /api/estoque/produto/{id}
      // Espera EstoqueRequestDTO: { quantidade, produto_id }
      await fetch(`http://localhost:8080/api/estoque/produto/${formEditar.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantidade: Number(formEditar.quantidade),
          produto_id: formEditar.id,
        }),
      });

      setMensagemModal("Produto atualizado com sucesso!");
      setFormEditar({
        id: "",
        categoria: "",
        nome: "",
        preco: "",
        descricao: "",
        imagem: "",
        quantidade: 0,
      });
      listarTodos();
      listarEstoque();
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      setMensagemModal("Erro ao atualizar produto.");
    }
  };

  const abrirConfirmacaoExcluir = (id: any) => {
    setIdParaExcluir(id);
    setMensagemModal("Tem certeza que deseja excluir este produto?");
  };

    // Excluir produto - Endpoint: DELETE /api/produto/{id}
  const confirmarExclusao = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/produto/${idParaExcluir}`,
        { method: "DELETE" },
      );
      if (!response.ok) throw new Error("Falha ao excluir produto");
      setIdParaExcluir(null);
      setMensagemModal("Produto removido!");
      listarTodos();
      listarEstoque();
    } catch (error) {
      console.error("Erro ao excluir:", error);
      setMensagemModal("Erro ao excluir produto.");
    }
  };

    // Edição do estoque dos produtos 
      // Melhor editar só quantidade né (?)
  const iniciarEdicaoEstoque = (item: any) => {
    setEditandoEstoqueId(item.id);
    setFormEstoque({
      quantidade: item.quantidade,
    });
  };

    // Salvar estoque atualizado - Endpoint: PUT /api/estoque/produto/{id}
    // Backend espera EstoqueRequestDTO: { quantidade, produto_id }
  const salvarEstoque = async (id: number) => {
    try {
      await fetch(`http://localhost:8080/api/estoque/produto/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantidade: formEstoque.quantidade,
          produto_id: id,  // Necessário enviar no DTO do backend
        }),
      });

      setMensagemModal("Estoque atualizado!");
      setEditandoEstoqueId(null);
      listarEstoque();
    } catch (error) {
      console.error("Erro ao atualizar estoque:", error);
      setMensagemModal("Erro ao atualizar estoque.");
    }
  };

    // Atualizar status do pedido - Endpoint: PUT /api/pedidos/atualizar/{id}?status={status}
    // Backend usa enum OrderStatus: PENDENTE, PRONTO, ENVIADO, CANCELADO
  const atualizarStatusPedido = async (id: number, status: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/pedidos/atualizar/${id}?status=${status}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        },
      );
      if (!response.ok) throw new Error("Falha ao atualizar status");
      setMensagemModal(`Pedido #${id} atualizado para "${status}"!`);
      listarPedidos();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      setMensagemModal("Erro ao atualizar status do pedido.");
    }
  };

  const listarEScrollar = () => {
    listarPedidos();
    const elemento = document.getElementById("tabela-pedidos");
    if (elemento) {
      elemento.scrollIntoView({ behavior: "smooth" });
    }
  };

  const obterUsuarioId = (cliente: any): number | null => {
    const candidato = cliente?.id;
    const usuarioId = Number(candidato);
    return Number.isFinite(usuarioId) && usuarioId > 0 ? usuarioId : null;
  };

  const abrirEnderecoCliente = async (cliente: any) => {
    const usuarioId = obterUsuarioId(cliente);
    if (!usuarioId) {
      setMensagemModal("Não foi possível identificar o ID do usuário deste cliente.");
      return;
    }

    setClienteSelecionado({
      id: cliente?.id,
      nome: cliente?.nome ?? "Cliente",
      email: cliente?.email ?? "",
    });
    setEnderecoSelecionado(null);
    setErroEndereco("");
    setCarregandoEndereco(true);

    try {
      const response = await fetch(
        `http://localhost:8080/api/enderecos/usuario/${usuarioId}`,
      );
      if (!response.ok) throw new Error("Falha ao buscar endereço do cliente");

      const dados = await response.json();
      const endereco = Array.isArray(dados)
        ? dados.find((item) => Number(item?.usuarioId) === usuarioId) || dados[0]
        : dados;

      if (!endereco) {
        setErroEndereco("Nenhum endereço encontrado para este cliente.");
      }

      setEnderecoSelecionado(endereco || null);
    } catch (error) {
      console.error("Erro ao buscar endereço do cliente:", error);
      setErroEndereco("Erro ao carregar endereço do cliente.");
    } finally {
      setCarregandoEndereco(false);
    }
  };

    // Mapeia EstoqueResponseDTO do backend para formato usado na tabela do frontend
    // Backend retorna: { quantidade, produtoResponseDTO: { id, nome, preco, imagem, categoriaResponseDTO: { id, nome, descricao } } }
  function mapEstoque(e: any) {
    return {
      id: e.produtoResponseDTO?.id || 0,  // ID do produto (não do estoque) para edição
      quantidade: e.quantidade,
      produto_id: e.produtoResponseDTO?.id || 0,
      produto: e.produtoResponseDTO?.nome || "Produto não encontrado",
      preco: e.produtoResponseDTO?.preco || 0,
      imagem: e.produtoResponseDTO?.imagem || "",
      categoria: e.produtoResponseDTO?.categoriaResponseDTO?.nome || "Sem categoria"
    };
  }

  const categoriaColors = [
    "#FF7A00",
    "#1E88E5",
    "#43A047",
    "#E53935",
    "#8E24AA",
    "#00897B",
    "#F4511E",
    "#3949AB",
  ];

  const getCategoriaColor = (index: number) => {
    if (index < categoriaColors.length) return categoriaColors[index];
    const hue = (index * 57) % 360;
    return `hsl(${hue}, 70%, 45%)`;
  };

  const getNomeClientePedido = (pedido: any) => {
    return pedido?.usuarioResponseDTO?.nome ?? pedido?.nome_cliente ?? "Cliente não informado";
  };

  const getStatusColor = (status: string) => {
    if (status === "PROCESSANDO" || status === "PENDENTE") return "#FF7A00";
    if (status === "CANCELADO" || status === "Cancelado") return "#f44336";
    return "green";
  };

  const abrirModalClientePedido = (pedido: any) => {
    setPedidoClienteModal(pedido);
  };

  const abrirModalProdutosPedido = (pedido: any) => {
    setPedidoProdutosModal(pedido);
  };
  

  return (
    <div
      className={styles.corpo}
      style={{
        backgroundImage: 'url("/bg-GeekBay.png")',
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        paddingBottom: "40px",
      }}
    >
      <header className={styles.cabecalho}>
        <img src="/icone-GB.png" alt="Logo GeekBay" className={styles.logo} />
        <h1 className={styles.nomeCabecalho} style={{ marginRight: "100px" }}>
          GeekBay
        </h1>
        <div style={{ display: "flex", flexDirection: "row", gap: "30px" }}>
          <Link href="/" style={{ textDecoration: "none", color: "#ff7004" }}>
            Home
          </Link>
          <Link
            href="/produtos"
            style={{
              textDecoration: "none",
              color: "#ff7004",
              marginLeft: "40px",
            }}
          >
            Gerenciamento
          </Link>
          <Link
            href="/dashboard"
            style={{
              textDecoration: "none",
              color: "#ff7004",
              marginLeft: "40px",
            }}
          >
            Dashboard
          </Link>
        </div>
      </header>

      <main className={styles.mainContainer}>
        <div className={styles.containerCards}>
          {/* FORMULÁRIO DE CADASTRO */}
          <section className={styles.card}>
            <div className={styles.cardTituloImg}>
              <img
                src={formCadastrar.imagem || "/icone-GB.png"}
                alt="Preview"
                className={styles.logoCard}
                style={{ objectFit: "contain", borderRadius: "8px" }}
              />
              <h2>Cadastrar Produto</h2>
            </div>
            <form onSubmit={handleCadastrar} className={styles.formulario}>
              <input
                className={styles.inputGroup}
                type="text"
                placeholder="URL da Imagem"
                value={formCadastrar.imagem}
                onChange={(e) =>
                  setFormCadastrar({ ...formCadastrar, imagem: e.target.value })
                }
              />
              <input
                className={styles.inputGroup}
                type="text"
                placeholder="Categoria"
                value={formCadastrar.categoria}
                onChange={(e) =>
                  setFormCadastrar({
                    ...formCadastrar,
                    categoria: e.target.value,
                  })
                }
                required
              />
              <input
                className={styles.inputGroup}
                type="number"
                placeholder="Quantidade"
                value={formCadastrar.quantidade}
                onChange={(e) =>
                  setFormCadastrar({
                    ...formCadastrar,
                    quantidade: e.target.value,
                  })
                }
              />
              <input
                className={styles.inputGroup}
                type="text"
                placeholder="Nome"
                value={formCadastrar.nome}
                onChange={(e) =>
                  setFormCadastrar({ ...formCadastrar, nome: e.target.value })
                }
                required
              />
              <input
                className={styles.inputGroup}
                type="number"
                step="0.01"
                min="0"
                placeholder="Preço"
                value={formCadastrar.preco}
                onChange={(e) =>
                  setFormCadastrar({ 
                    ...formCadastrar, 
                    preco: e.target.value
                  })
                }
                required
              />
              <button type="submit" className={styles.btnAcao}>
                Cadastrar
              </button>
            </form>
          </section>

          {/* FORMULÁRIO DE EDIÇÃO */}
          <section className={styles.card}>
            <div
              className={styles.cardTituloImg}
              style={{ marginBottom: "25px" }}
            >
              {formEditar.imagem ? (
                <img
                  src={formEditar.imagem}
                  alt="Foto do Produto"
                  className={styles.imgCardEditar}
                />
              ) : (
                <img
                  src="/icone-GB.png"
                  alt="Logo GeekBay"
                  className={styles.logoCard}
                />
              )}
              <h2>Editar Produto</h2>
            </div>
            <form onSubmit={handleSalvarEdicao} className={styles.formulario}>
              <input type="hidden" value={formEditar.id} />
              <input
                className={styles.inputGroup}
                type="text"
                placeholder="URL da Imagem"
                value={formEditar.imagem}
                onChange={(e) =>
                  setFormEditar({ ...formEditar, imagem: e.target.value })
                }
              />
              <input
                type="text"
                className={styles.inputGroup}
                placeholder="Categoria"
                value={formEditar.categoria}
                onChange={(e) =>
                  setFormEditar({ ...formEditar, categoria: e.target.value })
                }
                required
              />
              <input
                type="text"
                className={styles.inputGroup}
                placeholder="Nome"
                value={formEditar.nome}
                onChange={(e) =>
                  setFormEditar({ ...formEditar, nome: e.target.value })
                }
                required
              />
              <input
                type="text"
                className={styles.inputGroup}
                placeholder="Preço"
                value={formEditar.preco}
                onChange={(e) =>
                  setFormEditar({ 
                    ...formEditar, 
                    preco: e.target.value })
                }
                required
              />
              <button
                type="submit"
                className={styles.btnAcao}
                disabled={!formEditar.id}
              >
                Salvar Alterações
              </button>
            </form>
          </section>
        </div>

        {/* LISTA DE PRODUTOS */}
        <section
          id="secao-produtos"
          className={`${styles.card} ${styles.secaoListaCard}`}
        >
          <div className={styles.cardTituloImg}>
            <img src="/icone-GB.png" alt="Lista" className={styles.logoCard} />
            <h2>Lista de Produtos</h2>
          </div>
          <table className={styles.tabelaContainer}>
            <thead>
              <tr>
                <th>Foto</th>
                <th>Nome</th>
                <th>Preço</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.imagem ? (
                      <a
                        href={p.imagem}
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontSize: "10px", color: "#FF7A00" }}
                      >
                        Ver Foto
                      </a>
                    ) : (
                      <span style={{ fontSize: "10px" }}>Sem Foto</span>
                    )}
                  </td>
                  <td>{p.nome}</td>
                  <td>{p.preco}</td>
                  <td>
                    <div style={{ display: "flex", gap: "5px" }}>
                      <button
                        onClick={() => prepararEdicao(p)}
                        className={styles.btnAcao}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => abrirConfirmacaoExcluir(p.id)}
                        className={styles.btnAcao}
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* TABELA DE ESTOQUE  */}
        <section
          id="secao-estoque"
          className={`${styles.card} ${styles.secaoListaCard}`}
          style={{ marginTop: "30px" }}
        >
          <div className={styles.cardTituloImg}>
            <img
              src="/icone-GB.png"
              alt="Estoque"
              className={styles.logoCard}
            />
            <h2>Controle de Estoque</h2>
          </div>
          <table className={styles.tabelaContainer}>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Quantidade</th>
                <th>Categoria</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {estoque.map((e) => (
                <tr key={e.id}>
                  <td style={{ fontWeight: "bold" }}>
                    {e.produto ?? "Produto não encontrado"}
                    <span
                      style={{
                        fontSize: "10px",
                        color: "#757575",
                        marginLeft: "5px",
                        fontWeight: "normal",
                      }}
                    >
                      ({e.categoria ?? "Sem categoria"})
                    </span>
                  </td>
                  <td>
                    {editandoEstoqueId === e.id ? (
                      <input
                        type="number"
                        className={styles.inputGroup}
                        style={{ width: "80px", margin: 0 }}
                        value={formEstoque.quantidade}
                        autoFocus
                        onChange={(ev) =>
                          setFormEstoque({
                            ...formEstoque,
                            quantidade:
                              ev.target.value === ""
                                ? 0
                                : Number(ev.target.value),
                          })
                        }
                      />
                    ) : (
                      <span
                        style={{
                          color:
                            e.quantidade < 3 ? "red" : "inherit",
                        }}
                      >
                        {e.quantidade}
                      </span>
                    )}
                  </td>
                  <td>
                    {e.categoria ?? "Sem categoria"}
                  </td>
                  <td
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                      padding: "10px 0",
                    }}
                  >
                    {editandoEstoqueId === e.id ? (
                      <div style={{ display: "flex", gap: "5px" }}>
                        <button
                          onClick={() => salvarEstoque(e.id)}
                          className={styles.btnAcao}
                          style={{ padding: "10px 10px" }}
                        >
                          Salvar
                        </button>
                        <button
                          onClick={() => setEditandoEstoqueId(null)}
                          className={styles.btnAcao}
                          style={{
                            backgroundColor: "#757575",
                            padding: "5px 10px",
                          }}
                        >
                          Sair
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => iniciarEdicaoEstoque(e)}
                        className={styles.btnAcao}
                        style={{ width: "80px", padding: "5px 10px" }}
                      >
                        Alterar Estoque
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* TABELA DE CATEGORIAS */}
        <section
          id="secao-categorias"
          className={`${styles.card} ${styles.secaoListaCard}`}
          style={{ marginTop: "30px" }}
        >
          <div className={styles.cardTituloImg}>
            <img
              src="/icone-GB.png"
              alt="Categorias"
              className={styles.logoCard}
            />
            <h2 style={{ color: "#000000" }}>Gerenciar Categorias</h2>
          </div>
          <table className={styles.tabelaContainer}>
            <thead>
              <tr>
                <th></th>
                <th>Categoria</th>
                <th>Descrição</th>
              </tr>
            </thead>
            <tbody>
              {categorias.length > 0 ? (
                categorias.map((categoria, index) => (
                  <tr key={categoria.id}>
                    <td>
                      <span
                        style={{
                          display: "inline-block",
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          backgroundColor: getCategoriaColor(index),
                        }}
                        aria-label={`Categoria ${categoria.nome}`}
                        title={categoria.nome}
                      />
                    </td>
                    <td>{categoria.nome}</td>
                    <td style={{ textAlign: "left" }}>
                      {categoria.descricao || "Sem descrição"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} style={{ textAlign: "center", color: "#757575" }}>
                    Nenhuma categoria encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* TABELA DE CLIENTES */}
        <section
          id="secao-clientes"
          className={`${styles.card} ${styles.secaoListaCard}`}
          style={{ marginTop: "30px" }}
        >
          <div className={styles.cardTituloImg}>
            <img
              src="/icone-GB.png"
              alt="Clientes"
              className={styles.logoCard}
            />
            <h2 style={{ color: "#000000" }}>Gerenciar Clientes</h2>
          </div>
          <table className={styles.tabelaContainer}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c, id) => (
                <tr key={c.id ?? id}>
                  <td>{c.nome ?? "-"}</td>
                  <td>{c.email ?? "-"}</td>
                  <td>
                    <button
                      onClick={() => abrirEnderecoCliente(c)}
                      className={styles.btnAcao}
                      style={{ width: "100%" }}
                    >
                      Endereço
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* TABELA DE PEDIDOS */}
        <section
          id="secao-pedidos"
          className={`${styles.card} ${styles.secaoListaCard}`}
          style={{ marginTop: "30px" }}
        >
          <div className={styles.cardTituloImg}>
            <img
              src="/icone-GB.png"
              alt="Pedidos"
              className={styles.logoCard}
            />
            <h2 style={{ color: "#000000" }}>Gerenciar Pedidos</h2>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "15px",
              padding: "10px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <button className={styles.btnAcao} onClick={listarEScrollar}>
              Listar todos os pedidos
            </button>
            <button
              className={styles.btnAcao}
              onClick={() => setMostrarModalBusca(true)}
            >
              Listar todos os pedidos por cliente
            </button>
            <Link
              href="/dashboard"
              className={styles.btnAcao}
              style={{
                textDecoration: "none",
                fontFamily: "sans-serif",
                textAlign: "center",
                fontSize: "12px",
              }}
            >
              Dashboard
            </Link>
          </div>
        </section>

        {/* TABELA DE PEDIDOS FEITOS */}
        <section
          id="tabela-pedidos"
          className={`${styles.card} ${styles.secaoListaCard}`}
          style={{ width: "100%", maxWidth: "1000px", marginTop: "30px" }}
        >
          <div className={styles.cardTituloImg}>
            <img
              src="/icone-GB.png"
              alt="Pedidos"
              className={styles.logoCard}
            />
            <h2>Gerenciar Pedidos</h2>
          </div>
          <div
            style={{
              display: "flex",
              gap: "20px",
              marginBottom: "30px",
              flexWrap: "wrap",
            }}
          >
            <div
              className={styles.card}
              style={{ flex: 1, borderLeft: "5px solid #FF7A00" }}
            >
              <h3 style={{ color: "#757575", fontSize: "14px" }}>A Preparar</h3>
              <p
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#FF7A00",
                }}
              >
                {pedidosOriginais.filter((p) => p.status === "Pendente").length}
              </p>
            </div>
            <div
              className={styles.card}
              style={{ flex: 1, borderLeft: "5px solid #FF7A00" }}
            >
              <h3 style={{ color: "#757575", fontSize: "14px" }}>
                Faturamento Total
              </h3>
              <p
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#ff7a00",
                }}
              >
                R${" "}
                {pedidosOriginais
                  .reduce((acc, p) => acc + Number(p.valorTotal ?? p.valor_total ?? 0), 0)
                  .toFixed(2)}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
            <button className={styles.btnAcao} onClick={listarPedidos}>
              Limpar Filtros
            </button>
            <button
              className={styles.btnAcao}
              onClick={() =>
                setPedidos(
                  pedidos.filter(
                    (p) => p.status === "PROCESSANDO" || p.status === "PENDENTE",
                  ),
                )
              }
            >
              A Preparar
            </button>
          </div>
          <table className={styles.tabelaContainer}>
            <thead>
              <tr>
                <th>Nº</th>
                <th>Cliente</th>
                <th>Produtos</th>
                <th>Status</th>
                <th>Total</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((p) => (
                <tr key={p.id}>
                  <td>#{p.id}</td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <button
                        className={styles.btnAcao}
                        style={{ padding: "5px 8px" }}
                        onClick={() => abrirModalClientePedido(p)}
                      >
                        Ver
                      </button>
                    </div>
                  </td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <button
                        className={styles.btnAcao}
                        style={{ padding: "5px 8px" }}
                        onClick={() => abrirModalProdutosPedido(p)}
                      >
                        Ver
                      </button>
                    </div>
                  </td>
                  <td
                    style={{
                      fontWeight: "bold",
                      color: getStatusColor(p.status),
                    }}
                  >
                    {p.status}
                  </td>
                  <td>
                    <div>R$ {Number(p.valorTotal ?? 0).toFixed(2)}</div>
                    <div style={{ fontSize: "10px", color: "#757575" }}>Valor total</div>
                  </td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        gap: "5px",
                        justifyContent: "center",
                      }}
                    >
                      <button
                        onClick={() => atualizarStatusPedido(p.id, "Pronto")}
                        className={styles.btnAcao}
                        style={{ padding: "5px", width: "80px" }}
                      >
                        Atualizar
                      </button>
                      <button
                        onClick={() => prepararExclusaoPedido(p.id)}
                        className={styles.btnAcao}
                        style={{ padding: "5px", backgroundColor: "#f44336" }}
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      {/* MODAIS  */}
      {mostrarModalBusca && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalConteudo}>
            <img src="/icone-GB.png" alt="Busca" className={styles.logoCard} />
            <h3>Buscar Pedidos por Cliente</h3>
            <input
              type="text"
              className={styles.inputGroup}
              placeholder="Digite o nome do cliente..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              style={{ marginTop: "15px", marginBottom: "15px" }}
              autoFocus
            />
            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              <button
                className={styles.btnAcao}
                onClick={() => {
                  const normalizarTexto = (texto: string) =>
                    texto
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .replace(/ç/g, "c")
                      .replace(/Ç/g, "C")
                      .toLowerCase();

                  const filtrados = pedidos.filter((p) =>
                    normalizarTexto(getNomeClientePedido(p)).includes(
                      normalizarTexto(termoBusca),
                    ),
                  );
                  setPedidos(filtrados);
                  setMostrarModalBusca(false);
                  setTermoBusca("");
                }}
              >
                Buscar
              </button>
              <button
                className={styles.btnAcao}
                style={{ backgroundColor: "#757575" }}
                onClick={() => {
                  setMostrarModalBusca(false);
                  setTermoBusca("");
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {pedidoClienteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalConteudo}>
            <img
              src="/icone-GB.png"
              alt="Cliente do pedido"
              className={styles.logoCard}
            />
            <h3>Cliente do Pedido #{pedidoClienteModal.id}</h3>
            <div style={{ textAlign: "left", margin: "15px 0", fontSize: "14px" }}>
              <p>
                <strong>Nome:</strong>{" "}
                {pedidoClienteModal.usuarioResponseDTO?.nome ?? "-"}
              </p>
              <p>
                <strong>E-mail:</strong>{" "}
                {pedidoClienteModal.usuarioResponseDTO?.email ?? "-"}
              </p>
              <p>
                <strong>Rua:</strong>{" "}
                {pedidoClienteModal.endereco?.street ?? "-"}
              </p>
              <p>
                <strong>Bairro:</strong>{" "}
                {pedidoClienteModal.endereco?.neighborhood ?? "-"}
              </p>
              <p>
                <strong>Número:</strong>{" "}
                {pedidoClienteModal.endereco?.number ?? "-"}
              </p>
              <p>
                <strong>Cidade/UF:</strong>{" "}
                {pedidoClienteModal.endereco?.city ?? "-"}/{pedidoClienteModal.endereco?.state ?? "-"}
              </p>
              <p>
                <strong>CEP:</strong>{" "}
                {pedidoClienteModal.endereco?.cep ?? "-"}
              </p>
            </div>
            <button className={styles.btnAcao} onClick={() => setPedidoClienteModal(null)}>
              Fechar
            </button>
          </div>
        </div>
      )}

      {pedidoProdutosModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalConteudo}>
            <img
              src="/icone-GB.png"
              alt="Produtos do pedido"
              className={styles.logoCard}
            />
            <h3>Produtos do Pedido #{pedidoProdutosModal.id}</h3>
            <div style={{ textAlign: "left", margin: "15px 0", fontSize: "14px", maxHeight: "260px", overflowY: "auto" }}>
              {Array.isArray(pedidoProdutosModal.itens) && pedidoProdutosModal.itens.length > 0 ? (
                pedidoProdutosModal.itens.map((item: any, idx: number) => (
                  <div
                    key={item.id ?? idx}
                    style={{ marginBottom: "10px", paddingBottom: "10px", borderBottom: "1px solid #e0e0e0" }}
                  >
                    <p>
                      <strong>Produto:</strong> {item?.produto?.nome ?? "-"}
                    </p>
                    <p>
                      <strong>Descrição:</strong> {item?.produto?.descricao || "Sem descrição"}
                    </p>
                    <p>
                      <strong>Quantidade:</strong> {item?.quantidade ?? 0}
                    </p>
                    <p>
                      <strong>Preço Unitário:</strong> R$ {Number(item?.precoUnitario ?? 0).toFixed(2)}
                    </p>
                  </div>
                ))
              ) : (
                <p>Nenhum produto encontrado neste pedido.</p>
              )}
            </div>
            <button className={styles.btnAcao} onClick={() => setPedidoProdutosModal(null)}>
              Fechar
            </button>
          </div>
        </div>
      )}

      {clienteSelecionado && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalConteudo}>
            <img
              src="/icone-GB.png"
              alt="GeekBay"
              className={styles.logoCard}
            />
            <h3>Endereço de {clienteSelecionado.nome}</h3>
            {clienteSelecionado.email && (
              <p style={{ marginTop: "8px", color: "#555" }}>
                {clienteSelecionado.email}
              </p>
            )}
            {carregandoEndereco ? (
              <p style={{ margin: "15px 0" }}>Carregando endereço...</p>
            ) : erroEndereco ? (
              <p style={{ margin: "15px 0", color: "#f44336" }}>{erroEndereco}</p>
            ) : enderecoSelecionado ? (
              <div
                style={{ textAlign: "left", margin: "15px 0", fontSize: "14px" }}
              >
                <p>
                  <strong>Rua:</strong>{" "}
                  {enderecoSelecionado.street ?? "-"}, {enderecoSelecionado.number ?? "-"}
                </p>
                <p>
                  <strong>Bairro:</strong>{" "}
                  {enderecoSelecionado.neighborhood ?? "-"}
                </p>
                <p>
                  <strong>Cidade/UF:</strong>{" "}
                  {enderecoSelecionado.city ?? "-"}/{enderecoSelecionado.state ?? "-"}
                </p>
                <p>
                  <strong>CEP:</strong>{" "}
                  {enderecoSelecionado.cep ?? "-"}
                </p>
                <p>
                  <strong>Obs:</strong>{" "}
                  {enderecoSelecionado.complement ?? "-"}
                </p>
              </div>
            ) : (
              <p style={{ margin: "15px 0" }}>Nenhum endereço encontrado.</p>
            )}
            <button
              className={styles.btnAcao}
              onClick={() => {
                setClienteSelecionado(null);
                setEnderecoSelecionado(null);
                setErroEndereco("");
                setCarregandoEndereco(false);
              }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      <ModalAviso
        mensagem={mensagemModal}
        aoFechar={() => {
          setMensagemModal("");
          setIdParaExcluir(null);
          setPedidoParaExcluir(null);
        }}
        aoConfirmar={
          idParaExcluir
            ? confirmarExclusao
            : pedidoParaExcluir
              ? confirmarExclusaoPedido
              : undefined
        }
      />
    </div>
  );
}
