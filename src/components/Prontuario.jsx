import React, { useState } from 'react'
import { FileText, Search } from 'lucide-react'

export default function Prontuario({ darkMode }) {
  const [searchQuery, setSearchQuery] = useState('')

  const stats = [
    { label: 'Total', value: 0, color: 'emerald' },
    { label: 'Consultas', value: 0, color: 'blue' },
    { label: 'Exames', value: 0, color: 'purple' },
    { label: 'Receitas', value: 0, color: 'cyan' }
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6 mb-8`}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-400 rounded-xl flex items-center justify-center">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Meu Prontuário Médico
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
              Histórico completo de atendimentos e documentos
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const getTextColor = (color) => {
            const colors = {
              emerald: 'text-emerald-600',
              blue: 'text-blue-600',
              purple: 'text-purple-600',
              cyan: 'text-cyan-600'
            }
            return colors[color] || 'text-gray-600'
          }

          const getBgColor = (color) => {
            const colors = {
              emerald: 'bg-emerald-50',
              blue: 'bg-blue-50',
              purple: 'bg-purple-50',
              cyan: 'bg-cyan-50'
            }
            return colors[color] || 'bg-gray-50'
          }

          return (
            <div
              key={index}
              className={`${getBgColor(stat.color)} rounded-xl p-6 border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}
            >
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                {stat.label}
              </p>
              <p className={`text-3xl font-bold ${getTextColor(stat.color)}`}>
                {stat.value}
              </p>
            </div>
          )
        })}
      </div>

      {/* Busca */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6 mb-8`}>
        <div className="relative">
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por título, descrição ou médico..."
            className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
          />
        </div>
      </div>

      {/* Registros Médicos */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md overflow-hidden`}>
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className={`font-semibold flex items-center gap-2 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
            <FileText className="w-5 h-5" />
            Registros Médicos (0)
          </h3>
        </div>

        {/* Estado Vazio */}
        <div className="p-12">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-24 h-24 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
              <FileText className="w-12 h-12 text-emerald-600" />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Nenhum registro encontrado
            </h3>
            <p className={`text-center max-w-md ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Seu histórico médico aparecerá aqui
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
