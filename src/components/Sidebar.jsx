import React from 'react'
import { Calendar, FileText, Clock, Clipboard, Moon, LogOut, LayoutGrid, Bot, HeartPulse } from 'lucide-react'

export default function Sidebar({ darkMode, setDarkMode, currentPage, setCurrentPage, sidebarOpen, setSidebarOpen }) {
  const menuItems = [
    { id: 'inicio', label: 'Início', icon: LayoutGrid },
    { id: 'triagem', label: 'Triagem IA', icon: Bot },
    { id: 'agendar', label: 'Agendar', icon: Calendar },
    { id: 'consultas', label: 'Consultas', icon: FileText },
    { id: 'prontuario', label: 'Prontuário', icon: Clipboard }
  ]

  const handleMenuClick = (pageId) => {
    setCurrentPage(pageId)
    if (setSidebarOpen) setSidebarOpen(false) // Fecha sidebar no mobile após clicar
  }

  return (
    <div className={`fixed left-0 top-0 h-full w-72 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg z-50 flex flex-col transition-transform duration-300 ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    }`}>
      {/* Logo */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 p-6">
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
            <HeartPulse className="w-8 h-8 text-emerald-600" strokeWidth={2} />
          </div>
          <div className="text-white">
            <div className="font-bold text-xl">SITPM</div>
            <div className="text-xs opacity-90 leading-tight">Sistema Inteligente de<br/>Triagem</div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 px-6 py-6">
        <div className="text-xs font-bold mb-4 text-emerald-600 tracking-wide">
          MENU PRINCIPAL
        </div>
        
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 text-white shadow-md'
                    : darkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className={`px-6 pb-6 pt-6 space-y-3 border-t ${darkMode ? 'border-gray-700' : 'border-emerald-200'}`}>
        {/* Modo Escuro */}
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 border-2 ${
            darkMode 
              ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
              : 'border-emerald-500 text-emerald-700 hover:bg-emerald-50'
          } rounded-lg transition-all font-medium`}
        >
          <Moon className="w-4 h-4" />
          <span className="text-sm">Modo Escuro</span>
        </button>
        
        {/* User Info */}
        <div className={`${
          darkMode ? 'bg-gray-700' : 'bg-gray-50'
        } rounded-xl p-4 border-2 ${
          darkMode ? 'border-gray-600' : 'border-gray-100'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              S
            </div>
            <div className="flex-1 min-w-0">
              <div className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'} truncate`}>
                Sara Sales
              </div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-emerald-600'}`}>
                Paciente
              </div>
            </div>
          </div>
        </div>
        
        {/* Sair */}
        <button className={`w-full flex items-center justify-center gap-2 px-4 py-3 ${
          darkMode 
            ? 'text-gray-400 hover:bg-gray-700 hover:text-white' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        } rounded-lg transition-all`}>
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Sair do Sistema</span>
        </button>
      </div>
    </div>
  )
}
