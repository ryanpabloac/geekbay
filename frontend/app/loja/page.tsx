"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import styles from "../../styles/Home.module.css";
import Link from "next/link";

type CategoriaDTO = {
    id: number;
    nome: string;
    descricao?: string;
};

type ProdutoDTO = {
    id: number;
    nome: string;
    descricao?: string;
    preco: number | string;
    imagem?: string;
    ativo?: boolean;
    categoriaResponseDTO?: {
        id: number;
        nome: string;
        descricao?: string;
    };
};

type CarrinhoItem = ProdutoDTO & {
    quantidade: number;
};

const corCategoria = (id: number) => {
    const hue = (id * 47) % 360;
    return `hsl(${hue}, 78%, 46%)`;
};

function InfiniteProductsRow({
    produtos,
    onInfo,
    onAdd,
}: {
    produtos: ProdutoDTO[];
    onInfo: (produto: ProdutoDTO) => void;
    onAdd: (produto: ProdutoDTO) => void;
}) {
    const [scrollPausado, setScrollPausado] = useState(false);
    const secaoRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const elemento = secaoRef.current;
        if (!elemento) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                // Quando a seção sair da área visível, retoma a animação automática.
                if (!entry.isIntersecting && scrollPausado) {
                    setScrollPausado(false);
                }
            },
            {
                root: null,
                threshold: 0.2,
            },
        );

        observer.observe(elemento);

        return () => {
            observer.disconnect();
        };
    }, [scrollPausado]);

    if (!produtos.length) {
        return (
            <div style={{ textAlign: "center", color: "#666", padding: "20px" }}>
                Nenhum produto disponivel para esta categoria.
            </div>
        );
    }

    const pausarScrollAoClicarProduto = () => {
        setScrollPausado(true);
    };

    const renderCard = (p: ProdutoDTO, key: string, onClickCard?: () => void) => {
        const cor = corCategoria(p.categoriaResponseDTO?.id || 0);

        return (
            <section
                key={key}
                className={styles.card}
                style={{
                    textAlign: "center",
                    minWidth: "280px",
                    flexShrink: 0,
                    position: "relative",
                    cursor: onClickCard ? "pointer" : "default",
                }}
                onClick={onClickCard}
            >
                <button
                    type="button"
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        cursor: "pointer",
                        border: "none",
                        background: "transparent",
                        padding: 0,
                    }}
                    onClick={(event) => {
                        event.stopPropagation();
                        onInfo(p);
                    }}
                    aria-label={`Ver detalhes de ${p.nome}`}
                >
                    <img
                        src="/info.png"
                        alt="Informacoes"
                        style={{ width: "22px", height: "22px" }}
                    />
                </button>

                <img
                    src={p.imagem || "/icone-GB.png"}
                    alt={p.nome}
                    style={{
                        height: "130px",
                        objectFit: "contain",
                        borderRadius: "8px",
                    }}
                />

                <div className={styles.nomeProdutoLinha}>
                    <span
                        className={styles.bolinhaCategoriaProduto}
                        style={{ backgroundColor: cor }}
                    />
                    <h3 style={{ marginTop: "15px", fontSize: "16px" }}>{p.nome}</h3>
                </div>

                <p style={{ color: cor, fontSize: "14px" }}>
                    {p.categoriaResponseDTO?.nome || "Sem categoria"}
                </p>
                <p
                    style={{
                        fontSize: "22px",
                        fontWeight: "bold",
                        color: "#ff7a00",
                    }}
                >
                    R$ {Number(p.preco || 0).toFixed(2)}
                </p>
                <button
                    className={styles.btnAcao}
                    style={{ width: "100%", marginTop: "10px" }}
                    onClick={(event) => {
                        event.stopPropagation();
                        onAdd(p);
                    }}
                >
                    Adicionar ao Inventario
                </button>
            </section>
        );
    };

    // Evita duplicidade visual quando a categoria possui poucos itens.
    const deveAnimarLoop = produtos.length > 2;
    const itens = scrollPausado
        ? produtos
        : deveAnimarLoop
            ? [...produtos, ...produtos]
            : produtos;

    return (
        <div
            ref={secaoRef}
            style={{
                overflowX: scrollPausado || !deveAnimarLoop ? "auto" : "hidden",
                overflowY: "hidden",
                width: "100%",
            }}
        >
            <div
                style={{
                    display: "flex",
                    gap: "20px",
                    width: "max-content",
                    animation: !scrollPausado && deveAnimarLoop
                        ? "scroll-horizontal 36s linear infinite"
                        : "none",
                }}
            >
                {itens.map((p, idx) =>
                    renderCard(
                        p,
                        `${p.id}-${idx}`,
                        () => pausarScrollAoClicarProduto(),
                    ),
                )}
            </div>
        </div>
    );
}

