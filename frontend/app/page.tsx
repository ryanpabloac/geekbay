"use client";

import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

// Componente de Modal 
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
  const [mensagemModal, setMensagemModal] = useState('');
  const [idParaExcluir, setIdParaExcluir] = useState<any>(null);

  const [formCadastrar, setFormCadastrar] = useState({
    categoria: '', codigo: '', nome: '', preco: '', descricao: '', img: ''
  });
  const [formEditar, setFormEditar] = useState({
    id: '', categoria: '', codigo: '', nome: '', preco: '', descricao: '', img: ''
  });

  useEffect(() => {
    listarTodos();
  }, []);

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

  // Funções de Exclusão com Modal
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
    } catch (error) {
      setMensagemModal("Erro ao excluir produto.");
    }
  };

  return (
    <div className={styles.corpo}>
      <header className={styles.cabecalho}>
        <img src='/icone-GB.png' alt="Logo GeekBay" className={styles.logo} />
        <h1 className={styles.nomeCabecalho}>GeekBay</h1>
      </header>

      <main className={styles.mainContainer}>
        <div className={styles.containerCards}>

          {/* CARD CADASTRAR */}
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

          {/* CARD EDITAR */}
          <section className={styles.card}>
            <div className={styles.cardTituloImg}>
              <img src={formEditar.img || '/icone-GB.png'} alt="Preview" className={styles.logoCard} style={{ objectFit: 'contain', borderRadius: '8px' }} />
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

        {/* LISTA DE PRODUTOS */}
        <section className={`${styles.card} ${styles.secaoListaCard}`}>
          <div className={styles.cardTituloImg}>
            <img src={formEditar.img || '/icone-GB.png'} alt="Preview" className={styles.logoCard} style={{ objectFit: 'contain', borderRadius: '8px' }} />
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
      </main>

      {/* Renderização condicional do Modal */}
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



