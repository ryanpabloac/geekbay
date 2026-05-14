"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../styles/Home.module.css';
import Link from 'next/link';

const corPadraoCategoria = '#9aa0a6';

const paletaCores = [
    '#FF7A00', // Laranja vibrante (GeekBay)
    '#E91E63', // Rosa
    '#9C27B0', // Roxo
    '#3F51B5', // Azul índigo
    '#00BCD4', // Cyan
    '#00AB44', // Verde
    '#FFEB3B', // Amarelo
    '#FF5722', // Orange vermelho
    '#795548', // Marrom
    '#607D8B', // Azul cinzento
    '#E53935', // Vermelho
    '#7E57C2', // Lilás
];

const normalizarTexto = (texto?: string) =>
    (texto || '')
        .toLowerCase()
        .trim();

const obterImagemProduto = (imagem?: string | null) => {
    if (!imagem) return '/icone-GB.png';
    // A API expõe imagens em /image/{UUID}
    return `http://localhost:8080/image/${imagem}`;
};

const gerarCorCategoria = (indiceOuValor: string | number) => {
    const indice = typeof indiceOuValor === 'number' 
        ? indiceOuValor 
        : parseInt(String(indiceOuValor), 10);
    return paletaCores[(isNaN(indice) ? 0 : indice) % paletaCores.length];
};

type CategoriaAgrupada = {
    key: string;
    label: string;
    color: string;
    produtos: any[];
};

type CategoriaFiltro = {
    key: string;
    label: string;
    color: string;
};

type CategoriaAPI = {
    id: number;
    nome: string;
    descricao?: string;
    key: string;
    label: string;
    color: string;
};

type ProdutoCategoriaDTO = {
    id: number;
    nome: string;
    descricao?: string;
    preco: number | string;
    imagem?: string | null;
    ativo?: boolean;
    categoriaResponseDTO?: {
        id: number;
        nome: string;
        descricao?: string;
    };
};

type EstoqueResponseDTO = {
    quantidade: number;
    produtoResponseDTO: ProdutoCategoriaDTO;
};

const extrairNomeCategoria = (estoque: EstoqueResponseDTO) =>
    estoque.produtoResponseDTO?.categoriaResponseDTO?.nome || 'Sem categoria';

const agruparProdutosPorCategoria = (estoques: EstoqueResponseDTO[], categoriasAPI: CategoriaAPI[]): CategoriaAgrupada[] => {
    const agrupados: Record<string, CategoriaAgrupada> = {};

    estoques.forEach((estoque) => {
        const nomeCategoria = extrairNomeCategoria(estoque);
        const nomeCategoriaNormalizado = normalizarTexto(nomeCategoria);
        const categoriaCorrespondente = categoriasAPI.find((categoria) => normalizarTexto(categoria.nome) === nomeCategoriaNormalizado);
        const chaveCategoria = String(categoriaCorrespondente?.id ?? nomeCategoriaNormalizado ?? 'outros');
        const labelCategoria = categoriaCorrespondente?.nome || nomeCategoria;
        const corCategoria = categoriaCorrespondente?.color || gerarCorCategoria(categoriaCorrespondente?.id ?? 0);

        if (!agrupados[chaveCategoria]) {
            agrupados[chaveCategoria] = {
                key: chaveCategoria,
                label: labelCategoria,
                color: corCategoria,
                produtos: [],
            };
        }

        agrupados[chaveCategoria].produtos.push(estoque);
    });

    return Object.values(agrupados);
};

const normalizarItemCarrinhoApi = (item: any) => {
    const produto = item?.produto || item?.produtoResponseDTO || item;
    const produtoId = produto?.id ?? item?.produtoId ?? item?.id;

    return {
        id: item?.id ?? produtoId,
        itemId: item?.id,
        produtoId,
        nome: produto?.nome ?? item?.nome ?? 'Produto',
        descricao: produto?.descricao ?? item?.descricao ?? '',
        preco: produto?.preco ?? item?.preco ?? 0,
        img: obterImagemProduto(produto?.imagem ?? item?.img ?? item?.imagem),
        categoria: produto?.categoriaResponseDTO?.nome ?? item?.categoria ?? 'Sem categoria',
        categoriaResponseDTO: produto?.categoriaResponseDTO ?? item?.categoriaResponseDTO,
        quantidade: item?.quantidade || 1,
        fromApi: true,
        produto,
    };
};