export default function Loja() {
    const [categorias, setCategorias] = useState<CategoriaDTO[]>([]);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>("todas");
    const [produtosPorCategoria, setProdutosPorCategoria] = useState<Record<number, ProdutoDTO[]>>({});
    const [produtoInfo, setProdutoInfo] = useState<ProdutoDTO | null>(null);
    const [produtoParaAdicionar, setProdutoParaAdicionar] = useState<ProdutoDTO | null>(null);
    const [quantidadeAdicionar, setQuantidadeAdicionar] = useState(1);
    const [notificacaoTopo, setNotificacaoTopo] = useState("");
    const [carrinho, setCarrinho] = useState<CarrinhoItem[]>([]);
    const [mostrarCarrinho, setMostrarCarrinho] = useState(false);
    const [mostrarIntro, setMostrarIntro] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        listarCategorias();

        const carrinhoSalvo = localStorage.getItem("geekbay_cart");
        if (carrinhoSalvo) {
            try {
                const parsed = JSON.parse(carrinhoSalvo);
                if (Array.isArray(parsed)) setCarrinho(parsed);
            } catch {
                localStorage.removeItem("geekbay_cart");
            }
        }

        document.body.style.backgroundImage = 'url("/bg-GeekBay.png")';
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundAttachment = "fixed";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundColor = "#000";

        return () => {
            document.body.style.backgroundImage = "";
            document.body.style.backgroundSize = "";
            document.body.style.backgroundAttachment = "";
            document.body.style.backgroundPosition = "";
            document.body.style.backgroundColor = "";
        };
    }, []);

    useEffect(() => {
        if (!notificacaoTopo) return;
        const timer = setTimeout(() => setNotificacaoTopo(""), 2800);
        return () => clearTimeout(timer);
    }, [notificacaoTopo]);

    useEffect(() => {
        if (!categorias.length) return;

        const listarProdutosPorCategoria = async () => {
            try {
                if (categoriaSelecionada === "todas") {
                    const mapa: Record<number, ProdutoDTO[]> = {};

                    const response = await fetch("http://localhost:8080/api/produto");
                    if (!response.ok) throw new Error("Falha ao carregar produtos");
                    const dados = await response.json();
                    const produtos = Array.isArray(dados) ? (dados as ProdutoDTO[]) : [];

                    categorias.forEach((categoria) => {
                        mapa[categoria.id] = [];
                    });

                    produtos.forEach((produto) => {
                        const categoriaId = produto.categoriaResponseDTO?.id;
                        if (!categoriaId) return;
                        if (!mapa[categoriaId]) mapa[categoriaId] = [];
                        mapa[categoriaId].push(produto);
                    });

                    setProdutosPorCategoria(mapa);
                    return;
                }

                const categoriaId = Number(categoriaSelecionada);
                const response = await fetch(
                    `http://localhost:8080/api/produto/categoria/${categoriaId}`,
                );
                if (!response.ok) throw new Error("Falha ao carregar produtos da categoria");
                const dados = await response.json();

                setProdutosPorCategoria({
                    [categoriaId]: Array.isArray(dados) ? (dados as ProdutoDTO[]) : [],
                });
            } catch (error) {
                console.error("Erro ao carregar produtos por categoria:", error);
                setProdutosPorCategoria({});
            }
        };

        listarProdutosPorCategoria();
    }, [categoriaSelecionada, categorias]);

    const categoriasVisiveis = useMemo(() => {
        if (categoriaSelecionada === "todas") {
            return categorias.filter(
                (categoria) => (produtosPorCategoria[categoria.id] || []).length > 0,
            );
        }
        const selecionada = categorias.find((c) => String(c.id) === categoriaSelecionada);
        return selecionada ? [selecionada] : [];
    }, [categoriaSelecionada, categorias, produtosPorCategoria]);

    const listarCategorias = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/categoria");
            if (!response.ok) throw new Error("Falha ao carregar categorias");
            const dados = await response.json();
            setCategorias(Array.isArray(dados) ? (dados as CategoriaDTO[]) : []);
        } catch (error) {
            console.error("Erro ao carregar categorias:", error);
            setCategorias([]);
        }
    };

    const alternarSom = () => {
        if (videoRef.current) {
            const novoEstadoMuto = !videoRef.current.muted;
            videoRef.current.muted = novoEstadoMuto;
            setIsMuted(novoEstadoMuto);
        }
    };

    // --- FUNÇÕES DO CARRINHO ---

    const adicionarAoCarrinho = (produto: ProdutoDTO, quantidade = 1) => {
        setCarrinho((carrinhoAtual) => {
            let novoCarrinho;
            const itemExistente = carrinhoAtual.find((item) => item.id === produto.id);

            if (itemExistente) {
                novoCarrinho = carrinhoAtual.map((item) =>
                    item.id === produto.id
                        ? { ...item, quantidade: (item.quantidade || 1) + quantidade }
                        : item
                );
            } else {
                novoCarrinho = [...carrinhoAtual, { ...produto, quantidade }];
            }

            localStorage.setItem("geekbay_cart", JSON.stringify(novoCarrinho));
            return novoCarrinho;
        });
    };

    const abrirConfirmacaoAdicao = (produto: ProdutoDTO) => {
        setProdutoParaAdicionar(produto);
        setQuantidadeAdicionar(1);
    };

    const confirmarAdicaoAoCarrinho = () => {
        if (!produtoParaAdicionar) return;

        const quantidade = Math.max(1, Number(quantidadeAdicionar) || 1);
        adicionarAoCarrinho(produtoParaAdicionar, quantidade);
        setNotificacaoTopo(`${produtoParaAdicionar.nome} adicionado ao carrinho.`);
        setProdutoParaAdicionar(null);
        setQuantidadeAdicionar(1);
    };

    const removerDoCarrinho = (produtoId: number) => {
        setCarrinho((carrinhoAtual) => {
            const novoCarrinho = carrinhoAtual.filter((item) => item.id !== produtoId);
            localStorage.setItem("geekbay_cart", JSON.stringify(novoCarrinho));
            return novoCarrinho;
        });
    };

    const alterarQuantidadeCarrinho = (produtoId: number, novaQuantidade: number) => {
        if (novaQuantidade <= 0) {
            removerDoCarrinho(produtoId);
            return;
        }

        setCarrinho((carrinhoAtual) => {
            const novoCarrinho = carrinhoAtual.map((item) =>
                item.id === produtoId ? { ...item, quantidade: novaQuantidade } : item,
            );
            localStorage.setItem("geekbay_cart", JSON.stringify(novoCarrinho));
            return novoCarrinho;
        });
    };

    const calcularTotal = () => {
        return carrinho.reduce((acc, item) => {
            const precoNormalizado = String(item.preco ?? "0").replace(",", ".");
            const precoLimpo = Number(precoNormalizado) || 0;
            return acc + ((Number(precoLimpo) || 0) * (item.quantidade || 1));
        }, 0);
    };

    return (
        <>

            {mostrarIntro && (
                <div className={styles.introOverlay}>
                    <video
                        className={styles.videoIntro}
                        autoPlay
                        muted={isMuted}
                        ref={videoRef}
                        onEnded={() => setMostrarIntro(false)}
                        style={{ width: '50%' }}
                    >
                        <source src="/intro-GeekBay (1).mp4" type="video/mp4" />
                        Seu navegador não suporta vídeos.
                    </video>

                    <button onClick={alternarSom} className={styles.btnAcao} style={{ position: 'absolute', top: '20px', right: '20px', width: '60px', height: '60px', borderRadius: '50%', zIndex: 10002 }}>
                        {isMuted ? '🔇' : '🔊'}
                    </button>

                    <button className={styles.btnAcao} style={{ position: 'absolute', bottom: '20px', right: '20px', width: 'auto' }} onClick={() => setMostrarIntro(false)}>
                        Pular Intro
                    </button>
                </div>
            )}

            <div className={styles.corpo} style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', minHeight: '100vh', filter: mostrarIntro ? 'blur(10px)' : 'none', transition: 'filter 0.5s ease' }}>
                {notificacaoTopo && (
                    <div
                        style={{
                            position: "fixed",
                            top: "15px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            backgroundColor: "#1f7a1f",
                            color: "#fff",
                            padding: "12px 20px",
                            borderRadius: "10px",
                            zIndex: 10020,
                            boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
                            fontWeight: "bold",
                        }}
                    >
                        {notificacaoTopo}
                    </div>
                )}

                <header className={styles.cabecalho}>
                    <img src='/icone-GB.png' alt="Logo" className={styles.logo} />

                    <h1 className={styles.nomeCabecalho}>GeekBay Store</h1>

                    <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>

                        <select
                            value={categoriaSelecionada}
                            onChange={(e) => setCategoriaSelecionada(e.target.value)}
                            style={{
                                padding: '8px',
                                borderRadius: '8px',
                                border: '2px solid #FF7A00',
                                backgroundColor: '#000',
                                color: '#FF7A00',
                                fontWeight: 'bold',
                                marginLeft: '120px'
                            }}
                        >
                            <option value="todas">Todas Categorias</option>
                            {categorias.map((categoria) => (
                                <option key={categoria.id} value={String(categoria.id)}>
                                    {categoria.nome}
                                </option>
                            ))}
                        </select>

                        <Link href="/login" style={{ textDecoration: 'none', color: '#ff7004' }}>
                            Login
                        </Link>

                        <button onClick={() => setMostrarCarrinho(true)} className={styles.btnAcaoCarrinho}>
                            <img src="/carrinhoGB.png" alt="carrinho" style={{ width: '20px' }} />
                            ({carrinho.reduce((acc, i) => acc + (i.quantidade || 1), 0)})
                        </button>

                    </div>
                </header>


                <main className={styles.mainContainer}>
                    <h2 style={{ color: 'black', textAlign: 'center', marginTop: '30px', fontSize: '35px', fontWeight: '600', textShadow: '-1px -1px 0 #ff7004, 1px -1px 0 #ff7004, -1px 1px 0 #ff7004, 1px 1px 0 #ff7004' }}> Explore o Multiverso Geek ! </h2>
                    <div className={styles.listaCategoriasProdutos}>
                        {categoriasVisiveis.map((categoria) => (
                            <section key={categoria.id} className={styles.secaoCategoriaProdutos}>
                                <div
                                    className={styles.cabecalhoCategoria}
                                    style={{ borderColor: corCategoria(categoria.id) }}
                                >
                                    <span
                                        className={styles.bolinhaCategoria}
                                        style={{ backgroundColor: corCategoria(categoria.id) }}
                                    />
                                    <h3 className={styles.tituloCategoria}>{categoria.nome}</h3>
                                </div>

                                <InfiniteProductsRow
                                    produtos={produtosPorCategoria[categoria.id] || []}
                                    onInfo={setProdutoInfo}
                                    onAdd={abrirConfirmacaoAdicao}
                                />
                            </section>
                        ))}
                    </div>
                </main>


                {mostrarCarrinho && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalConteudo} style={{ maxWidth: '600px' }}>
                            <h3 style={{ color: '#ff7a00', fontSize: '24px' }}>Seu Inventário</h3>
                            {carrinho.length === 0 ? <p>O multiverso está vazio...</p> : (
                                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    <table className={styles.tabelaContainer} style={{ width: '100%', background: '#fff' }}>
                                        <thead style={{ background: '#fff' }}>
                                            <tr>
                                                <th>Item</th>
                                                <th>Quantidade</th>
                                                <th>Preço</th>
                                                <th>Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {carrinho.map((item, index) => (
                                                <tr key={item.id || index}>
                                                    <td>{item.nome}</td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            min={1}
                                                            value={item.quantidade}
                                                            onChange={(e) =>
                                                                alterarQuantidadeCarrinho(
                                                                    item.id,
                                                                    Math.max(1, Number(e.target.value) || 1),
                                                                )
                                                            }
                                                            style={{ width: "70px", padding: "4px" }}
                                                        />
                                                    </td>
                                                    <td>R$ {Number(item.preco || 0).toFixed(2)}</td>
                                                    <td>
                                                        <button
                                                            className={styles.btnAcao}
                                                            style={{
                                                                backgroundColor: "#d32f2f",
                                                                padding: "6px 10px",
                                                                width: "auto",
                                                            }}
                                                            onClick={() => removerDoCarrinho(item.id)}
                                                        >
                                                            Remover
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                                <strong>Total: R$ {calcularTotal().toFixed(2)}</strong>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button className={styles.btnAcao} onClick={() => setMostrarCarrinho(false)}>Continuar</button>
                                <Link href="/finalizarCompra" className={styles.btnAcao} style={{ textDecoration: 'none', textAlign: 'center', fontFamily: 'sans-serif', fontSize: '13px', fontWeight: 'bold' }}>Finalizar</Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {produtoInfo && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalConteudo} style={{ maxWidth: "500px" }}>
                        <h3 style={{ color: "#ff7a00" }}>{produtoInfo.nome}</h3>

                        <img
                            src={produtoInfo.imagem || '/icone-GB.png'}
                            alt={produtoInfo.nome}
                            style={{ width: "100%", height: "200px", objectFit: "contain" }}
                        />

                        <p style={{ marginTop: "15px" }}>
                            {produtoInfo.descricao}
                        </p>

                        <p style={{ fontWeight: "bold", fontSize: "20px", color: "#ff7a00" }}>
                            R$ {produtoInfo.preco}
                        </p>

                        <button
                            className={styles.btnAcao}
                            style={{ marginTop: "15px", width: "100%" }}
                            onClick={() => setProdutoInfo(null)}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}

            {produtoParaAdicionar && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalConteudo} style={{ maxWidth: "500px" }}>
                        <h3 style={{ color: "#ff7a00" }}>Confirmar adição ao carrinho</h3>

                        <img
                            src={produtoParaAdicionar.imagem || "/icone-GB.png"}
                            alt={produtoParaAdicionar.nome}
                            style={{ width: "100%", height: "180px", objectFit: "contain" }}
                        />

                        <p style={{ marginTop: "12px", fontSize: "18px", fontWeight: 700 }}>
                            {produtoParaAdicionar.nome}
                        </p>
                        <p style={{ color: "#ff7a00", fontWeight: "bold", fontSize: "22px" }}>
                            R$ {Number(produtoParaAdicionar.preco || 0).toFixed(2)}
                        </p>

                        <div style={{ marginTop: "10px", textAlign: "left" }}>
                            <label htmlFor="qtd-add-carrinho" style={{ fontWeight: 600 }}>
                                Quantidade
                            </label>
                            <input
                                id="qtd-add-carrinho"
                                type="number"
                                min={1}
                                value={quantidadeAdicionar}
                                onChange={(e) => setQuantidadeAdicionar(Math.max(1, Number(e.target.value) || 1))}
                                style={{ width: "100%", marginTop: "8px", padding: "10px" }}
                            />
                        </div>

                        <p style={{ marginTop: "15px" }}>
                            Deseja adicionar este produto ao seu carrinho?
                        </p>

                        <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                            <button className={styles.btnAcao} onClick={confirmarAdicaoAoCarrinho}>
                                Confirmar
                            </button>
                            <button
                                className={styles.btnAcao}
                                style={{ backgroundColor: "#777" }}
                                onClick={() => {
                                    setProdutoParaAdicionar(null);
                                    setQuantidadeAdicionar(1);
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes scroll-horizontal {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
            `}</style>


        </>

    );
}













