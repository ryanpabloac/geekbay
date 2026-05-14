"use client";

import { useState, useEffect } from "react";
import styles from "../../styles/Home.module.css";
import Link from "next/link";

export default function FinalizarCompra() {
  const getAuthHeaders = (extra: Record<string, string> = {}) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("jwt_token") : null;
    const base: Record<string, string> = { Accept: "application/json", ...extra };
    if (token) base.Authorization = `Bearer ${token}`;
    return base;
  };

  const [itensCarrinho, setItensCarrinho] = useState<any[]>([]);
  const [carrinhoId, setCarrinhoId] = useState<number | null>(null);
  const [valorTotalCarrinho, setValorTotalCarrinho] = useState(0);
  const [produtoSelecionado, setProdutoSelecionado] = useState<any>(null);
  const [imagemProdutoSelecionado, setImagemProdutoSelecionado] = useState<string | null>(null);
  const [carregandoImagem, setCarregandoImagem] = useState(false);

  const [cep, setCep] = useState("");
  const aplicarMascaraCEP = (valor: string) => {
    return valor.replace(/\D/g, "").replace(/^(\d{5})(\d)/, "$1-$2").substring(0, 9);
  };

  const [mostrarAgradecimento, setMostrarAgradecimento] = useState(false);
  const [valorFrete, setValorFrete] = useState(0);
  const [erroCEP, setErroCEP] = useState(false);
  const [etapaPagamento, setEtapaPagamento] = useState(false);
  const [dadosCliente, setDadosCliente] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);
  const [enderecoFrete, setEnderecoFrete] = useState<any>(null);

  const [metodoPagamento, setMetodoPagamento] = useState<"Pix" | "Cartao">("Pix");

  useEffect(() => {
    document.body.style.backgroundImage = 'url("./bg-GeekBay.png")';
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundColor = "#000";

    const carregarDados = async () => {
      try {
        setCarregando(true);

        let emailArmazenado = localStorage.getItem("usuario_email");
        if (!emailArmazenado) {
          const usuarioSalvo = localStorage.getItem("usuario_logado");
          if (usuarioSalvo) {
            try {
              const parsed = JSON.parse(usuarioSalvo);
              emailArmazenado = parsed.email || parsed.usuario || parsed.mail || parsed.username;
            } catch (err) {
              console.error("Erro ao parsear usuario_logado", err);
            }
          }
        }

        if (!emailArmazenado) {
          const token = localStorage.getItem("jwt_token");
          if (token) {
            try {
              const payload = JSON.parse(atob(token.split(".")[1]));
              emailArmazenado = payload.email || payload.sub || payload.username;
            } catch (err) {
              console.error("Erro ao extrair email do token", err);
            }
          }
        }

        if (!emailArmazenado) {
          console.error("Email não encontrado no localStorage");
          setCarregando(false);
          return;
        }

        const resUsuario = await fetch(
          `http://localhost:8080/api/usuarios/email/${encodeURIComponent(emailArmazenado)}`,
          { headers: getAuthHeaders() }
        );

        if (!resUsuario.ok) {
          throw new Error("Erro ao buscar usuário");
        }

        const usuario = await resUsuario.json();
        setDadosCliente(usuario);

        const resCarrinho = await fetch(`http://localhost:8080/api/carrinho/${usuario.id}`, {
          headers: getAuthHeaders(),
        });

        if (!resCarrinho.ok) {
          throw new Error("Erro ao buscar carrinho");
        }

        const carrinho = await resCarrinho.json();
        setCarrinhoId(carrinho.id);
        // Marcar itens da API com fromApi: true
        const itensComMarcacao = (carrinho.itens || []).map((item: any) => ({
            ...item,
            fromApi: true,
        }));
        setItensCarrinho(itensComMarcacao);
        setValorTotalCarrinho(carrinho.valorTotal || 0);
        setValorFrete(carrinho.valorFrete || 0);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();

    return () => {
      document.body.style.backgroundImage = "";
      document.body.style.backgroundColor = "";
    };
  }, []);

  const alterarQuantidade = (itemPedidoId: number, tipo: "aumentar" | "diminuir") => {
    const item = itensCarrinho.find(i => i.id === itemPedidoId);
    if (!item) return;

    const quantidadeAtual = item.quantidade || 1;
    const novaQuantidade =
      tipo === "aumentar"
        ? quantidadeAtual + 1
        : quantidadeAtual > 1
          ? quantidadeAtual - 1
          : 1;

    // Atualizar localmente
    const novaLista = itensCarrinho.map((i) =>
      i.id === itemPedidoId ? { ...i, quantidade: novaQuantidade } : i
    );
    setItensCarrinho(novaLista);
    // Recalcular o total localmente usando a nova lista
    const novoSubtotal = novaLista.reduce((acc, it) => acc + (it.produto?.preco || 0) * (it.quantidade || 1), 0);
    setValorTotalCarrinho(novoSubtotal);

    // Se é item da API (tem dadosCliente), fazer PATCH
    if (dadosCliente?.id) {
      fetch('http://localhost:8080/api/carrinho', {
        method: 'PATCH',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ usuarioId: dadosCliente.id, itemPedidoId: itemPedidoId, quantidade: novaQuantidade }),
      })
        .then((response) => {
          if (!response.ok) {
            console.error('Erro ao atualizar quantidade:', response.status);
          }
        })
        .catch((error) => {
          console.error('Erro ao fazer PATCH:', error);
        });
    }
  };

  const calcularSubtotal = () => {
    return itensCarrinho.reduce((acc, item) => acc + (item.produto?.preco || 0) * (item.quantidade || 1), 0);
  };

  // Sempre recalcule o subtotal localmente quando a lista de itens mudar
  useEffect(() => {
    const subtotal = calcularSubtotal();
    setValorTotalCarrinho(subtotal);
  }, [itensCarrinho]);

  const lidarComCalculoFrete = () => {
    const consultarCep = async () => {
      const cepLimpo = cep.replace(/\D/g, "");

      if (cepLimpo.length !== 8) {
        setErroCEP(true);
        return;
      }

      try {
        setErroCEP(false);
        const response = await fetch(`http://localhost:8080/api/enderecos/cep/${cepLimpo}`, {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar endereço pelo CEP");
        }

        const endereco = await response.json();
        setEnderecoFrete(endereco);
      } catch (error) {
        console.error("Erro ao consultar CEP:", error);
        setErroCEP(true);
        setEnderecoFrete(null);
      }
    };

    consultarCep();
  };

  const removerItemDoCheckout = (itemId: number) => {
    const usuarioId = dadosCliente?.id;

    if (!usuarioId) {
      console.error("Usuário não encontrado para excluir item do carrinho");
      return;
    }

    fetch("http://localhost:8080/api/carrinho", {
      method: "DELETE",
      headers: getAuthHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ usuarioId, itemId }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao excluir item do carrinho");
        }

        const novaLista = itensCarrinho.filter((item) => item.id !== itemId);
        setItensCarrinho(novaLista);
        // Recalcular o total localmente após remoção
        const novoSubtotal = novaLista.reduce((acc, it) => acc + (it.produto?.preco || 0) * (it.quantidade || 1), 0);
        setValorTotalCarrinho(novoSubtotal);
      })
      .catch((error) => {
        console.error("Erro ao remover item do carrinho:", error);
      });
  };

  const abrirDetalhesProduto = async (produto: any) => {
    setProdutoSelecionado(produto);
    setImagemProdutoSelecionado(null);

    if (!produto?.imagem) return;

    try {
      setCarregandoImagem(true);
      const response = await fetch(`http://localhost:8080/image/${encodeURIComponent(produto.imagem)}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Erro ao carregar imagem do produto");
      }

      const blob = await response.blob();
      setImagemProdutoSelecionado(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Erro ao buscar imagem do produto:", error);
    } finally {
      setCarregandoImagem(false);
    }
  };

  const fecharDetalhesProduto = () => {
    if (imagemProdutoSelecionado) {
      URL.revokeObjectURL(imagemProdutoSelecionado);
    }
    setProdutoSelecionado(null);
    setImagemProdutoSelecionado(null);
    setCarregandoImagem(false);
  };

  const confirmarCompra = async () => {
    if (!metodoPagamento || !dadosCliente) return;

    const token = localStorage.getItem('jwt_token');
    if (!token) {
      console.error('Token JWT não encontrado');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/carrinho/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          usuarioId: dadosCliente.id
        }),
      });

      if (response.ok) {
        setItensCarrinho([]);
        setValorTotalCarrinho(0);
        setMostrarAgradecimento(true);
      } else {
        console.error('Erro ao processar checkout:', response.status);
      }
    } catch (error) {
      console.error('Erro ao processar compra:', error);
    }
  };

  return (
    <div className={styles.corpo} style={{ backgroundColor: "rgba(0, 0, 0, 0.75)", minHeight: "100vh" }}>
      <header className={styles.cabecalho}>
        <img src="/icone-GB.png" alt="Logo" className={styles.logo} />
        <h1 className={styles.nomeCabecalho}>GeekBay Store</h1>
        <div style={{ marginLeft: "auto" }}>
          <Link href="/loja" style={{ textDecoration: "none", color: "#ff7004" }}>
            Voltar
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: "900px", margin: "0 auto", width: "100%", padding: "20px" }}>
        {!etapaPagamento ? (
          <>
            <h2 style={{ color: "#FF7A00", textAlign: "center", margin: "30px 0", textTransform: "uppercase" }}>
              Este é o seu carrinho de compras
            </h2>

            {itensCarrinho.length === 0 ? (
              <div style={{ textAlign: "center", padding: "50px", backgroundColor: "#fff", borderRadius: "15px", border: "2px dashed #FF7A00" }}>
                <img src="/icone-GB.png" alt="Vazio" style={{ width: "80px", opacity: 0.5 }} />
                <h3 style={{ color: "#666", marginTop: "20px" }}>O multiverso está vazio...</h3>
                <Link href="/loja" className={styles.btnAcao} style={{ display: "inline-block", marginTop: "20px", textDecoration: "none" }}>
                  VOLTAR PARA A LOJA
                </Link>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {itensCarrinho.map((item, index) => (
                    <div
                      key={item.id || index}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "auto 1fr auto auto",
                        alignItems: "center",
                        backgroundColor: "#fff",
                        borderRadius: "15px",
                        border: "2px solid #FF7A00",
                        padding: "15px",
                        gap: "20px",
                        position: "relative",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => abrirDetalhesProduto(item.produto)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "60px",
                          height: "60px",
                          background: "none",
                          border: "none",
                          padding: 0,
                          cursor: "pointer",
                        }}
                        aria-label={`Ver detalhes de ${item.produto.nome}`}
                      >
                        <img src="/icone-GB.png" alt="Logo GeekBay" style={{ width: "60px", height: "60px", objectFit: "contain" }} />
                      </button>

                      <div style={{ minWidth: 0 }}>
                        <h3 style={{ fontSize: "18px", marginBottom: "5px" }}>
                          {item.produto.nome}
                          <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
                            Categoria: {item.produto.categoriaResponseDTO.nome}
                          </div>
                        </h3>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", minWidth: "120px" }}>
                        <button
                          onClick={() => alterarQuantidade(item.id, "diminuir")}
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "6px",
                            border: "2px solid #FF7A00",
                            background: "white",
                            cursor: "pointer",
                            fontWeight: "bold",
                          }}
                        >
                          -
                        </button>
                        <span style={{ fontSize: "16px", fontWeight: "bold", minWidth: "20px", textAlign: "center" }}>{item.quantidade || 1}</span>
                        <button
                          onClick={() => alterarQuantidade(item.id, "aumentar")}
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "6px",
                            border: "2px solid #FF7A00",
                            background: "#FF7A00",
                            color: "white",
                            cursor: "pointer",
                            fontWeight: "bold",
                          }}
                        >
                          +
                        </button>
                      </div>

                      <div style={{ textAlign: "center", minWidth: "110px" }}>
                        <span style={{ fontWeight: "bold", fontSize: "20px" }}>
                          R$ {(item.produto.preco * (item.quantidade || 1)).toFixed(2)}
                        </span>
                      </div>

                      <button
                        onClick={() => removerItemDoCheckout(item.id)}
                        style={{
                          position: "absolute",
                          top: "12px",
                          right: "12px",
                          background: "none",
                          border: "none",
                          color: "#FF7A00",
                          cursor: "pointer",
                          fontSize: "18px",
                        }}
                        aria-label={`Excluir ${item.produto.nome}`}
                      >
                        ❌
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: "30px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", backgroundColor: "#fff", padding: "25px", borderRadius: "15px", border: "2px solid #FF7A00" }}>
                  <div>
                    <p style={{ fontWeight: "bold" }}>Vamos calcular o frete?</p>
                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                      <input
                        type="text"
                        placeholder="00000-000"
                        value={cep}
                        onChange={(e) => setCep(aplicarMascaraCEP(e.target.value))}
                        style={{ padding: "10px", borderRadius: "10px", border: "1px solid #ccc", flex: 1 }}
                      />
                      <button className={styles.btnAcao} style={{ margin: 0 }} onClick={lidarComCalculoFrete}>
                        Calcular
                      </button>
                    </div>
                    <img src="/balao-Frete.png" alt="Mascote" style={{ width: "250px", marginTop: "20px" }} />
                  </div>

                  <div style={{ borderLeft: "1px solid #ddd", paddingLeft: "20px" }}>
                    {enderecoFrete ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px" }}>
                        <p style={{ margin: 0 }}><strong>Estado:</strong> {enderecoFrete.state || "-"}</p>
                        <p style={{ margin: 0 }}><strong>Cidade:</strong> {enderecoFrete.city || "-"}</p>
                        <p style={{ margin: 0 }}><strong>Bairro:</strong> {enderecoFrete.neighborhood || "-"}</p>
                        <p style={{ margin: 0 }}><strong>Rua:</strong> {enderecoFrete.street || "-"}</p>
                        <h3 style={{ fontSize: "18px", textAlign: "center", marginTop: "20px", marginBottom: "10px" }}>
                          FRETE: R$ {valorFrete.toFixed(2)}
                        </h3>
                        <h3 style={{ fontSize: "18px", textAlign: "center" }}>
                          TOTAL: R$ {(valorTotalCarrinho + valorFrete).toFixed(2)}
                        </h3>
                      </div>
                    ) : (
                      <>
                        <p style={{ marginTop: "15px", color: "#666" }}>Digite o CEP para consultar as informações do frete.</p>
                        <div style={{ marginTop: "70px", textAlign: "right" }}>
                          <h3 style={{ fontSize: "18px", textAlign: "center" }}>
                            TOTAL: R$ {valorTotalCarrinho.toFixed(2)}
                          </h3>
                        </div>
                      </>
                    )}
                    {enderecoFrete && (
                      <div style={{ marginTop: "30px", textAlign: "right" }}>
                        <button className={styles.btnAcao} style={{ width: "100%", marginTop: "20px" }} onClick={() => setEtapaPagamento(true)} disabled={!enderecoFrete}>
                          FINALIZAR COMPRA
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <div style={{ backgroundColor: "#fff", borderRadius: "15px", border: "3px solid #FF7A00", padding: "30px", marginTop: "20px" }}>
            <h2 style={{ color: "#FF7A00", textAlign: "center", marginBottom: "20px" }}>FINALIZAR A COMPRA</h2>

            <div style={{ border: "2px solid #FF7A00", borderRadius: "10px", padding: "15px", marginBottom: "20px", fontFamily: "sans-serif" }}>
              <p><strong>{dadosCliente?.nome || "Carregando nome..."}</strong></p>
              <p style={{ fontSize: "14px" }}>CPF: {dadosCliente?.cpf || "000.000.000-00"} | email: {dadosCliente?.email}</p>
              <p style={{ fontSize: "14px" }}>Endereço: {dadosCliente?.endereco?.rua}, {dadosCliente?.endereco?.numero} - {dadosCliente?.endereco?.bairro} , {dadosCliente?.endereco?.cep}</p>
              <p style={{ fontSize: "14px" }}>{dadosCliente?.endereco?.cidade} / {dadosCliente?.endereco?.estado} | CEP: {dadosCliente?.endereco?.cep}</p>
              <p style={{ fontSize: "14px" }}>Telefone: {dadosCliente?.telefone || "()00000-0000"}</p>
              {dadosCliente?.endereco?.complemento && <p style={{ fontSize: "12px", color: "#666" }}>Obs: {dadosCliente.endereco.complemento}</p>}
            </div>

            <div style={{ border: "2px solid #FF7A00", borderRadius: "10px", padding: "20px", marginBottom: "20px", width: "100%", boxSizing: "border-box" }}>
              <div style={{ maxHeight: "250px", overflowY: "auto", paddingRight: "10px" }}>
                {itensCarrinho.map((item, index) => (
                  <div
                    key={item.id || index}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "auto 1fr auto auto",
                      gap: "20px",
                      alignItems: "center",
                      marginBottom: "15px",
                      borderBottom: index !== itensCarrinho.length - 1 ? "1px solid #eee" : "none",
                      paddingBottom: "15px",
                      width: "100%",
                      position: "relative",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => abrirDetalhesProduto(item.produto)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "40px",
                        height: "40px",
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                      }}
                      aria-label={`Ver detalhes de ${item.produto.nome}`}
                    >
                      <img src="/icone-GB.png" alt="Logo GeekBay" style={{ width: "40px", height: "40px", objectFit: "contain" }} />
                    </button>

                    <div style={{ minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: "18px" }}>
                        <strong>{item.produto.nome}</strong>
                        <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                          Categoria: {item.produto.categoriaResponseDTO.nome}
                        </div>
                      </p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", minWidth: "120px" }}>
                      <div style={{ fontSize: "16px", fontWeight: "bold" }}>x{item.quantidade || 1}</div>
                    </div>

                    <div style={{ textAlign: "center", minWidth: "110px" }}>
                      <span style={{ fontWeight: "bold", fontSize: "18px" }}>R$ {(item.produto.preco * (item.quantidade || 1)).toFixed(2)}</span>
                    </div>

                    <button
                      onClick={() => removerItemDoCheckout(item.id)}
                      style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        background: "none",
                        border: "none",
                        color: "#FF7A00",
                        cursor: "pointer",
                        fontSize: "18px",
                      }}
                      aria-label={`Excluir ${item.produto.nome}`}
                    >
                      ❌
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "2px solid #FF7A00", fontSize: "14px", color: "#666", fontFamily: "sans-serif" }}>
                {enderecoFrete ? (
                  <p style={{ margin: 0 }}>
                    <strong>Frete: </strong> R$ {valorFrete.toFixed(2)}
                  </p>
                ) : null}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div style={{ border: "2px solid #FF7A00", borderRadius: "10px", padding: "15px" }}>
                <p style={{ fontWeight: "bold", marginBottom: "15px" }}>Métodos de Pagamento</p>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                  <div style={{ width: "18px", height: "18px", border: "2px solid #FF7A00", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: metodoPagamento === "Pix" ? "#FF7A00" : "transparent" }}>
                    {metodoPagamento === "Pix" && <span style={{ color: "#fff", fontSize: "12px", fontWeight: "bold" }}>X</span>}
                  </div>
                  <div style={{ width: "15px", height: "15px", backgroundColor: "#FF7A00", transform: "rotate(45deg)" }}></div>
                  <span>Pix</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "18px", height: "18px", border: "2px solid #FF7A00", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: metodoPagamento === "Cartao" ? "#FF7A00" : "transparent" }}>
                    {metodoPagamento === "Cartao" && <span style={{ color: "#fff", fontSize: "12px", fontWeight: "bold" }}>X</span>}
                  </div>
                  <span>💳 Cartão de Crédito</span>
                </div>
              </div>

              <div style={{ textAlign: "center" }}>
                <img src="/balao-Finalizar.png" alt="Mascote" style={{ width: "200px" }} />
                <h3 style={{ fontSize: "22px", margin: "15px 0" }}>TOTAL: R$ {(valorTotalCarrinho + valorFrete).toFixed(2)}</h3>
                <button className={styles.btnAcao} style={{ width: "100%" }} onClick={confirmarCompra}>
                  FINALIZAR COMPRA
                </button>
                <button
                  onClick={() => setEtapaPagamento(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#666",
                    cursor: "pointer",
                    marginTop: "10px",
                    textDecoration: "underline",
                  }}
                >
                  Voltar para o Frete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {erroCEP && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalConteudo} style={{ border: "5px solid #FF7A00", textAlign: "center" }}>
            <h2 style={{ color: "#FF7A00" }}>ALERTA: CEP INVÁLIDO!</h2>
            <p>Verifique as coordenadas e tente novamente.</p>
            <button
              className={styles.btnAcao}
              onClick={() => {
                setErroCEP(false);
                setCep("");
                setEnderecoFrete(null);
              }}
            >
              Digitar CEP
            </button>
          </div>
        </div>
      )}

      {mostrarAgradecimento && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalConteudo} style={{ border: "5px solid #FF7A00", textAlign: "center" }}>
            <h2 style={{ color: "#FF7A00", fontFamily: "Orbitron" }}>MISSÃO CUMPRIDA!</h2>
            <img src="/icone-GB.png" alt="Mascote" style={{ width: "100px", marginTop: "20px" }} className={styles.logoPulsante} />
            <p style={{ fontSize: "18px", fontWeight: "bold" }}>Obrigado, Player 1!</p>
            <p>Seu pedido foi processado no multiverso.</p>
            <Link href="/loja" className={styles.btnAcao} style={{ textDecoration: "none", display: "block", marginTop: "20px", fontFamily: "sans-serif", fontSize: "13px" }}>
              Voltar para Homepage
            </Link>
          </div>
        </div>
      )}

      {produtoSelecionado && (
        <div className={styles.modalOverlay} onClick={fecharDetalhesProduto}>
          <div
            className={styles.modalConteudo}
            onClick={(event) => event.stopPropagation()}
            style={{
              maxWidth: "700px",
              width: "90%",
              border: "5px solid #FF7A00",
              textAlign: "left",
              position: "relative",
            }}
          >
            <button
              type="button"
              onClick={fecharDetalhesProduto}
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                background: "none",
                border: "none",
                color: "#FF7A00",
                fontSize: "22px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              ×
            </button>

            <h2 style={{ color: "#FF7A00", marginBottom: "15px", paddingRight: "30px" }}>{produtoSelecionado.nome}</h2>
            <p style={{ marginBottom: "10px", fontFamily: "sans-serif" }}>
              <strong>Categoria:</strong> {produtoSelecionado.categoriaResponseDTO?.nome || "Sem categoria"}
            </p>
            <p style={{ marginBottom: "20px", fontFamily: "sans-serif" }}>
              <strong>Descrição:</strong> {produtoSelecionado.descricao || "Sem descrição"}
            </p>

            <div style={{ minHeight: "220px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #eee", borderRadius: "12px", background: "#fafafa", padding: "15px" }}>
              {carregandoImagem ? (
                <p style={{ margin: 0, color: "#666" }}>Carregando imagem...</p>
              ) : imagemProdutoSelecionado ? (
                <img src={imagemProdutoSelecionado} alt={produtoSelecionado.nome} style={{ maxWidth: "100%", maxHeight: "320px", objectFit: "contain" }} />
              ) : (
                <p style={{ margin: 0, color: "#666" }}>Este produto não possui imagem.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}