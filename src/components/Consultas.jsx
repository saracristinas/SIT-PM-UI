import React from 'react'
import { Calendar, CheckCircle, Clock } from 'lucide-react'

export default function Consultas({ darkMode }) {
  const stats = [
    { label: 'Agendadas', value: 0, icon: Clock, color: 'blue' },
    { label: 'Concluídas', value: 0, icon: CheckCircle, color: 'emerald' },
    { label: 'Total', value: 0, icon: Calendar, color: 'gray' }
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

      {/* Lista de Consultas - Estado Vazio */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-12`}>
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
          <button className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition">
            Agendar Consulta
          </button>
        </div>
      </div>
    </div>
  )
}