export default function Loja() {
    const getAuthHeaders = (extra: Record<string,string> = {}) => {
        const token = (typeof window !== 'undefined') ? localStorage.getItem('jwt_token') : null;
        const base: Record<string,string> = { Accept: 'application/json', ...extra };
        if (token) base.Authorization = `Bearer ${token}`;
        return base;
    };
    const [categorias, setCategorias] = useState<CategoriaAPI[]>([]);
    const [estoques, setEstoques] = useState<EstoqueResponseDTO[]>([]);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>('todas');
    const [produtoInfo, setProdutoInfo] = useState<ProdutoCategoriaDTO | null>(null);
    const [carrinho, setCarrinho] = useState<any[]>([]);
    const [mostrarCarrinho, setMostrarCarrinho] = useState(false);
    const [mostrarIntro, setMostrarIntro] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const [mostrarModalQuantidade, setMostrarModalQuantidade] = useState(false);
    const [quantidadeSelecionada, setQuantidadeSelecionada] = useState(1);
    const [estoqueEmEdicao, setEstoqueEmEdicao] = useState<EstoqueResponseDTO | null>(null);
    const [notificacao, setNotificacao] = useState<string | null>(null);
    const [isLogged, setIsLogged] = useState(false);
    const [mostrarEnderecoObrigatorio, setMostrarEnderecoObrigatorio] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const router = useRouter();

    const obterUsuarioLogado = async () => {
        let email: string | undefined;

        const usuarioSalvo = localStorage.getItem('usuario_logado');
        if (usuarioSalvo) {
            try {
                const parsed = JSON.parse(usuarioSalvo);
                email = parsed.email || parsed.mail || parsed.username;
            } catch (err) {
                console.error('Erro ao parsear usuario_logado', err);
            }
        }

        if (!email) {
            const token = localStorage.getItem('jwt_token');
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    email = payload.email || payload.sub || payload.username;
                } catch (err) {
                    console.error('Erro ao extrair email do token', err);
                }
            }
        }

        if (!email) {
            return null;
        }

        const resUser = await fetch(`http://localhost:8080/api/usuarios/email/${encodeURIComponent(email)}`, {
            headers: getAuthHeaders(),
        });

        if (!resUser.ok) {
            throw new Error('Falha ao recuperar usuário logado');
        }

        return resUser.json();
    };

    const carregarCarrinhoDaApi = async () => {
        try {
            if (!Boolean(localStorage.getItem('jwt_token'))) {
                return;
            }

            const usuario = await obterUsuarioLogado();
            if (!usuario?.id) {
                return;
            }

            const resCarrinho = await fetch(`http://localhost:8080/api/carrinho/${usuario.id}`, {
                headers: getAuthHeaders(),
            });

            if (!resCarrinho.ok) {
                throw new Error('Falha ao carregar carrinho da API');
            }

            const carrinhoApi = await resCarrinho.json();
            const itensApi = Array.isArray(carrinhoApi?.itens) ? carrinhoApi.itens : [];

            setCarrinho(itensApi.map(normalizarItemCarrinhoApi));
        } catch (error) {
            console.error('Erro ao carregar carrinho da API.', error);
        }
    };


    useEffect(() => {
        const carregarDadosLoja = async () => {
            try {
                const [resCategorias, resEstoques] = await Promise.all([
                    fetch('http://localhost:8080/api/categoria', { headers: getAuthHeaders() }),
                    fetch('http://localhost:8080/api/estoque', { headers: getAuthHeaders() }),
                ]);

                if (!resCategorias.ok) {
                    throw new Error('Falha ao carregar categorias');
                }

                if (!resEstoques.ok) {
                    throw new Error('Falha ao carregar estoque');
                }

                const dadosCategorias = await resCategorias.json();
                const dadosEstoques = await resEstoques.json();

                const listaCategorias = Array.isArray(dadosCategorias) ? dadosCategorias : [];
                const listaEstoques = Array.isArray(dadosEstoques) ? dadosEstoques : [];

                setCategorias(
                    listaCategorias.map((categoria: any, indice: number) => ({
                        ...categoria,
                        key: String(categoria.id),
                        label: categoria.nome,
                        color: gerarCorCategoria(indice),
                    }))
                );
                setEstoques(listaEstoques);
            } catch (error) {
                console.error('Erro ao carregar vitrine.', error);
            }
        };

        carregarDadosLoja();
        setIsLogged(Boolean(localStorage.getItem('jwt_token')));
        const onStorage = () => setIsLogged(Boolean(localStorage.getItem('jwt_token')));
        window.addEventListener('storage', onStorage);
    carregarCarrinhoDaApi();
        document.body.style.backgroundImage = 'url("./bg-GeekBay.png")';
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundAttachment = 'fixed';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundColor = '#000';

        return () => {
            document.body.style.backgroundImage = '';
            document.body.style.backgroundSize = '';
            document.body.style.backgroundAttachment = '';
            document.body.style.backgroundPosition = '';
            document.body.style.backgroundColor = '';
            window.removeEventListener('storage', onStorage);
        };
    }, []);

    const alternarSom = () => {
        if (videoRef.current) {
            const novoEstadoMuto = !videoRef.current.muted;
            videoRef.current.muted = novoEstadoMuto;
            setIsMuted(novoEstadoMuto);
        }
    };

    const abrirModalQuantidade = (estoque: EstoqueResponseDTO) => {
        setEstoqueEmEdicao(estoque);
        setQuantidadeSelecionada(1);
        setMostrarModalQuantidade(true);
    };

    const fecharModalQuantidade = () => {
        setMostrarModalQuantidade(false);
        setEstoqueEmEdicao(null);
        setQuantidadeSelecionada(1);
    };

    const incrementarQuantidade = () => {
        if (estoqueEmEdicao && quantidadeSelecionada < estoqueEmEdicao.quantidade) {
            setQuantidadeSelecionada(quantidadeSelecionada + 1);
        }
    };

    const decrementarQuantidade = () => {
        if (quantidadeSelecionada > 1) {
            setQuantidadeSelecionada(quantidadeSelecionada - 1);
        }
    };

    const confirmarAdicaoAoCarrinho = () => {
        if (estoqueEmEdicao) {
            adicionarAoCarrinhoComQuantidade(estoqueEmEdicao, quantidadeSelecionada);
            fecharModalQuantidade();
        }
    };

    const exibirNotificacao = (mensagem: string) => {
        setNotificacao(mensagem);
        setTimeout(() => {
            setNotificacao(null);
        }, 3000);
    };

    const atualizarQuantidadeCarrinho = (produtoId: number, novaQuantidade: number, itemPedidoId?: number) => {
        const estoqueDisponivel = estoques.find(e => e.produtoResponseDTO.id === produtoId);
        const quantidadeMaxima = estoqueDisponivel?.quantidade || 999;

        if (novaQuantidade <= 0 || novaQuantidade > quantidadeMaxima) {
            return;
        }

        const atualizarLocalmente = () => {
            setCarrinho((carrinhoAtual) => {
                const novoCarrinho = carrinhoAtual.map((item) =>
                    (item.produtoId ?? item.id) === produtoId ? { ...item, quantidade: novaQuantidade } : item
                );
                localStorage.setItem('geekbay_cart', JSON.stringify(novoCarrinho));
                return novoCarrinho;
            });
        };

        // Se é um item da API (tem itemId), fazer PATCH
        if (itemPedidoId) {
            const obterUsuarioLogado = async () => {
                try {
                    const usuarioSalvo = localStorage.getItem('usuario_logado');
                    if (usuarioSalvo) {
                        const parsed = JSON.parse(usuarioSalvo);
                        return parsed.id ? parsed : null;
                    }
                    const token = localStorage.getItem('jwt_token');
                    if (token) {
                        try {
                            const payload = JSON.parse(atob(token.split('.')[1]));
                            return { id: payload.id || payload.sub };
                        } catch {
                            return null;
                        }
                    }
                    return null;
                } catch {
                    return null;
                }
            };

            obterUsuarioLogado().then((usuario) => {
                if (usuario?.id) {
                    fetch('http://localhost:8080/api/carrinho', {
                        method: 'PATCH',
                        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
                        body: JSON.stringify({ usuarioId: usuario.id, itemPedidoId: itemPedidoId, quantidade: novaQuantidade }),
                    })
                        .then((response) => {
                            if (response.ok) {
                                atualizarLocalmente();
                            } else {
                                console.error('Erro ao atualizar quantidade:', response.status);
                                exibirNotificacao('Erro ao atualizar quantidade.');
                            }
                        })
                        .catch((error) => {
                            console.error('Erro ao fazer PATCH:', error);
                            exibirNotificacao('Erro ao atualizar quantidade.');
                        });
                }
            });
        } else {
            atualizarLocalmente();
        }
    };

    const removerDoCarrinho = (itemPedidoId: number) => {
        const removerItem = async () => {
            try {
                const usuario = await obterUsuarioLogado();

                if (!usuario?.id) {
                    exibirNotificacao('Usuário não encontrado para remover o produto.');
                    return;
                }

                const response = await fetch('http://localhost:8080/api/carrinho', {
                    method: 'DELETE',
                    headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
                    body: JSON.stringify({ usuarioId: usuario.id, itemPedidoId: itemPedidoId }),
                });

                if (!response.ok) {
                    throw new Error('Erro ao excluir item do carrinho');
                }

                setCarrinho((carrinhoAtual) => {
                    const novoCarrinho = carrinhoAtual.filter((item) => item.id !== itemPedidoId && item.produtoId !== itemPedidoId);
                    localStorage.setItem('geekbay_cart', JSON.stringify(novoCarrinho));
                    return novoCarrinho;
                });
                exibirNotificacao('Produto removido do inventário');
            } catch (error) {
                console.error('Erro ao remover item do carrinho:', error);
                exibirNotificacao('Erro ao remover o produto do inventário.');
            }
        };

        removerItem();
    };


    const produtosFiltrados = categoriaSelecionada === 'todas'
        ? estoques
        : estoques.filter((estoque) =>
            String(estoque.produtoResponseDTO?.categoriaResponseDTO?.id) === categoriaSelecionada
        );

    const categoriasFiltro = categorias;

    const produtosAgrupados = agruparProdutosPorCategoria(
        categoriaSelecionada === 'todas' ? estoques : produtosFiltrados,
        categorias,
    );

    const categoriaSelecionadaAtual = categorias.find((categoria) => categoria.key === categoriaSelecionada);

    const categoriasVisiveis: CategoriaAgrupada[] = categoriaSelecionada === 'todas'
        ? produtosAgrupados
        : [{
            key: categoriaSelecionadaAtual?.key || categoriaSelecionada,
            label: categoriaSelecionadaAtual?.label || 'Categoria',
            color: categoriaSelecionadaAtual?.color || gerarCorCategoria(categoriaSelecionada),
            produtos: produtosFiltrados,
        }];

    const normalizarItemCarrinho = (estoque: EstoqueResponseDTO) => {
        const produto = estoque.produtoResponseDTO;

        return {
            id: produto.id,
            produtoId: produto.id,
            nome: produto.nome,
            descricao: produto.descricao,
            preco: produto.preco,
            img: obterImagemProduto(produto.imagem),
            categoria: produto.categoriaResponseDTO?.nome || 'Sem categoria',
            categoriaResponseDTO: produto.categoriaResponseDTO,
            quantidade: 1,
            fromApi: false,
        };
    };

    // --- FUNÇÕES DO CARRINHO ---

    const adicionarAoCarrinhoComQuantidade = (estoque: EstoqueResponseDTO, quantidade: number) => {
        const produto = normalizarItemCarrinho(estoque);
        const produtoId = produto.produtoId;

        setCarrinho((carrinhoAtual) => {
            const itemExistente = carrinhoAtual.find((item) => (item.produtoId ?? item.id) === produtoId);

            if (itemExistente) {
                // Produto já existe no carrinho
                const novaQuantidade = (itemExistente.quantidade || 1) + quantidade;

                // Atualizar estado local
                const novoCarrinho = carrinhoAtual.map((item) =>
                    (item.produtoId ?? item.id) === produtoId
                        ? { ...item, quantidade: novaQuantidade }
                        : item
                );
                localStorage.setItem('geekbay_cart', JSON.stringify(novoCarrinho));
                exibirNotificacao(`${produto.nome}: quantidade aumentada para ${novaQuantidade}!`);

                // Se é um item da API, fazer PATCH APÓS atualizar o estado
                if (itemExistente.itemId) {
                    obterUsuarioLogado().then((usuario) => {
                        if (usuario?.id) {
                            fetch('http://localhost:8080/api/carrinho', {
                                method: 'PATCH',
                                headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
                                body: JSON.stringify({ 
                                    usuarioId: usuario.id, 
                                    itemPedidoId: itemExistente.itemId, 
                                    quantidade: novaQuantidade 
                                }),
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
                    });
                }

                return novoCarrinho;
            } else {
                // Novo produto - adicionar ao carrinho
                const novoCarrinho = [...carrinhoAtual, { ...produto, quantidade }];
                localStorage.setItem('geekbay_cart', JSON.stringify(novoCarrinho));
                exibirNotificacao(`${produto.nome} foi adicionado ao inventário!`);
                return novoCarrinho;
            }
        });
    };

    const adicionarAoCarrinho = (estoque: EstoqueResponseDTO) => {
        if (!isLogged) {
            exibirNotificacao('Você precisa fazer login para adicionar um produto ao inventário.');
            return;
        }
        abrirModalQuantidade(estoque);
    };

    const handleFinalizarCarrinho = async () => {
        if (!isLogged) {
            exibirNotificacao('Você precisa fazer login para finalizar.');
            return;
        }

        const token = localStorage.getItem('jwt_token');

        const usuarioSalvo = localStorage.getItem('usuario_logado');
        if (!usuarioSalvo) {
            exibirNotificacao('Dados do usuário não encontrados. Faça login novamente.');
            return;
        }

        let email: string | undefined;
        try {
            const parsed = JSON.parse(usuarioSalvo);
            email = parsed.email || parsed.mail || parsed.username;
        } catch (err) {
            console.error('Erro ao parsear usuario_logado', err);
        }

        if (!email) {
            exibirNotificacao('Email do usuário não encontrado.');
            return;
        }

        try {
            const resUser = await fetch(`http://localhost:8080/api/usuarios/email/${encodeURIComponent(email)}`, { headers: getAuthHeaders() });
            if (!resUser.ok) {
                console.error('Erro ao buscar usuário:', await resUser.text());
                exibirNotificacao('Falha ao recuperar dados do usuário.');
                return;
            }
            const user = await resUser.json();
            const usuarioId = user?.id;
            if (!usuarioId) {
                exibirNotificacao('ID do usuário não encontrado na resposta.');
                return;
            }

            // Verifica se o usuário tem endereço cadastrado
            try {
                const resEnderecos = await fetch(`http://localhost:8080/api/enderecos/usuario/${usuarioId}`, {
                    method: 'GET',
                    headers: getAuthHeaders(),
                });

                if (!resEnderecos.ok) {
                    // Mostra tela/aviso e redireciona para cadastro de endereço
                    setMostrarEnderecoObrigatorio(true);
                    const destino = token
                        ? `/cadastro/endereco?token=${encodeURIComponent(token)}`
                        : '/cadastro/endereco';
                    setTimeout(() => router.push(destino), 1200);
                    return;
                }
            } catch (err) {
                console.error('Erro ao verificar endereços do usuário:', err);
                setMostrarEnderecoObrigatorio(true);
                const destino = token
                    ? `/cadastro/endereco?token=${encodeURIComponent(token)}`
                    : '/cadastro/endereco';
                setTimeout(() => router.push(destino), 1200);
                return;
            }

            if (!carrinho || carrinho.length === 0) {
                exibirNotificacao('Seu inventário está vazio.');
                return;
            }

            // Filtrar apenas itens que não vieram da API (itens novamente adicionados)
            const itensParaAdicionar = carrinho.filter((item) => !item.fromApi);

            if (itensParaAdicionar.length === 0) {
                // Todos os itens já estão no carrinho da API, apenas redirecionar
                localStorage.removeItem('geekbay_cart');
                setCarrinho([]);
                exibirNotificacao('Carrinho sincronizado. Redirecionando...');
                setTimeout(() => router.push('/finalizarCompra'), 900);
                return;
            }

            const promises = itensParaAdicionar.map((item) =>
                fetch('http://localhost:8080/api/carrinho', {
                    method: 'POST',
                    headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
                    body: JSON.stringify({ usuarioId, produtoId: item.produtoId ?? item.id, quantidade: item.quantidade || 1 }),
                })
            );

            const responses = await Promise.all(promises);
            const failed = responses.filter((r) => !r.ok);
            if (failed.length > 0) {
                console.error('Algumas requisições falharam', failed);
                exibirNotificacao('Erro ao adicionar alguns itens no carrinho. Tente novamente.');
                return;
            }

            // sucesso
            localStorage.removeItem('geekbay_cart');
            setCarrinho([]);
            exibirNotificacao('Itens adicionados ao carrinho. Redirecionando...');
            setTimeout(() => router.push('/finalizarCompra'), 900);
        } catch (error) {
            console.error('Erro ao finalizar:', error);
            exibirNotificacao('Erro ao finalizar. Tente novamente mais tarde.');
        }
    };


    const calcularTotal = () => {
        return carrinho.reduce((acc, item) => {

            const precoLimpo = typeof item.preco === 'string'
                ? parseFloat(item.preco.replace(',', '.'))
                : item.preco;
            return acc + (precoLimpo * (item.quantidade || 1));
        }, 0);
    };

    return (
        <>
            <style>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `}</style>

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
                            {categoriasFiltro.map((categoria) => (
                                <option key={categoria.key} value={categoria.key}>
                                    {categoria.label}
                                </option>
                            ))}
                        </select>

                        <Link href="/login" style={{ textDecoration: 'none', color: '#ff7004' }}>
                            Login
                        </Link>

                        <button onClick={() => setMostrarCarrinho(true)} className={styles.btnAcaoCarrinho}>
                            <img src="/carrinhoGB.png" alt="carrinho" style={{ width: '20px' }} />
                            ({carrinho.length})
                        </button>

                    </div>
                </header>


                <main className={styles.mainContainer}>
                    <h2 style={{ color: 'black', textAlign: 'center', marginTop: '30px', fontSize: '35px', fontWeight: '600', textShadow: '-1px -1px 0 #ff7004, 1px -1px 0 #ff7004, -1px 1px 0 #ff7004, 1px 1px 0 #ff7004' }}> Explore o Multiverso Geek ! </h2>
                    <div className={styles.listaCategoriasProdutos}>
                        {categoriasVisiveis.map((categoria) => (
                            <section key={categoria.key} className={styles.secaoCategoriaProdutos}>
                                <div className={styles.cabecalhoCategoria} style={{ borderColor: categoria.color }}>
                                    <span className={styles.bolinhaCategoria} style={{ backgroundColor: categoria.color }} />
                                    <h3 className={styles.tituloCategoria}>{categoria.label}</h3>
                                </div>

                                <div
                                    className={styles.gradeProdutos}
                                    style={
                                        categoriaSelecionada === "todas"
                                            ? undefined
                                            : { display: "flex", flexDirection: "row", overflowX: "auto", gap: "30px" }
                                    }
                                >
                                    {categoria.produtos.length === 0 ? (
                                        <div style={{ color: '#fff', padding: '20px', textAlign: 'center', width: '100%' }}>
                                            O Multiverso está vazio por aqui. Volte mais tarde ou explore outras categorias!
                                        </div>
                                    ) : (
                                        categoria.produtos.map((p: any) => {
                                            const categoriaProduto = categorias.find((item) => String(item.id) === String(p.produtoResponseDTO.categoriaResponseDTO?.id)) || categoriaSelecionadaAtual;

                                            return (
                                                <section
                                                    key={p.produtoResponseDTO.id}
                                                    className={styles.card}
                                                    style={
                                                        categoriaSelecionada === "todas"
                                                            ? { textAlign: "center", position: "relative" }
                                                            : { textAlign: "center", minWidth: "280px", flexShrink: 0, position: "relative" }
                                                    }
                                                >
                                                    <div
                                                        style={{
                                                            position: "absolute",
                                                            top: "10px",
                                                            right: "10px",
                                                            cursor: "pointer",
                                                            fontSize: "20px"
                                                        }}
                                                        onClick={() => setProdutoInfo(p.produtoResponseDTO)}
                                                    >
                                                        <img
                                                            src="/info.png"
                                                            alt="Informações"
                                                            style={{
                                                                width: "22px",
                                                                height: "22px"
                                                            }}
                                                        />
                                                    </div>

                                                    <img src={obterImagemProduto(p.produtoResponseDTO.imagem)} alt={p.produtoResponseDTO.nome} style={{ height: '130px', objectFit: 'contain', borderRadius: '8px' }} />

                                                    <div className={styles.nomeProdutoLinha}>
                                                        <span
                                                            className={styles.bolinhaCategoriaProduto}
                                                            style={{ backgroundColor: categoriaProduto?.color || corPadraoCategoria }}
                                                        />
                                                        <h3 style={{ marginTop: '15px', fontSize: '16px' }}>{p.produtoResponseDTO.nome}</h3>
                                                    </div>

                                                    <p style={{ color: categoriaProduto?.color || corPadraoCategoria, fontSize: '14px' }}>{p.produtoResponseDTO.categoriaResponseDTO?.nome || 'Sem categoria'}</p>
                                                    <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#ff7a00' }}>R$ {Number(p.produtoResponseDTO.preco || 0).toFixed(2)}</p>
                                                    <p style={{ marginTop: '4px', color: '#666', fontSize: '13px' }}>Qtd. disponível: {p.quantidade}</p>
                                                    <button className={styles.btnAcao} style={{ width: '100%', marginTop: '10px' }} onClick={() => adicionarAoCarrinho(p)}>
                                                        Adicionar ao Inventário
                                                    </button>
                                                </section>
                                            );
                                        })
                                    )}
                                </div>
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
                                                <th>Preço</th>
                                                <th>Qtd</th>
                                                <th>Ação</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {carrinho.map((item, index) => {
                                                const produtoId = item.produtoId ?? item.id;
                                                const itemCarrinhoId = item.id;
                                                const estoqueDisponivel = estoques.find(e => e.produtoResponseDTO.id === produtoId);
                                                const quantidadeMaxima = estoqueDisponivel?.quantidade || 999;

                                                return (
                                                    <tr key={itemCarrinhoId || produtoId || index}>
                                                        <td>{item.nome}</td>
                                                        <td>R$ {item.preco}</td>
                                                        <td>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                                                                <button
                                                                    onClick={() => atualizarQuantidadeCarrinho(produtoId, item.quantidade - 1, item.itemId)}
                                                                    disabled={item.quantidade <= 1}
                                                                    style={{
                                                                        padding: '4px 8px',
                                                                        fontSize: '14px',
                                                                        backgroundColor: '#ff7a00',
                                                                        color: '#fff',
                                                                        border: 'none',
                                                                        borderRadius: '3px',
                                                                        cursor: item.quantidade <= 1 ? 'not-allowed' : 'pointer',
                                                                        opacity: item.quantidade <= 1 ? 0.5 : 1,
                                                                    }}
                                                                >
                                                                    −
                                                                </button>
                                                                <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: 'bold' }}>
                                                                    {item.quantidade}
                                                                </span>
                                                                <button
                                                                    onClick={() => atualizarQuantidadeCarrinho(produtoId, item.quantidade + 1, item.itemId)}
                                                                    disabled={item.quantidade >= quantidadeMaxima}
                                                                    style={{
                                                                        padding: '4px 8px',
                                                                        fontSize: '14px',
                                                                        backgroundColor: '#ff7a00',
                                                                        color: '#fff',
                                                                        border: 'none',
                                                                        borderRadius: '3px',
                                                                        cursor: item.quantidade >= quantidadeMaxima ? 'not-allowed' : 'pointer',
                                                                        opacity: item.quantidade >= quantidadeMaxima ? 0.5 : 1,
                                                                    }}
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <button
                                                                onClick={() => removerDoCarrinho(itemCarrinhoId)}
                                                                style={{
                                                                    padding: '6px 12px',
                                                                    fontSize: '12px',
                                                                    backgroundColor: '#e53935',
                                                                    color: '#fff',
                                                                    border: 'none',
                                                                    borderRadius: '4px',
                                                                    cursor: 'pointer',
                                                                    fontWeight: 'bold',
                                                                }}
                                                            >
                                                                Remover
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                                <strong>Total: R$ {calcularTotal().toFixed(2)}</strong>
                            </div>
                                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button className={styles.btnAcao} onClick={() => setMostrarCarrinho(false)}>Continuar</button>
                                <button className={styles.btnAcao} style={{ textDecoration: 'none', textAlign: 'center', fontFamily: 'sans-serif', fontSize: '13px', fontWeight: 'bold' }} onClick={handleFinalizarCarrinho}>Finalizar</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {produtoInfo && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalConteudo} style={{ maxWidth: "500px" }}>
                        <h3 style={{ color: "#ff7a00" }}>{produtoInfo.nome}</h3>

                        <p style={{ marginTop: "15px" }}>
                            {produtoInfo.descricao}
                        </p>

                        <p style={{ color: '#999', marginTop: '8px' }}>
                            Categoria: {produtoInfo.categoriaResponseDTO?.nome || 'Sem categoria'}
                        </p>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button
                                className={styles.btnAcao}
                                style={{ flex: 1 }}
                                onClick={() => setProdutoInfo(null)}
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {mostrarModalQuantidade && estoqueEmEdicao && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalConteudo} style={{ maxWidth: "400px" }}>
                        <h3 style={{ color: "#ff7a00" }}>Selecione a Quantidade</h3>
                        
                        <p style={{ marginTop: "20px", fontSize: "16px", textAlign: "center" }}>
                            {estoqueEmEdicao.produtoResponseDTO.nome}
                        </p>

                        <div style={{ marginTop: "30px", display: "flex", alignItems: "center", justifyContent: "center", gap: "15px" }}>
                            <button
                                onClick={decrementarQuantidade}
                                disabled={quantidadeSelecionada <= 1}
                                style={{
                                    padding: "10px 15px",
                                    fontSize: "18px",
                                    backgroundColor: "#ff7a00",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: quantidadeSelecionada <= 1 ? "not-allowed" : "pointer",
                                    opacity: quantidadeSelecionada <= 1 ? 0.5 : 1,
                                }}
                            >
                                −
                            </button>

                            <input
                                type="number"
                                value={quantidadeSelecionada}
                                onChange={(e) => {
                                    const valor = parseInt(e.target.value);
                                    if (!isNaN(valor) && valor > 0 && valor <= estoqueEmEdicao.quantidade) {
                                        setQuantidadeSelecionada(valor);
                                    }
                                }}
                                style={{
                                    width: "60px",
                                    padding: "10px",
                                    fontSize: "18px",
                                    textAlign: "center",
                                    border: "2px solid #ff7a00",
                                    borderRadius: "5px",
                                }}
                            />

                            <button
                                onClick={incrementarQuantidade}
                                disabled={quantidadeSelecionada >= estoqueEmEdicao.quantidade}
                                style={{
                                    padding: "10px 15px",
                                    fontSize: "18px",
                                    backgroundColor: "#ff7a00",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: quantidadeSelecionada >= estoqueEmEdicao.quantidade ? "not-allowed" : "pointer",
                                    opacity: quantidadeSelecionada >= estoqueEmEdicao.quantidade ? 0.5 : 1,
                                }}
                            >
                                +
                            </button>
                        </div>

                        <p style={{ marginTop: "15px", fontSize: "13px", color: "#ddd", textAlign: "center" }}>
                            Disponível: {estoqueEmEdicao.quantidade}
                        </p>

                        <div style={{ display: "flex", gap: "10px", marginTop: "25px" }}>
                            <button
                                className={styles.btnAcao}
                                onClick={confirmarAdicaoAoCarrinho}
                                style={{ flex: 1 }}
                            >
                                Confirmar
                            </button>
                            <button
                                className={styles.btnAcao}
                                onClick={fecharModalQuantidade}
                                style={{ flex: 1, backgroundColor: "#999" }}
                            >
                                Voltar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {notificacao && (
                <div
                    style={{
                        position: "fixed",
                        top: "20px",
                        right: "20px",
                        backgroundColor: "#ff7a00",
                        color: "#fff",
                        padding: "15px 20px",
                        borderRadius: "8px",
                        zIndex: 10003,
                        fontSize: "14px",
                        fontWeight: "bold",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                        animation: "slideIn 0.3s ease",
                    }}
                >
                    {notificacao}
                </div>
            )}

            {mostrarEnderecoObrigatorio && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalConteudo} style={{ maxWidth: '500px' }}>
                        <h3 style={{ color: '#ff7a00' }}>Endereço não cadastrado</h3>
                        <p style={{ marginTop: '10px' }}>Você precisa cadastrar um endereço antes de finalizar a compra. Redirecionando para o cadastro de endereço...</p>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '18px' }}>
                            <button onClick={() => {
                                setMostrarEnderecoObrigatorio(false);
                                const token = localStorage.getItem('jwt_token');
                                const destino = token
                                    ? `/cadastro/endereco?token=${encodeURIComponent(token)}`
                                    : '/cadastro/endereco';
                                router.push(destino);
                            }} className={styles.btnAcao}>Ir para cadastro</button>
                        </div>
                    </div>
                </div>
            )}


        </>

    );
}













