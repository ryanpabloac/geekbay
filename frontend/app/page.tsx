"use client";

import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

export default function Produtos() {
  
  const [produtos, setProdutos] = useState<any[]>([]);
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
      alert("Erro ao carregar produtos.");
    }
  };

  const handleCadastrar = async (e : any) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formCadastrar)
      });
      if (!response.ok) throw new Error();
      alert("Produto cadastrado com sucesso!");
      setFormCadastrar({ categoria: '', codigo: '', nome: '', preco: '', descricao: '', img: '' });
      listarTodos();
    } catch (error) {
      alert("Erro ao cadastrar produto.");
    }
  };

  const handleSalvarEdicao = async (e : any) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/produtos/${formEditar.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formEditar)
      });
      if (!response.ok) throw new Error();
      alert("Produto atualizado!");
      setFormEditar({ id: '', categoria: '', codigo: '', nome: '', preco: '', descricao: '', img: '' });
      listarTodos();
    } catch (error) {
      alert("Erro ao atualizar produto.");
    }
  };

  const handleExcluir = async (id : any) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        const response = await fetch(`http://localhost:5000/produtos/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error();
        listarTodos();
      } catch (error) {
        alert("Erro ao excluir.");
      }
    }
  };

  const prepararEdicao = (produto : any) => {
    setFormEditar(produto);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
              <img src='/icone-GB.png' alt="Logo" className={styles.logoCard} />
              <h2>Cadastrar Produto</h2>
            </div>
            <form onSubmit={handleCadastrar} className={styles.formulario}>
              <input className={styles.inputGroup} type="text" placeholder="Categoria" value={formCadastrar.categoria} 
                onChange={(e) => setFormCadastrar({...formCadastrar, categoria: e.target.value})} required />
              
              <input className={styles.inputGroup}  type="text" placeholder="Código" value={formCadastrar.codigo} 
                onChange={(e) => setFormCadastrar({...formCadastrar, codigo: e.target.value})} required />
              
              <input className={styles.inputGroup} type="text" placeholder="Nome" value={formCadastrar.nome} 
                onChange={(e) => setFormCadastrar({...formCadastrar, nome: e.target.value})} required />
              
              <input className={styles.inputGroup}  type="text" placeholder="Preço" value={formCadastrar.preco} 
                onChange={(e) => setFormCadastrar({...formCadastrar, preco: e.target.value})} required />

              <button type="submit" className={styles.btnAcao}>Cadastrar</button>
            </form>
          </section>

          {/* CARD EDITAR */}
          <section className={styles.card}>
            <div className={styles.cardTituloImg}>
              <img src='/icone-GB.png' alt="Logo" className={styles.logoCard} />
              <h2>Editar Produto</h2>
            </div>
            <form onSubmit={handleSalvarEdicao} className={styles.formulario}>
              <input type="hidden" value={formEditar.id} />
              <input type="text" className={styles.inputGroup} placeholder="Categoria" value={formEditar.categoria} 
                onChange={(e) => setFormEditar({...formEditar, categoria: e.target.value})} required />
              
              
              <input className={styles.inputGroup}  type="text" placeholder="Código" value={formEditar.codigo} 
                onChange={(e) => setFormEditar({...formEditar, codigo: e.target.value})} required />

              <input type="text" className={styles.inputGroup} placeholder="Nome" value={formEditar.nome} 
                onChange={(e) => setFormEditar({...formEditar, nome: e.target.value})} required />
              
              <input type="text" className={styles.inputGroup} placeholder="Preço" value={formEditar.preco} 
                onChange={(e) => setFormEditar({...formEditar, preco: e.target.value})} required />

             <button type="submit" className={styles.btnAcao} disabled={!formEditar.id}>
                       Salvar Alterações
            </button>
            </form>
          </section>
        </div>

        {/* LISTA DE PRODUTOS */}
        <section className={`${styles.card} ${styles.secaoListaCard}`}>
          <h2>Lista de Produtos</h2>
          <table className={styles.tabelaContainer}>
            <thead>
              <tr>
                <th>Categoria</th>
                <th>Código</th>
                <th>Nome</th>
                <th>Preço</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((p) => (
                <tr key={p.id}>
                  <td>{p.categoria}</td>
                  <td>{p.codigo}</td>
                  <td>{p.nome}</td>
                  <td>{p.preco}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button onClick={() => prepararEdicao(p)} className={styles.btnAcao}>Editar</button>
                      <button onClick={() => handleExcluir(p.id)} className={styles.btnAcao}>Excluir</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}