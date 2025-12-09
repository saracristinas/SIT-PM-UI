import React, { useState } from 'react'
import { BookOpen, Check, ClipboardList, Clock, FileText, FlaskConical, Pill, Search, User, X } from 'lucide-react'

export default function Prontuario({ darkMode, consultas = [], onSalvarRegistro }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const [formState, setFormState] = useState({})
  const [savingId, setSavingId] = useState(null)

  const consultasConcluidas = [...consultas].filter((consulta) => consulta.status === 'concluida')
  const concluidasOrdenadas = [...consultasConcluidas].sort(
    (a, b) => new Date(b.dataHora || 0) - new Date(a.dataHora || 0)
  )

  const totalConcluidas = consultasConcluidas.length
  const consultasComExames = consultasConcluidas.filter(
    (c) => (c.registroPosConsulta?.examesSolicitados || []).length > 0 || c.registroPosConsulta?.solicitouExames
  ).length
  const consultasComMedicamentos = consultasConcluidas.filter(
    (c) => (c.registroPosConsulta?.medicamentosPrescritos || []).length > 0 || c.registroPosConsulta?.prescreveuMedicamentos
  ).length
  const consultasComNotas = consultasConcluidas.filter(
    (c) => (c.registroPosConsulta?.observacoes || '').trim().length > 0
  ).length

  const stats = [
    { label: 'Concluídas', value: totalConcluidas, icon: FileText, text: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Exames registrados', value: consultasComExames, icon: FlaskConical, text: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Medicamentos', value: consultasComMedicamentos, icon: Pill, text: 'text-cyan-600', bg: 'bg-cyan-50' },
    { label: 'Anotações', value: consultasComNotas, icon: BookOpen, text: 'text-emerald-600', bg: 'bg-emerald-50' }
  ]

  const parseLista = (texto = '') =>
    texto
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

  const buildInitialState = (consulta) => {
    const registro = consulta.registroPosConsulta || {}
    const exames = registro.examesSolicitados || []
    const medicamentos = registro.medicamentosPrescritos || []

    return {
      solicitouExames: registro.solicitouExames ?? exames.length > 0,
      exames: exames.join(', '),
      prescreveuMedicamentos: registro.prescreveuMedicamentos ?? medicamentos.length > 0,
      medicamentos: medicamentos.join(', '),
      observacoes: registro.observacoes || ''
    }
  }

  const getFormState = (consulta) => formState[consulta.id] || buildInitialState(consulta)

  const handleChange = (consulta, field, value) => {
    setFormState((prev) => ({
      ...prev,
      [consulta.id]: {
        ...getFormState(consulta),
        [field]: value
      }
    }))
  }

  const handleSalvar = (consulta) => {
    const form = getFormState(consulta)
    const payload = {
      solicitouExames: form.solicitouExames,
      examesSolicitados: form.solicitouExames ? parseLista(form.exames) : [],
      prescreveuMedicamentos: form.prescreveuMedicamentos,
      medicamentosPrescritos: form.prescreveuMedicamentos ? parseLista(form.medicamentos) : [],
      observacoes: form.observacoes?.trim() || ''
    }

    setSavingId(consulta.id)
    if (onSalvarRegistro) {
      onSalvarRegistro(consulta.id, payload)
    }

    setFormState((prev) => ({
      ...prev,
      [consulta.id]: {
        solicitouExames: payload.solicitouExames,
        exames: payload.examesSolicitados.join(', '),
        prescreveuMedicamentos: payload.prescreveuMedicamentos,
        medicamentos: payload.medicamentosPrescritos.join(', '),
        observacoes: payload.observacoes
      }
    }))
    setSavingId(null)
    setExpandedId(null)
  }

  const registrosFiltrados = concluidasOrdenadas.filter((consulta) => {
    if (!searchQuery.trim()) return true
    const termo = searchQuery.toLowerCase()
    const registro = consulta.registroPosConsulta || {}
    const campos = [
      consulta.medico,
      consulta.especialidade,
      consulta.motivo,
      registro.observacoes,
      (registro.examesSolicitados || []).join(' '),
      (registro.medicamentosPrescritos || []).join(' ')
    ]
    return campos.some((campo) => (campo || '').toLowerCase().includes(termo))
  })

  return (
    <div className="p-6 sm:p-8 space-y-8">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6 flex items-center gap-4`}>
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
          <ClipboardList className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Meu Prontuário Médico
          </h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Registre exames, medicamentos e um diário rápido logo após cada consulta concluída.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label + index}
              className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border rounded-xl p-4 flex items-center gap-3 shadow-sm`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${darkMode ? 'bg-gray-700' : stat.bg}`}>
                <Icon className={`w-6 h-6 ${stat.text}`} />
              </div>
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-4 sm:p-6`}>
        <div className="relative">
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por médico, especialidade, exame ou medicamento"
            className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
      </div>

      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md`}> 
        <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h3 className={`font-semibold flex items-center gap-2 ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
            <FileText className="w-5 h-5" />
            Registros Médicos ({registrosFiltrados.length})
          </h3>
        </div>

        {registrosFiltrados.length === 0 ? (
          <div className="p-10 text-center">
            <div className="w-20 h-20 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
              <FileText className="w-10 h-10 text-blue-600" />
            </div>
            <p className={`text-lg font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {totalConcluidas === 0 ? 'Finalize uma consulta para começar' : 'Nenhum registro encontrado para sua busca'}
            </p>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {totalConcluidas === 0
                ? 'Assim que você marcar uma consulta como concluída, poderá registrar exames, medicamentos e observações aqui.'
                : 'Tente outro termo ou limpe a busca para ver todos os registros.'}
            </p>
          </div>
        ) : (
          <div className={darkMode ? 'divide-y divide-gray-700' : 'divide-y divide-gray-200'}>
            {registrosFiltrados.map((consulta) => {
              const registro = consulta.registroPosConsulta || {}
              const exames = registro.examesSolicitados || []
              const medicamentos = registro.medicamentosPrescritos || []
              const dataHora = consulta.dataHora ? new Date(consulta.dataHora) : null
              const atualizadoEm = registro.atualizadoEm
                ? new Date(registro.atualizadoEm).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : null
              const form = getFormState(consulta)

              const toggleSection = () => {
                setExpandedId(expandedId === consulta.id ? null : consulta.id)
                if (!formState[consulta.id]) {
                  setFormState((prev) => ({ ...prev, [consulta.id]: buildInitialState(consulta) }))
                }
              }

              return (
                <div key={consulta.id} className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {consulta.medico || 'Profissional não informado'}
                        </p>
                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                          {consulta.especialidade || 'Especialidade não informada'}
                        </p>
                        {dataHora && (
                          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm flex items-center gap-2 mt-1`}>
                            <Clock className="w-4 h-4" />
                            {dataHora.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })} às{' '}
                            {dataHora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        )}
                        {atualizadoEm && (
                          <p className={`${darkMode ? 'text-gray-500' : 'text-gray-500'} text-xs mt-1`}>
                            Atualizado em {atualizadoEm}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          exames.length > 0 || registro.solicitouExames
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {exames.length > 0 || registro.solicitouExames ? 'Exames registrados' : 'Sem exames'}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          medicamentos.length > 0 || registro.prescreveuMedicamentos
                            ? 'bg-cyan-100 text-cyan-700'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {medicamentos.length > 0 || registro.prescreveuMedicamentos ? 'Medicamentos registrados' : 'Sem medicamentos'}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          (registro.observacoes || '').trim()
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {(registro.observacoes || '').trim() ? 'Diário preenchido' : 'Sem anotações'}
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                      <p className={`text-sm font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Exames solicitados
                      </p>
                      {exames.length > 0 ? (
                        <ul className={`text-sm list-disc pl-4 space-y-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                          {exames.map((exam, idx) => (
                            <li key={exam + idx}>{exam}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Nenhum exame registrado.</p>
                      )}
                    </div>

                    <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                      <p className={`text-sm font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Medicamentos prescritos
                      </p>
                      {medicamentos.length > 0 ? (
                        <ul className={`text-sm list-disc pl-4 space-y-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                          {medicamentos.map((med, idx) => (
                            <li key={med + idx}>{med}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Nenhum medicamento registrado.</p>
                      )}
                    </div>
                  </div>

                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4 mt-4`}>
                    <p className={`text-sm font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Diário da consulta
                    </p>
                    {(registro.observacoes || '').trim() ? (
                      <p className={`${darkMode ? 'text-gray-200' : 'text-gray-700'} text-sm whitespace-pre-line`}>
                        {registro.observacoes}
                      </p>
                    ) : (
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                        Nenhuma anotação ainda.
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <button
                      onClick={toggleSection}
                      className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${
                        darkMode ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                      } transition`}
                    >
                      {expandedId === consulta.id ? <X className="w-4 h-4" /> : <ClipboardList className="w-4 h-4" />}
                      {expandedId === consulta.id ? 'Fechar diário' : 'Atualizar diário pós-consulta'}
                    </button>
                  </div>

                  {expandedId === consulta.id && (
                    <div className={`${darkMode ? 'bg-gray-900/40' : 'bg-blue-50'} rounded-lg p-4 mt-4 space-y-4`}>
                      <div className="space-y-2">
                        <label className={`flex items-center gap-2 text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          <input
                            type="checkbox"
                            checked={form.solicitouExames}
                            onChange={(e) =>
                              handleChange(consulta, 'solicitouExames', e.target.checked)
                            }
                            className="w-4 h-4"
                          />
                          Foram solicitados exames?
                        </label>
                        {form.solicitouExames && (
                          <textarea
                            value={form.exames}
                            onChange={(e) => handleChange(consulta, 'exames', e.target.value)}
                            placeholder="Ex: Hemograma, Raio-X de tórax, Ressonância..."
                            className={`w-full rounded-lg border px-3 py-2 text-sm ${
                              darkMode
                                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            rows={3}
                          />
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className={`flex items-center gap-2 text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          <input
                            type="checkbox"
                            checked={form.prescreveuMedicamentos}
                            onChange={(e) =>
                              handleChange(consulta, 'prescreveuMedicamentos', e.target.checked)
                            }
                            className="w-4 h-4"
                          />
                          Foram prescritos medicamentos?
                        </label>
                        {form.prescreveuMedicamentos && (
                          <textarea
                            value={form.medicamentos}
                            onChange={(e) => handleChange(consulta, 'medicamentos', e.target.value)}
                            placeholder="Ex: Amoxicilina 500mg 8/8h por 7 dias; Dipirona 500mg se dor"
                            className={`w-full rounded-lg border px-3 py-2 text-sm ${
                              darkMode
                                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            rows={3}
                          />
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Observações rápidas / diário do paciente
                        </label>
                        <textarea
                          value={form.observacoes}
                          onChange={(e) => handleChange(consulta, 'observacoes', e.target.value)}
                          placeholder="Dicas do médico, sinais para observar, prazos de retorno, etc."
                          className={`w-full rounded-lg border px-3 py-2 text-sm ${
                            darkMode
                              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          rows={4}
                        />
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => handleSalvar(consulta)}
                          disabled={savingId === consulta.id}
                          className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${
                            darkMode ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                          } transition disabled:opacity-60`}
                        >
                          <Check className="w-4 h-4" />
                          {savingId === consulta.id ? 'Salvando...' : 'Salvar registro'}
                        </button>
                        <button
                          onClick={() => {
                            setFormState((prev) => ({ ...prev, [consulta.id]: buildInitialState(consulta) }))
                            setExpandedId(null)
                          }}
                          className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${
                            darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                          } transition`}
                        >
                          <X className="w-4 h-4" />
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
