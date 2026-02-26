"use client";

import { useState, useEffect } from 'react';
import styles from '../../styles/Home.module.css';
import Link from 'next/link';

const ModalAviso = ({ mensagem, aoFechar, aoConfirmar }: {
  mensagem: string,
  aoFechar: () => void,
  aoConfirmar?: () => void
}) => {
  if (!mensagem) return null;
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalConteudo}>
        <img src='/icone-GB.png' alt="Logo GeekBay" className={styles.logoCard} />
        <p>{mensagem}</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          {aoConfirmar ? (
            <>
              <button onClick={aoConfirmar} className={styles.btnAcao}>Sim, Excluir</button>
              <button onClick={aoFechar} className={styles.btnAcao} style={{ backgroundColor: '#757575' }}>Cancelar</button>
            </>
          ) : (
            <button onClick={aoFechar} className={styles.btnAcao}>OK</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Produtos() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [estoque, setEstoque] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<any>(null);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [pedidosOriginais, setPedidosOriginais] = useState<any[]>([]);
  const [mensagemModal, setMensagemModal] = useState('');
  const [mostrarModalBusca, setMostrarModalBusca] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');
  const [idParaExcluir, setIdParaExcluir] = useState<any>(null);


  const [editandoEstoqueId, setEditandoEstoqueId] = useState<number | null>(null);
  const [formEstoque, setFormEstoque] = useState({ disponivel: 0, reservado: 0 });

  const [formCadastrar, setFormCadastrar] = useState({
    categoria: '', codigo: '', nome: '', preco: '', descricao: '', img: ''
  });
  const [formEditar, setFormEditar] = useState({
    id: '', categoria: '', codigo: '', nome: '', preco: '', descricao: '', img: ''
  });

  useEffect(() => {
    listarTodos();
    listarEstoque();
    listarPedidos();
    listarClientes();
  }, []);

  const listarClientes = async () => {
    try {
      const response = await fetch('http://localhost:5000/clientes');
      const dados = await response.json();
      setClientes(dados);
    } catch (error) {
      console.error("Erro ao carregar clientes.");
    }
  };


  const listarTodos = async () => {
    try {
      const response = await fetch('http://localhost:5000/produtos');
      if (!response.ok) throw new Error();
      const dados = await response.json();
      setProdutos(dados);
    } catch (error) {
      setMensagemModal("Erro ao carregar produtos.");
    }
  };


  const listarEstoque = async () => {
    try {
      const response = await fetch('http://localhost:5000/estoque');
      if (!response.ok) throw new Error();
      const dados = await response.json();
      setEstoque(dados);
    } catch (error) {
      console.error("Erro ao carregar estoque.");
    }
  };

  const listarPedidos = async () => {
    try {
      const response = await fetch('http://localhost:5000/pedidos');
      const dados = await response.json();
      setPedidos(dados);
      setPedidosOriginais(dados);
    } catch (error) { console.error("Erro nos pedidos"); }
  };

  const handleCadastrar = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formCadastrar)
      });
      if (!response.ok) throw new Error();
      setMensagemModal("Produto cadastrado com sucesso!");
      setFormCadastrar({ categoria: '', codigo: '', nome: '', preco: '', descricao: '', img: '' });
      listarTodos();
      listarEstoque();
    } catch (error) {
      setMensagemModal("Erro ao cadastrar produto.");
    }
  };

  const prepararEdicao = (produto: any) => {
    setFormEditar(produto);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSalvarEdicao = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/produtos/${formEditar.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formEditar)
      });
      if (!response.ok) throw new Error();
      setMensagemModal("Produto atualizado com sucesso!");
      setFormEditar({ id: '', categoria: '', codigo: '', nome: '', preco: '', descricao: '', img: '' });
      listarTodos();
    } catch (error) {
      setMensagemModal("Erro ao atualizar produto.");
    }
  };

  const abrirConfirmacaoExcluir = (id: any) => {
    setIdParaExcluir(id);
    setMensagemModal("Tem certeza que deseja excluir este produto?");
  };

  const confirmarExclusao = async () => {
    try {
      const response = await fetch(`http://localhost:5000/produtos/${idParaExcluir}`, { method: 'DELETE' });
      if (!response.ok) throw new Error();
      setIdParaExcluir(null);
      setMensagemModal("Produto removido!");
      listarTodos();
      listarEstoque();
    } catch (error) {
      setMensagemModal("Erro ao excluir produto.");
    }
  };

  const iniciarEdicaoEstoque = (item: any) => {
    setEditandoEstoqueId(item.id);
    setFormEstoque({
      disponivel: item.quantidade_disponivel,
      reservado: item.quantidade_reservada
    });
  };

  const salvarEstoque = async (id: number) => {
    try {
      await fetch(`http://localhost:5000/estoque/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quantidade_disponivel: formEstoque.disponivel,
          quantidade_reservada: formEstoque.reservado
        })
      });

      setMensagemModal("Estoque atualizado!");
      setEditandoEstoqueId(null);
      listarEstoque();
    } catch (error) {
      setMensagemModal("Erro ao atualizar estoque.");
    }
  };

  const atualizarStatusPedido = async (id: number, status: string) => {
    try {
      await fetch(`http://localhost:5000/pedidos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      setMensagemModal(`Pedido #${id} atualizado!`);
      listarPedidos();
    } catch (error) { setMensagemModal("Erro ao atualizar status."); }
  };

  const listarEScrollar = () => {
    listarPedidos();


    const elemento = document.getElementById('tabela-pedidos');
    if (elemento) {
      elemento.scrollIntoView({ behavior: 'smooth' });
    }

  };

  return (

    <div className={styles.corpo} style={{
      backgroundImage: 'url("/bg-GeekBay.png")',
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      paddingBottom: '40px'
    }}>
      <header className={styles.cabecalho}>

        <img src='/icone-GB.png' alt="Logo GeekBay" className={styles.logo} />
        <h1 className={styles.nomeCabecalho} style={{ marginRight: "100px" }} >GeekBay</h1>

        <div style={{ display: 'flex', flexDirection: 'row', gap: '30px' }} >
          <Link href="/" style={{ textDecoration: 'none', color: '#ff7004' }}>
            Home
          </Link>

          <Link href="/produtos" style={{ textDecoration: 'none', color: '#ff7004', marginLeft: '40px' }}>
            Gerenciamento
          </Link>

          <Link href="/dashboard" style={{ textDecoration: 'none', color: '#ff7004', marginLeft: '40px' }}>
            Dashboard
          </Link>
        </div>

      </header>

      <main className={styles.mainContainer}>

        <div className={styles.containerCards}>

          <section className={styles.card}>
            <div className={styles.cardTituloImg}>
              <img src={formCadastrar.img || '/icone-GB.png'} alt="Preview" className={styles.logoCard} style={{ objectFit: 'contain', borderRadius: '8px' }} />
              <h2>Cadastrar Produto</h2>
            </div>
            <form onSubmit={handleCadastrar} className={styles.formulario}>
              <input className={styles.inputGroup} type="text" placeholder="URL da Imagem" value={formCadastrar.img}
                onChange={(e) => setFormCadastrar({ ...formCadastrar, img: e.target.value })} />
              <input className={styles.inputGroup} type="text" placeholder="Categoria" value={formCadastrar.categoria}
                onChange={(e) => setFormCadastrar({ ...formCadastrar, categoria: e.target.value })} required />
              <input className={styles.inputGroup} type="text" placeholder="Código" value={formCadastrar.codigo}
                onChange={(e) => setFormCadastrar({ ...formCadastrar, codigo: e.target.value })} required />
              <input className={styles.inputGroup} type="text" placeholder="Nome" value={formCadastrar.nome}
                onChange={(e) => setFormCadastrar({ ...formCadastrar, nome: e.target.value })} required />
              <input className={styles.inputGroup} type="text" placeholder="R$ 123,45" value={formCadastrar.preco}
                onChange={(e) => setFormCadastrar({ ...formCadastrar, preco: e.target.value })} required />
              <button type="submit" className={styles.btnAcao}>Cadastrar</button>
            </form>
          </section>


          <section className={styles.card}>
            <div className={styles.cardTituloImg}>
              <img src={formEditar.img || '/icone-GB.png'} alt="Preview" className={styles.logoCard} style={{ objectFit: 'cover', borderRadius: '8px' }} />
              <h2>Editar Produto</h2>
            </div>
            <form onSubmit={handleSalvarEdicao} className={styles.formulario}>
              <input type="hidden" value={formEditar.id} />
              <input className={styles.inputGroup} type="text" placeholder="URL da Imagem" value={formEditar.img}
                onChange={(e) => setFormEditar({ ...formEditar, img: e.target.value })} />
              <input type="text" className={styles.inputGroup} placeholder="Categoria" value={formEditar.categoria}
                onChange={(e) => setFormEditar({ ...formEditar, categoria: e.target.value })} required />
              <input className={styles.inputGroup} type="text" placeholder="Código" value={formEditar.codigo}
                onChange={(e) => setFormEditar({ ...formEditar, codigo: e.target.value })} required />
              <input type="text" className={styles.inputGroup} placeholder="Nome" value={formEditar.nome}
                onChange={(e) => setFormEditar({ ...formEditar, nome: e.target.value })} required />
              <input type="text" className={styles.inputGroup} placeholder="R$ 123,45" value={formEditar.preco}
                onChange={(e) => setFormEditar({ ...formEditar, preco: e.target.value })} required />
              <button type="submit" className={styles.btnAcao} disabled={!formEditar.id}>Salvar Alterações</button>
            </form>
          </section>
        </div>


        <section className={`${styles.card} ${styles.secaoListaCard}`}>
          <div className={styles.cardTituloImg}>
            <img src='/icone-GB.png' alt="Lista" className={styles.logoCard} />
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
                    {p.img ? (
                      <a href={p.img} target="_blank" rel="noreferrer" style={{ fontSize: '10px', color: '#FF7A00' }}>Ver Foto</a>
                    ) : (
                      <span style={{ fontSize: '10px' }}>Sem Foto</span>
                    )}
                  </td>
                  <td>{p.nome}</td>
                  <td>{p.preco}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button onClick={() => prepararEdicao(p)} className={styles.btnAcao}>Editar</button>
                      <button onClick={() => abrirConfirmacaoExcluir(p.id)} className={styles.btnAcao}>Excluir</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section id="secao-estoque" className={`${styles.card} ${styles.secaoListaCard}`} style={{ marginTop: '30px' }}>
          <div className={styles.cardTituloImg}>
            <img src='/icone-GB.png' alt="Estoque" className={styles.logoCard} />
            <h2>Controle de Estoque</h2>
          </div>

          <table className={styles.tabelaContainer}>
            <thead>
              <tr>
                <th>Produto (ID)</th>
                <th>Disponível</th>
                <th>Reservado</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {estoque.map((e) => (
                <tr key={e.id}>
                  <td>{e.produto_id}</td>
                  <td>
                    {editandoEstoqueId === e.id ? (
                      <input
                        type="number"
                        className={styles.inputGroup}
                        style={{ width: '80px', margin: 0 }}
                        value={formEstoque.disponivel}
                        onChange={(ev) => setFormEstoque({ ...formEstoque, disponivel: parseInt(ev.target.value) })}
                      />
                    ) : (
                      <span style={{ color: e.quantidade_disponivel < 3 ? 'red' : 'inherit' }}>
                        {e.quantidade_disponivel}
                      </span>
                    )}
                  </td>
                  <td>
                    {editandoEstoqueId === e.id ? (
                      <input
                        type="number"
                        className={styles.inputGroup}
                        style={{ width: '80px', margin: 0 }}
                        value={formEstoque.reservado}
                        onChange={(ev) => setFormEstoque({ ...formEstoque, reservado: parseInt(ev.target.value) })}
                      />
                    ) : (
                      e.quantidade_reservada
                    )}
                  </td>
                  <td style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '10px 0' }}>
                    {editandoEstoqueId === e.id ? (
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button onClick={() => salvarEstoque(e.id)} className={styles.btnAcao} style={{ padding: '10px 10px' }}>Salvar</button>
                        <button onClick={() => setEditandoEstoqueId(null)} className={styles.btnAcao} style={{ backgroundColor: '#757575', padding: '5px 10px' }}>Sair</button>
                      </div>
                    ) : (
                      <button onClick={() => iniciarEdicaoEstoque(e)} className={styles.btnAcao} style={{ padding: '5px 10px' }}>Alterar Qtd</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section id='secao-clientes' className={`${styles.card} ${styles.secaoListaCard}`} style={{ marginTop: '30px' }}>
          <div className={styles.cardTituloImg}>
            <img src='/icone-GB.png' alt="Clientes" className={styles.logoCard} />
            <h2 style={{ color: '#000000' }}>Gerenciar Clientes</h2>
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
                  <td>{c.address.city} - {c.address.state}</td>
                  <td>
                    <button onClick={() => setClienteSelecionado(c)} className={styles.btnAcao} style={{ width: '100%' }}>
                      Endereço
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section id='secao-pedidos' className={`${styles.card} ${styles.secaoListaCard}`} style={{ marginTop: '30px' }}>
          <div className={styles.cardTituloImg}>
            <img src='/icone-GB.png' alt="Pedidos" className={styles.logoCard} />
            <h2 style={{ color: '#000000' }}>Gerenciar Pedidos</h2>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', padding: '10px', alignItems: 'center', justifyContent: "center" }}>


            <button className={styles.btnAcao} onClick={listarEScrollar}>
              Listar todos os pedidos
            </button>

            <button className={styles.btnAcao} onClick={() => setMostrarModalBusca(true)}>
              Listar todos os pedidos por cliente
            </button>

            <button className={styles.btnAcao} onClick={() => console.log("Atualizando status...")}>
              Atualizar status do pedido
            </button>

            <button className={styles.btnAcao} onClick={() => console.log("Cancelando...")}>
              Cancelar pedido
            </button>

            <Link href="/dashboard" className={styles.btnAcao} style={{ textDecoration: 'none', fontFamily: 'sans-serif', textAlign: 'center', fontSize: '12px' }}>
              Dashboard
            </Link>

          </div>

        </section>
        <section id='tabela-pedidos' className={`${styles.card} ${styles.secaoListaCard}`} style={{ width: '100%', maxWidth: '1000px', marginTop: '30px' }}>
          <div className={styles.cardTituloImg}>
            <img src='/icone-GB.png' alt="Pedidos" className={styles.logoCard} />
            <h2>Gerenciar Pedidos</h2>
          </div>


          <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
            <div className={styles.card} style={{ flex: 1, borderLeft: '5px solid #FF7A00' }}>
              <h3 style={{ color: '#757575', fontSize: '14px' }}>A Preparar</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF7A00' }}>
                {pedidosOriginais.filter(p => p.status === 'Pendente').length}
              </p>
            </div>
            <div className={styles.card} style={{ flex: 1, borderLeft: '5px solid #FF7A00' }}>
              <h3 style={{ color: '#757575', fontSize: '14px' }}>Faturamento Total</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff7a00' }}>
                R$ {pedidosOriginais.reduce((acc, p) => acc + parseFloat(p.valor_total), 0).toFixed(2)}
              </p>
            </div>
          </div>


          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <button className={styles.btnAcao} onClick={listarPedidos}>Limpar Filtros</button>
            <button className={styles.btnAcao} onClick={() => setPedidos(pedidos.filter(p => p.status === 'Pendente'))}>A Preparar</button>
          </div>
          <table className={styles.tabelaContainer}>
            <thead>
              <tr>
                <th>Nº</th>
                <th>Cliente</th>
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
                  <td style={{ fontWeight: 'bold', color: p.status === 'Pendente' ? '#FF7A00' : p.status === 'Cancelado' ? '#f44336' : 'green' }}>{p.status}</td>
                  <td>R$ {p.valor_total}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                      <button onClick={() => atualizarStatusPedido(p.id, 'Pronto')} className={styles.btnAcao} style={{ padding: '5px' }}>Atualizar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

      </main>

      {mostrarModalBusca && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalConteudo}>
            <img src='/icone-GB.png' alt="Busca" className={styles.logoCard} />
            <h3>Buscar Pedidos por Cliente</h3>

            <input
              type="text"
              className={styles.inputGroup}
              placeholder="Digite o nome do cliente..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              style={{ marginTop: '15px', marginBottom: '15px' }}
              autoFocus
            />

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                className={styles.btnAcao}
                onClick={() => {
                  const filtrados = pedidos.filter(p =>
                    p.nome_cliente.toLowerCase().includes(termoBusca.toLowerCase())
                  );
                  setPedidos(filtrados);
                  setMostrarModalBusca(false);
                  setTermoBusca('');
                }}
              >
                Buscar
              </button>
              <button
                className={styles.btnAcao}
                style={{ backgroundColor: '#757575' }}
                onClick={() => {
                  setMostrarModalBusca(false);
                  setTermoBusca('');
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
            <img src='/icone-GB.png' alt="GeekBay" className={styles.logoCard} />
            <h3>Endereço de {clienteSelecionado.name}</h3>
            <div style={{ textAlign: 'left', margin: '15px 0', fontSize: '14px' }}>
              <p><strong>Rua:</strong> {clienteSelecionado.address.street}, {clienteSelecionado.address.number}</p>
              <p><strong>Bairro:</strong> {clienteSelecionado.address.neighborhood}</p>
              <p><strong>Cidade/UF:</strong> {clienteSelecionado.address.city}/{clienteSelecionado.address.state}</p>
              <p><strong>CEP:</strong> {clienteSelecionado.address.zip_code}</p>
              <p><strong>Obs:</strong> {clienteSelecionado.address.complement}</p>
            </div>
            <button className={styles.btnAcao} onClick={() => setClienteSelecionado(null)}>Fechar</button>
          </div>
        </div>
      )}

      <ModalAviso
        mensagem={mensagemModal}
        aoFechar={() => {
          setMensagemModal('');
          setIdParaExcluir(null);
        }}
        aoConfirmar={idParaExcluir && mensagemModal.includes("certeza") ? confirmarExclusao : undefined}
      />
    </div>
  );
}





