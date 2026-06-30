'use server'

import { apiServerFetch } from '@/lib/api-server'

export type Produto = {
  id: number
  codigoSku: string | null
  nome: string
  descricao: string | null
  precoUnitario: string
  unidade: string
  ativo: boolean
  criadoEm: string
  atualizadoEm: string
}

export type ListarProdutosFilters = {
  nome?: string
  ativo?: boolean
}

export type CriarProdutoInput = {
  codigoSku?: string
  nome: string
  descricao?: string
  precoUnitario: number
  unidade?: string
  ativo?: boolean
}

export type AtualizarProdutoInput = Partial<CriarProdutoInput>

export async function listarProdutos(
  filtros?: ListarProdutosFilters,
): Promise<Produto[]> {
  const params = new URLSearchParams()
  if (filtros?.nome) params.append('nome', filtros.nome)
  if (filtros?.ativo !== undefined)
    params.append('ativo', String(filtros.ativo))

  const url = `/produtos${params.toString() ? `?${params.toString()}` : ''}`
  const response = await apiServerFetch(url, { method: 'GET' })

  if (!response.ok) {
    throw new Error(`Erro ao listar produtos: ${response.statusText}`)
  }

  return response.json()
}

export async function obterProduto(id: number): Promise<Produto> {
  const response = await apiServerFetch(`/produtos/${id}`, { method: 'GET' })

  if (!response.ok) {
    throw new Error(`Produto não encontrado`)
  }

  return response.json()
}

export async function criarProduto(
  input: CriarProdutoInput,
): Promise<Produto> {
  const response = await apiServerFetch('/produtos', {
    method: 'POST',
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'Erro ao criar produto')
  }

  return response.json()
}

export async function atualizarProduto(
  id: number,
  input: AtualizarProdutoInput,
): Promise<Produto> {
  const response = await apiServerFetch(`/produtos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'Erro ao atualizar produto')
  }

  return response.json()
}

export async function removerProduto(id: number): Promise<void> {
  const response = await apiServerFetch(`/produtos/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'Erro ao remover produto')
  }
}
