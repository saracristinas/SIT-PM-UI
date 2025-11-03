import React from 'react'
import { Calendar, FileText, Clock, Clipboard, Moon, LogOut } from 'lucide-react'

export default function Sidebar({ darkMode, setDarkMode, currentPage, setCurrentPage }) {
  const menuItems = [
    { id: 'inicio', label: 'Início', icon: Clipboard },
    { id: 'triagem', label: 'Triagem IA', icon: Clock },
    { id: 'agendar', label: 'Agendar', icon: Calendar },
    { id: 'consultas', label: 'Consultas', icon: FileText },
    { id: 'prontuario', label: 'Prontuário', icon: Clipboard }
  ]

  return (
    <div className={`fixed left-0 top-0 h-full w-52 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg z-50`}>
      {/* Logo */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 p-4">
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-lg p-2">
            <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <div className="text-white">
            <div className="font-bold text-lg">SITPM</div>
            <div className="text-xs opacity-90">Sistema Inteligente de Triagem</div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="p-4">
        <div className={`text-xs font-semibold mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          MENU PRINCIPAL
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
                  isActive
                    ? 'bg-emerald-500 text-white'
                    : darkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="absolute bottom-4 left-4 right-4 space-y-3">
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'} rounded-lg transition`}
        >
          <Moon className="w-4 h-4" />
          Modo Escuro
        </button>
        
        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-3`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">
              S
            </div>
            <div className="flex-1">
              <div className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>Sara Sales</div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Paciente</div>
            </div>
          </div>
        </div>
        
        <button className={`w-full flex items-center justify-center gap-2 px-4 py-2 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} rounded-lg transition`}>
          <LogOut className="w-4 h-4" />
          Sair do Sistema
        </button>
      </div>
    </div>
  )
}
