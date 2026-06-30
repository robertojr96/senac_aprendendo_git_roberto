'use client'

import { useEffect, useState, useActionState } from 'react'
import {
  listarProdutos,
  criarProduto,
  atualizarProduto,
  removerProduto,
  Produto,
  ListarProdutosFilters,
  CriarProdutoInput,
  AtualizarProdutoInput,
} from './actions'
import ProdutoForm from './ProdutoForm'

type ListState = {
  produtos: Produto[]
  erro?: string
  carregando: boolean
}

export default function ProdutosPage() {
  const [listState, setListState] = useState<ListState>({
    produtos: [],
    carregando: true,
  })

  const [filtros, setFiltros] = useState<ListarProdutosFilters>({})
  const [produtoEditando, setProdutoEditando] = useState<Produto | undefined>()
  const [mostraFormNovo, setMostraFormNovo] = useState(false)

  // Carrega lista de produtos
  useEffect(() => {
    carregarProdutos()
  }, [filtros])

  async function carregarProdutos() {
    setListState((prev) => ({ ...prev, carregando: true, erro: undefined }))
    try {
      const data = await listarProdutos(filtros)
      setListState({ produtos: data, carregando: false })
    } catch (err) {
      setListState({
        produtos: [],
        carregando: false,
        erro: err instanceof Error ? err.message : 'Erro ao carregar',
      })
    }
  }

  // Server action para criar produto
  async function handleCriarProduto(
    _prevState: any,
    formData: FormData,
  ): Promise<{ error?: string; sucesso?: string }> {
    try {
      const input: CriarProdutoInput = {
        codigoSku: formData.get('codigoSku') as string,
        nome: formData.get('nome') as string,
        descricao: formData.get('descricao') as string,
        precoUnitario: parseFloat(formData.get('precoUnitario') as string),
        unidade: formData.get('unidade') as string,
        ativo: formData.get('ativo') === 'on',
      }

      await criarProduto(input)
      setMostraFormNovo(false)
      await carregarProdutos()
      return { sucesso: 'Produto criado com sucesso' }
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : 'Erro ao criar produto',
      }
    }
  }

  // Server action para atualizar produto
  async function handleAtualizarProduto(
    _prevState: any,
    formData: FormData,
  ): Promise<{ error?: string; sucesso?: string }> {
    if (!produtoEditando) return { error: 'Erro: produto não selecionado' }

    try {
      const input: AtualizarProdutoInput = {
        codigoSku: formData.get('codigoSku') as string,
        nome: formData.get('nome') as string,
        descricao: formData.get('descricao') as string,
        precoUnitario: parseFloat(formData.get('precoUnitario') as string),
        unidade: formData.get('unidade') as string,
        ativo: formData.get('ativo') === 'on',
      }

      await atualizarProduto(produtoEditando.id, input)
      setProdutoEditando(undefined)
      await carregarProdutos()
      return { sucesso: 'Produto atualizado com sucesso' }
    } catch (err) {
      return {
        error:
          err instanceof Error ? err.message : 'Erro ao atualizar produto',
      }
    }
  }

  // Deletar produto
  async function handleDeletarProduto(id: number) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return

    try {
      await removerProduto(id)
      await carregarProdutos()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao deletar')
    }
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Produtos</h1>
      </div>

      {/* Filtros */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por nome..."
                value={filtros.nome || ''}
                onChange={(e) =>
                  setFiltros({ ...filtros, nome: e.target.value || undefined })
                }
              />
            </div>

            <div className="col-md-3 mb-3">
              <select
                className="form-select"
                value={
                  filtros.ativo === undefined
                    ? ''
                    : filtros.ativo
                      ? 'true'
                      : 'false'
                }
                onChange={(e) => {
                  if (e.target.value === '') {
                    setFiltros({ ...filtros, ativo: undefined })
                  } else {
                    setFiltros({
                      ...filtros,
                      ativo: e.target.value === 'true',
                    })
                  }
                }}
              >
                <option value="">Todos</option>
                <option value="true">Ativos</option>
                <option value="false">Inativos</option>
              </select>
            </div>

            <div className="col-md-3 mb-3">
              <button
                className="btn btn-success w-100"
                onClick={() => {
                  setMostraFormNovo(true)
                  setProdutoEditando(undefined)
                }}
              >
                + Novo Produto
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Formulário Novo */}
      {mostraFormNovo && (
        <ProdutoForm
          onSalvar={handleCriarProduto}
          onCancelar={() => setMostraFormNovo(false)}
        />
      )}

      {/* Formulário Edição */}
      {produtoEditando && (
        <ProdutoForm
          produto={produtoEditando}
          onSalvar={handleAtualizarProduto}
          onCancelar={() => setProdutoEditando(undefined)}
        />
      )}

      {/* Erros e Carregamento */}
      {listState.erro && (
        <div className="alert alert-danger" role="alert">
          {listState.erro}
        </div>
      )}

      {listState.carregando && (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      )}

      {/* Tabela de Produtos */}
      {!listState.carregando && listState.produtos.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>SKU</th>
                <th>Nome</th>
                <th>Preço</th>
                <th>Unidade</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {listState.produtos.map((produto) => (
                <tr key={produto.id}>
                  <td>{produto.id}</td>
                  <td>{produto.codigoSku || '-'}</td>
                  <td>
                    <strong>{produto.nome}</strong>
                    {produto.descricao && (
                      <div className="text-muted small">{produto.descricao}</div>
                    )}
                  </td>
                  <td>
                    {parseFloat(produto.precoUnitario).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </td>
                  <td>{produto.unidade}</td>
                  <td>
                    <span
                      className={
                        produto.ativo
                          ? 'badge bg-success'
                          : 'badge bg-secondary'
                      }
                    >
                      {produto.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => setProdutoEditando(produto)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeletarProduto(produto.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!listState.carregando && listState.produtos.length === 0 && (
        <div className="alert alert-info">
          Nenhum produto encontrado. Crie um novo clicando no botão acima.
        </div>
      )}
    </div>
  )
}
