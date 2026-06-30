'use client'

import { useActionState, useState } from 'react'
import { CriarProdutoInput, AtualizarProdutoInput, Produto } from './actions'

type FormState = {
  error?: string
  sucesso?: string
}

export type ProdutoFormProps = {
  produto?: Produto
  onSalvar: (
    _prevState: FormState | undefined,
    formData: FormData,
  ) => Promise<FormState>
  onCancelar?: () => void
}

export default function ProdutoForm({
  produto,
  onSalvar,
  onCancelar,
}: ProdutoFormProps) {
  const [state, formAction] = useActionState(onSalvar, undefined)
  const [mostraForm, setMostraForm] = useState(!!produto)

  const titulo = produto ? 'Editar Produto' : 'Novo Produto'

  if (!mostraForm && !produto) {
    return (
      <div className="mb-3">
        <button
          type="button"
          className="btn btn-success"
          onClick={() => setMostraForm(true)}
        >
          + Novo Produto
        </button>
      </div>
    )
  }

  return (
    <div className="card mb-4">
      <div className="card-header bg-light">
        <h5 className="card-title mb-0">{titulo}</h5>
      </div>

      <div className="card-body">
        {state?.error && (
          <div className="alert alert-danger" role="alert">
            {state.error}
          </div>
        )}

        {state?.sucesso && (
          <div className="alert alert-success" role="alert">
            {state.sucesso}
          </div>
        )}

        <form action={formAction}>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label htmlFor="codigoSku" className="form-label">
                Código SKU (opcional)
              </label>
              <input
                id="codigoSku"
                name="codigoSku"
                type="text"
                className="form-control"
                defaultValue={produto?.codigoSku ?? ''}
                maxLength={80}
              />
            </div>

            <div className="col-md-8 mb-3">
              <label htmlFor="nome" className="form-label">
                Nome do Produto *
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                className="form-control"
                defaultValue={produto?.nome ?? ''}
                required
                maxLength={200}
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="descricao" className="form-label">
              Descrição
            </label>
            <textarea
              id="descricao"
              name="descricao"
              className="form-control"
              rows={3}
              defaultValue={produto?.descricao ?? ''}
            />
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label htmlFor="precoUnitario" className="form-label">
                Preço Unitário *
              </label>
              <input
                id="precoUnitario"
                name="precoUnitario"
                type="number"
                step="0.01"
                min="0"
                className="form-control"
                defaultValue={produto?.precoUnitario ?? ''}
                required
              />
            </div>

            <div className="col-md-3 mb-3">
              <label htmlFor="unidade" className="form-label">
                Unidade
              </label>
              <input
                id="unidade"
                name="unidade"
                type="text"
                className="form-control"
                defaultValue={produto?.unidade ?? 'UN'}
                maxLength={20}
              />
            </div>

            <div className="col-md-5 mb-3">
              <label htmlFor="ativo" className="form-label">
                Status
              </label>
              <div className="form-check form-switch">
                <input
                  id="ativo"
                  name="ativo"
                  type="checkbox"
                  className="form-check-input"
                  defaultChecked={produto?.ativo ?? true}
                />
                <label htmlFor="ativo" className="form-check-label">
                  {produto?.ativo ? 'Ativo' : 'Inativo'}
                </label>
              </div>
            </div>
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary">
              {produto ? 'Salvar Alterações' : 'Cadastrar'}
            </button>

            {onCancelar && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancelar}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
