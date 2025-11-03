import React, { useState } from 'react'
import { Calendar, CheckCircle, Clock, Eye, Trash2, X, Edit2, Check } from 'lucide-react'

export default function Consultas({ darkMode, onNavigate, consultas = [], onEditarConsulta }) {
  const [selectedConsulta, setSelectedConsulta] = useState(null)
  const [editingConsulta, setEditingConsulta] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)

  const consultasAgendadas = consultas.filter(c => c.status === 'agendada')
  const consultasConcluidas = consultas.filter(c => c.status === 'concluida')

  const stats = [
    { label: 'Agendadas', value: consultasAgendadas.length, icon: Clock, color: 'blue' },
    { label: 'Concluídas', value: consultasConcluidas.length, icon: CheckCircle, color: 'emerald' },
    { label: 'Total', value: consultas.length, icon: Calendar, color: 'gray' }
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6 mb-8`}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-400 rounded-xl flex items-center justify-center">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Minhas Consultas
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
              Gerencie seus agendamentos
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const colorClasses = {
            blue: 'bg-blue-100 text-blue-600',
            emerald: 'bg-emerald-100 text-emerald-600',
            gray: 'bg-gray-100 text-gray-600'
          }
          
          return (
            <div
              key={index}
              className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                    {stat.label}
                  </p>
                  <p className={`text-3xl font-bold ${stat.color === 'blue' ? 'text-blue-600' : stat.color === 'emerald' ? 'text-emerald-600' : darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${colorClasses[stat.color]}`}>
                  <Icon className="w-8 h-8" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Lista de Consultas */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6`}>
        <div className="flex items-center gap-3 mb-6">
          <Clock className={`w-5 h-5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
          <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Consultas Agendadas
          </h3>
        </div>

        {consultas.length === 0 ? (
          /* Estado Vazio */
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-24 h-24 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
              <Calendar className="w-12 h-12 text-emerald-600" />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Nenhuma consulta agendada
            </h3>
            <p className={`text-center mb-8 max-w-md ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Agende sua primeira consulta para começar
            </p>
            <button 
              onClick={() => onNavigate('agendar')}
              className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition"
            >
              Agendar Consulta
            </button>
          </div>
        ) : (
          /* Lista de Consultas */
          <div className="space-y-4">
            {consultas.map((consulta) => (
              <div
                key={consulta.id}
                className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6 border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${darkMode ? 'bg-emerald-900' : 'bg-emerald-100'}`}>
                      <Calendar className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-bold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {new Date(consulta.dataHora).toLocaleDateString('pt-BR', { 
                          day: '2-digit', 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </h4>
                      <p className={`text-emerald-600 font-medium mb-3`}>
                        {new Date(consulta.dataHora).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                      <div className={`space-y-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <p><span className="font-medium">Médico:</span> {consulta.medico || 'A definir'}</p>
                        <p><span className="font-medium">Motivo:</span> {consulta.motivo || 'Não especificado'}</p>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          consulta.tipo === 'presencial' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {consulta.tipo === 'presencial' ? '🏥 Presencial' : '💻 Online'}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {consulta.status === 'agendada' ? 'Agendada' : 'Concluída'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedConsulta(consulta)}
                      className={`p-2 rounded-lg ${darkMode ? 'bg-emerald-900 hover:bg-emerald-800' : 'bg-emerald-100 hover:bg-emerald-200'} transition`}
                      title="Ver detalhes"
                    >
                      <Eye className="w-5 h-5 text-emerald-600" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingConsulta(consulta)
                        setEditForm({
                          dataHora: consulta.dataHora,
                          tipo: consulta.tipo,
                          medico: consulta.medico,
                          motivo: consulta.motivo
                        })
                      }}
                      className={`p-2 rounded-lg ${darkMode ? 'bg-blue-900 hover:bg-blue-800' : 'bg-blue-100 hover:bg-blue-200'} transition`}
                      title="Editar consulta"
                    >
                      <Edit2 className="w-5 h-5 text-blue-600" />
                    </button>
                    <button 
                      className={`p-2 rounded-lg ${darkMode ? 'bg-red-900 hover:bg-red-800' : 'bg-red-100 hover:bg-red-200'} transition`}
                      title="Excluir consulta"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Detalhes */}
      {selectedConsulta && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl max-w-md w-full p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Detalhes da Consulta
              </h3>
              <button
                onClick={() => setSelectedConsulta(null)}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition`}
              >
                <X className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Data e Hora
                </label>
                <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {new Date(selectedConsulta.dataHora).toLocaleDateString('pt-BR', { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric' 
                  })} às {new Date(selectedConsulta.dataHora).toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Tipo
                  </label>
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      selectedConsulta.tipo === 'presencial' 
                        ? 'bg-blue-900 text-blue-100' 
                        : 'bg-purple-900 text-purple-100'
                    }`}>
                      {selectedConsulta.tipo === 'presencial' ? 'presencial' : 'online'}
                    </span>
                  </div>
                </div>

                <div className="flex-1">
                  <label className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Status
                  </label>
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-900 text-blue-100">
                      {selectedConsulta.status === 'agendada' ? 'Agendada' : 'Concluída'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Médico
                </label>
                <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedConsulta.medico || 'Não atribuído'}
                </p>
              </div>

              <div>
                <label className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Motivo
                </label>
                <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedConsulta.motivo || 'Não especificado'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {editingConsulta && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl max-w-2xl w-full p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Editar Consulta
              </h3>
              <button
                onClick={() => {
                  setEditingConsulta(null)
                  setEditForm({})
                }}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition`}
              >
                <X className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Data e Hora */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Data e Horário <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={editForm.dataHora || ''}
                  onChange={(e) => setEditForm({ ...editForm, dataHora: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                />
              </div>

              {/* Médico */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Médico
                </label>
                <input
                  type="text"
                  value={editForm.medico || ''}
                  onChange={(e) => setEditForm({ ...editForm, medico: e.target.value })}
                  placeholder="Nome do médico"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                />
              </div>

              {/* Motivo */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Motivo
                </label>
                <textarea
                  value={editForm.motivo || ''}
                  onChange={(e) => setEditForm({ ...editForm, motivo: e.target.value })}
                  placeholder="Motivo da consulta"
                  rows={3}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none`}
                />
              </div>

              {/* Botões */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => {
                    setEditingConsulta(null)
                    setEditForm({})
                  }}
                  disabled={isSaving}
                  className={`flex-1 px-6 py-3 rounded-lg border ${
                    darkMode
                      ? 'border-gray-600 text-white hover:bg-gray-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  } font-medium transition ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (!editForm.dataHora) {
                      alert('Por favor, preencha a data e hora.')
                      return
                    }
                    
                    setIsSaving(true)
                    
                    setTimeout(() => {
                      onEditarConsulta(editingConsulta.id, editForm)
                      setIsSaving(false)
                      setEditingConsulta(null)
                      setEditForm({})
                      
                      // Mostrar toast de sucesso
                      setShowSuccessToast(true)
                      setTimeout(() => setShowSuccessToast(false), 3000)
                    }, 800)
                  }}
                  disabled={isSaving}
                  className={`flex-1 px-6 py-3 rounded-lg font-medium transition ${
                    isSaving
                      ? 'bg-emerald-300 cursor-not-allowed'
                      : 'bg-emerald-500 hover:bg-emerald-600'
                  } text-white`}
                >
                  {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast de Sucesso */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-emerald-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">Consulta atualizada!</p>
              <p className="text-sm text-emerald-100">As alterações foram salvas com sucesso.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
