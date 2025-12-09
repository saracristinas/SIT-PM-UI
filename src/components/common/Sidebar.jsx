import React, { useState } from 'react'
import { Calendar, FileText, Clock, Clipboard, Moon, LogOut, LayoutGrid, Bot, HeartPulse, User, Trash2 } from 'lucide-react'

export default function Sidebar({ darkMode, setDarkMode, currentPage, setCurrentPage, sidebarOpen, setSidebarOpen, user, onLogout }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleDeleteAllData = () => {
    // Remove todos os dados do sistema
    localStorage.removeItem('consultas')
    localStorage.removeItem('reminderConfig')
    localStorage.removeItem('reminderHistory')
    
    // Remove flags de lembretes enviados
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('lembrete_enviado_') || key.startsWith('link_unico_enviado_')) {
        localStorage.removeItem(key)
      }
    })
    
    setShowDeleteModal(false)
    alert('✅ Todos os dados foram apagados com sucesso!')
    
    // Recarrega a página para refletir mudanças
    window.location.reload()
  }
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
      <div className="bg-gradient-to-r from-blue-400 to-cyan-400 p-6">
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
            <HeartPulse className="w-8 h-8 text-blue-600" strokeWidth={2} />
          </div>
          <div className="text-white">
            <div className="font-bold text-xl">SITPM</div>
            <div className="text-xs opacity-90 leading-tight">Sistema Inteligente de<br/>Triagem</div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 px-6 py-6">
        <div className="text-xs font-bold mb-4 text-blue-600 tracking-wide">
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
                    ? 'bg-gradient-to-r from-blue-400 to-cyan-400 text-white shadow-md'
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
      <div className={`px-6 pb-6 pt-6 space-y-3 border-t ${darkMode ? 'border-gray-700' : 'border-blue-200'}`}>
        {/* Limpar Dados */}
        <button 
          onClick={() => setShowDeleteModal(true)}
          className={`w-full flex items-center justify-center gap-1.5 px-3 py-2 ${
            darkMode 
              ? 'text-orange-400 hover:bg-orange-900/20 hover:text-orange-300' 
              : 'text-orange-600 hover:bg-orange-50 hover:text-orange-700'
          } rounded-lg transition-all font-medium border ${
            darkMode ? 'border-orange-800' : 'border-orange-200'
          }`}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="text-xs">Limpar Tudo</span>
        </button>

        {/* Modo Escuro - Apenas Desktop */}
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className={`hidden lg:flex w-full items-center justify-center gap-2 px-4 py-3 border-2 ${
            darkMode 
              ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
              : 'border-blue-500 text-blue-700 hover:bg-blue-50'
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
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-11 h-11 rounded-xl object-cover"
              />
            ) : (
              <div className="w-11 h-11 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                {user?.name?.charAt(0).toUpperCase() || <User className="w-6 h-6" />}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'} truncate`}>
                {user?.name || 'Usuário'}
              </div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-blue-600'} truncate`}>
                {user?.email || 'Paciente'}
              </div>
            </div>
          </div>
        </div>
        
        {/* Sair */}
        <button 
          onClick={onLogout}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 ${
            darkMode 
              ? 'text-red-400 hover:bg-red-900/20 hover:text-red-300' 
              : 'text-red-600 hover:bg-red-50 hover:text-red-700'
          } rounded-lg transition-all font-medium`}
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Sair do Sistema</span>
        </button>
      </div>

      {/* Modal de Confirmação */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl max-w-md w-full p-6`}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Apagar Todos os Dados?
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Esta ação irá remover permanentemente:
              </p>
            </div>

            <div className={`${darkMode ? 'bg-gray-700' : 'bg-red-50'} rounded-xl p-4 mb-6`}>
              <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <li className="flex items-center gap-2">
                  <span className="text-red-500">✗</span>
                  Todas as consultas agendadas
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500">✗</span>
                  Histórico de prontuário
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500">✗</span>
                  Configurações de lembretes
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500">✗</span>
                  Histórico de triagens
                </li>
              </ul>
            </div>

            <div className={`${darkMode ? 'bg-yellow-900/20 border-yellow-700' : 'bg-yellow-50 border-yellow-200'} border-2 rounded-xl p-3 mb-6`}>
              <p className={`text-xs font-semibold ${darkMode ? 'text-yellow-400' : 'text-yellow-800'}`}>
                ⚠️ ATENÇÃO: Esta ação não pode ser desfeita!
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                  darkMode
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAllData}
                className="flex-1 px-4 py-3 rounded-xl font-semibold transition-all bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg hover:shadow-xl hover:scale-105"
              >
                Sim, Apagar Tudo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
