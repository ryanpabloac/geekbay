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
  const [produtos, setProdutos] = useState<any[]>([]);
  const [estoque, setEstoque] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<any>(null);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [pedidosOriginais, setPedidosOriginais] = useState<any[]>([]);
  const [pedidoParaExcluir, setPedidoParaExcluir] = useState<number | null>(
    null,
  );
  const [mensagemModal, setMensagemModal] = useState("");
  const [mostrarModalBusca, setMostrarModalBusca] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");
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
    preco: 0.0,
    imagem: "",
    quantidade: 0,
  });

    // Edição de produto
  const [formEditar, setFormEditar] = useState({
    id: "",
    categoria: "",
    nome: "",
    preco: 0.0,
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
      const response = await fetch("http://localhost:5000/clientes");
      const dados = await response.json();
      setClientes(dados);
    } catch (error) {
      console.error("Erro ao carregar clientes.");
    }
  };

    // Lista produtos
  const listarTodos = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/produto");
      if (!response.ok) throw new Error();
      const dados = await response.json();
      setProdutos(dados);
    } catch (error) {
      setMensagemModal("Erro ao carregar produtos.");
    }
  };

    // Lista estoque
  const listarEstoque = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/estoque");
      if (!response.ok) throw new Error();
      const dados = await response.json();
      setEstoque(dados.map(mapEstoque));
    } catch (error) {
      console.error("Erro ao carregar estoque.");
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

    // Lista pedidos
  const listarPedidos = async () => {
    try {
      const response = await fetch("http://localhost:5000/pedidos");
      const dados = await response.json();
      setPedidos(dados);
      setPedidosOriginais(dados);
    } catch (error) {
      console.error("Erro nos pedidos");
    }
  };

    // Exclui pedido
  const prepararExclusaoPedido = (id: number) => {
    setPedidoParaExcluir(id);
    setMensagemModal(
      `Tem certeza que deseja excluir o pedido #${id}? Esta ação não pode ser desfeita.`,
    );
  };

  const confirmarExclusaoPedido = async () => {
    if (!pedidoParaExcluir) return;

    try {
      const response = await fetch(
        `http://localhost:5000/pedidos/${pedidoParaExcluir}`,
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
      }
    } catch (error) {
      setMensagemModal("Erro ao conectar com o servidor.");
    }
  };

    // Cadastrar produto
  const handleCadastrar = async (e: any) => {
    e.preventDefault();
    try {
        // Busca categoria pelo nome dado no form e cria produto com categoria.id
      const responseCategoria = (await fetch(`http://localhost:8080/api/categoria/nome/${formCadastrar.categoria}`));
      if(!responseCategoria.ok) throw new Error("Categoria não encontrada.");
      const categoria = await responseCategoria.json();

      //const responseProduto = await fetch("http://localhost:5000/produtos", {
      const responseProduto = await fetch("http://localhost:8080/api/produto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoria_id: categoria.id,
          nome: formCadastrar.nome,
          preco: formCadastrar.preco,
          imagem: formCadastrar.imagem || ""
        }),
      });
      if (!responseProduto.ok) throw new Error("Erro no cadastro do produto");

        // Depois preciso otimizar isso aqui
      const responseProdutoCadastrado = await fetch(`http://localhost:8080/api/produto/nome/${formCadastrar.nome}`);
      if(!responseProdutoCadastrado.ok) throw new Error("Erro na busca do produto cadastrado");
      const idProduto = await responseProdutoCadastrado.json();

      const novoEstoque = {
        produto_id: idProduto.id,
        quantidade: formCadastrar.quantidade,
      };


        // Aqui é onde o estoque é cadastrado com o produto criado
      await fetch("http://localhost:8080/api/estoque", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoEstoque),
      });

      setMensagemModal("Produto e estoque cadastrados com sucesso!");
      setFormCadastrar({
        categoria: "",
        nome: "",
        preco: 0.0,
        imagem: "",
        quantidade: 0,
      });
      listarTodos();
      listarEstoque();
    } catch (error) {
      console.error(error);
      setMensagemModal("Erro ao cadastrar produto ou estoque.");
    }
  };

  const prepararEdicao = (produto: any) => {
    console.log("Produto recebido:", produto);
    const itemEstoque = estoque.find(
      (e) => String(e.produto_id) === String(produto.id),
    );  // Busca dentro do estoque o item com produto_id correspondente
    console.log("Item estoque encontrado:", itemEstoque);
    
    setFormEditar({
      id: produto.id,
      categoria: produto.categoriaResponseDTO?.nome || produto.categoria || "",
      nome: produto.nome || "",
      preco: produto.preco || 0.0,
      descricao: produto.descricao || "",
      imagem: produto.imagem || produto.img || "",
      quantidade: itemEstoque ? itemEstoque.quantidade : 0,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

    // Salvar atualização do produto
  const handleSalvarEdicao = async (e: any) => {
    e.preventDefault();
    try {

        // Atualiza a categoria para atualizar o produto com base no categoria.id
      const updateCategoriaResponse = await fetch(
        `http://localhost:8080/api/categoria/nome/${formEditar.categoria}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome: formEditar.categoria
          })
        }
      );
      if(!updateCategoriaResponse.ok) throw new Error("Erro ao atualizar categoria.");

      const categoriaAtualizada = await fetch(
        `http://localhost:8080/api/categoria/nome/${formEditar.categoria}`
      );
      if (!categoriaAtualizada.ok) throw new Error("Categoria não encontrada.");
      const categoriaAtualizadaResponse = await categoriaAtualizada.json();

      const response = await fetch(
        `http://localhost:8080/api/produto/${formEditar.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            categoria_id: categoriaAtualizadaResponse.id,
            nome: formEditar.nome,
            preco: formEditar.preco,
            descricao: formEditar.descricao,
            imagem: formEditar.imagem,
          }),
        },
      );
      if (!response.ok) throw new Error();

        // Verificar se esse ID está chegando
          // pois não é pra ter produto.id no forms
      const itemEstoque = estoque.find(
        (est) => String(est.produto_id) === String(formEditar.id),
      );

      if (itemEstoque) {
        await fetch(`http://localhost:8080/api/estoque/${itemEstoque.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quantidade: Number(formEditar.quantidade),
          }),
        });
      }

      setMensagemModal("Produto atualizado com sucesso!");
      setFormEditar({
        id: "",
        categoria: "",
        nome: "",
        preco: 0.0,
        descricao: "",
        imagem: "",
        quantidade: 0,
      });
      listarTodos();
    } catch (error) {
      console.error(error)
      setMensagemModal("Erro ao atualizar produto.");
    }
  };

  const abrirConfirmacaoExcluir = (id: any) => {
    setIdParaExcluir(id);
    setMensagemModal("Tem certeza que deseja excluir este produto?");
  };

  const confirmarExclusao = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/produto/${idParaExcluir}`,
        { method: "DELETE" },
      );
      if (!response.ok) throw new Error();
      setIdParaExcluir(null);
      setMensagemModal("Produto removido!");
      listarTodos();
      listarEstoque();
    } catch (error) {
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

    // Salvar estoque atualizado
  const salvarEstoque = async (id: number) => {
    try {
      await fetch(`http://localhost:8080/api/estoque/produto/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantidade: formEstoque.quantidade,
        }),
      });

      setMensagemModal("Estoque atualizado!");
      setEditandoEstoqueId(null);
      listarEstoque();
    } catch (error) {
      setMensagemModal("Erro ao atualizar estoque.");
    }
  };

    // Atualizar status do pedido
  const atualizarStatusPedido = async (id: number, status: string) => {
    try {
      await fetch(`http://localhost:5000/pedidos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setMensagemModal(`Pedido #${id} atualizado!`);
      listarPedidos();
    } catch (error) {
      setMensagemModal("Erro ao atualizar status.");
    }
  };

  const listarEScrollar = () => {
    listarPedidos();
    const elemento = document.getElementById("tabela-pedidos");
    if (elemento) {
      elemento.scrollIntoView({ behavior: "smooth" });
    }
  };

    // Mapear itens do estoque 
  function mapEstoque(e: any) {
    return {
      id: e.id,
      quantidade: e.quantidade,
      produto_id: e.produtoResponseDTO.id,
      produto: e.produtoResponseDTO.nome,
      preco: e.produtoResponseDTO.preco,
      imagem: e.produtoResponseDTO.imagem,
      categoria: e.produtoResponseDTO.categoriaResponseDTO.nome
    };
  }
  

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
                placeholder="Quantidade Disponível"
                value={formCadastrar.quantidade}
                onChange={(e) =>
                  setFormCadastrar({
                    ...formCadastrar,
                    quantidade: Number(e.target.value),
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
                type="text"
                placeholder="R$ 123,45"
                value={formCadastrar.preco}
                onChange={(e) =>
                  setFormCadastrar({ 
                    ...formCadastrar, 
                    preco: Number(e.target.value)
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
                placeholder="R$ 123,45"
                value={formEditar.preco}
                onChange={(e) =>
                  setFormEditar({ 
                    ...formEditar, 
                    preco: Number(e.target.value) })
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
        <section className={`${styles.card} ${styles.secaoListaCard}`}>
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
                      ({e.produto})
                    </span>
                  </td>
                  <td>
                    {editandoEstoqueId === e.id ? (
                      <input
                        type="number"
                        className={styles.inputGroup}
                        style={{ width: "80px", margin: 0 }}
                        value={e.quantidade}
                        onChange={(ev) =>
                          setFormEstoque({
                            ...formEstoque,
                            quantidade: parseInt(ev.target.value),
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
                        Alterar Quantidade
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

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
                <th>ID</th>
                <th>Categoria</th>
              </tr>
            </thead>
            <tbody>
              {categorias.length > 0 ? (
                categorias.map((categoria) => (
                  <tr key={categoria.id}>
                    <td>#{categoria.id}</td>
                    <td>{categoria.nome}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} style={{ textAlign: "center", color: "#757575" }}>
                    Nenhuma categoria encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

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
                <th>Cidade</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c, index) => (
                <tr key={index}>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>
                    {c.address.city} - {c.address.state}
                  </td>
                  <td>
                    <button
                      onClick={() => setClienteSelecionado(c)}
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
                  .reduce((acc, p) => acc + parseFloat(p.valor_total), 0)
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
                setPedidos(pedidos.filter((p) => p.status === "Pendente"))
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
                  <td>{p.nome_cliente}</td>
                  <td>
                    <div style={{ textAlign: "left", fontSize: "12px" }}>
                      {p.itens ? (
                        p.itens.map((item: any, idx: number) => (
                          <div key={idx}>
                            {item.quantidade}x {item.nome}
                          </div>
                        ))
                      ) : (
                        <span style={{ color: "#999", fontStyle: "italic" }}>
                          Pedido antigo (sem itens)
                        </span>
                      )}
                    </div>
                  </td>
                  <td
                    style={{
                      fontWeight: "bold",
                      color:
                        p.status === "Pendente"
                          ? "#FF7A00"
                          : p.status === "Cancelado"
                            ? "#f44336"
                            : "green",
                    }}
                  >
                    {p.status}
                  </td>
                  <td>R$ {p.valor_total}</td>
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
                  const filtrados = pedidos.filter((p) =>
                    p.nome_cliente
                      .toLowerCase()
                      .includes(termoBusca.toLowerCase()),
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

      {clienteSelecionado && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalConteudo}>
            <img
              src="/icone-GB.png"
              alt="GeekBay"
              className={styles.logoCard}
            />
            <h3>Endereço de {clienteSelecionado.name}</h3>
            <div
              style={{ textAlign: "left", margin: "15px 0", fontSize: "14px" }}
            >
              <p>
                <strong>Rua:</strong> {clienteSelecionado.address.street},{" "}
                {clienteSelecionado.address.number}
              </p>
              <p>
                <strong>Bairro:</strong>{" "}
                {clienteSelecionado.address.neighborhood}
              </p>
              <p>
                <strong>Cidade/UF:</strong> {clienteSelecionado.address.city}/
                {clienteSelecionado.address.state}
              </p>
              <p>
                <strong>CEP:</strong> {clienteSelecionado.address.zip_code}
              </p>
              <p>
                <strong>Obs:</strong> {clienteSelecionado.address.complement}
              </p>
            </div>
            <button
              className={styles.btnAcao}
              onClick={() => setClienteSelecionado(null)}
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
