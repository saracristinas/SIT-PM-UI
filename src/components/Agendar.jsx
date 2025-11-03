import React, { useState } from 'react'
import { Calendar, ArrowLeft, Building2, Video } from 'lucide-react'

export default function Agendar({ darkMode, onBack }) {
  const [formData, setFormData] = useState({
    datetime: '',
    type: 'presencial',
    medico: '',
    motivo: ''
  })

  return (
    <div className="p-8">
      {/* Header */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6 mb-8`}>
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition`}
            >
              <ArrowLeft className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
          )}
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-400 rounded-xl flex items-center justify-center">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Agendar Nova Consulta
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
              Preencha os dados para marcar seu atendimento
            </p>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-8 max-w-4xl`}>
        <div className={`mb-6 pb-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`text-lg font-semibold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
            Dados da Consulta
          </h2>
        </div>

        <div className="space-y-6">
          {/* Data e Horário */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Data e Horário <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={formData.datetime}
              onChange={(e) => setFormData({ ...formData, datetime: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg border ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
            />
          </div>

          {/* Tipo de Consulta */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Tipo de Consulta <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setFormData({ ...formData, type: 'presencial' })}
                className={`p-6 rounded-lg border-2 transition ${
                  formData.type === 'presencial'
                    ? 'border-emerald-500 bg-emerald-50'
                    : darkMode
                    ? 'border-gray-600 bg-gray-700 hover:border-gray-500'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <Building2 className={`w-8 h-8 mx-auto mb-3 ${formData.type === 'presencial' ? 'text-emerald-600' : darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <p className={`font-semibold mb-1 ${formData.type === 'presencial' ? 'text-emerald-900' : darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Presencial
                </p>
                <p className={`text-sm ${formData.type === 'presencial' ? 'text-emerald-700' : darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Atendimento na clínica
                </p>
              </button>

              <button
                onClick={() => setFormData({ ...formData, type: 'online' })}
                className={`p-6 rounded-lg border-2 transition ${
                  formData.type === 'online'
                    ? 'border-emerald-500 bg-emerald-50'
                    : darkMode
                    ? 'border-gray-600 bg-gray-700 hover:border-gray-500'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <Video className={`w-8 h-8 mx-auto mb-3 ${formData.type === 'online' ? 'text-emerald-600' : darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <p className={`font-semibold mb-1 ${formData.type === 'online' ? 'text-emerald-900' : darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Online
                </p>
                <p className={`text-sm ${formData.type === 'online' ? 'text-emerald-700' : darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Teleconsulta
                </p>
              </button>
            </div>
          </div>

          {/* Médico (Opcional) */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              🩺 Médico (Opcional)
            </label>
            <select
              value={formData.medico}
              onChange={(e) => setFormData({ ...formData, medico: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg border ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
            >
              <option value="">Selecione um médico</option>
              <option value="dr-silva">Dr. João Silva - Clínico Geral</option>
              <option value="dra-santos">Dra. Maria Santos - Cardiologista</option>
              <option value="dr-oliveira">Dr. Pedro Oliveira - Ortopedista</option>
            </select>
            <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Deixe em branco para que a clínica atribua um médico automaticamente
            </p>
          </div>

          {/* Motivo da Consulta */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Motivo da Consulta <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.motivo}
              onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
              placeholder="Descreva brevemente o motivo da consulta..."
              rows={4}
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
              className={`flex-1 px-6 py-3 rounded-lg border ${
                darkMode
                  ? 'border-gray-600 text-white hover:bg-gray-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              } font-medium transition`}
            >
              Cancelar
            </button>
            <button className="flex-1 px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition">
              Agendar Consulta
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
