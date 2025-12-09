import React, { useState, useEffect } from 'react'
import { Check, Menu, X, Moon, HeartPulse } from 'lucide-react'
import Sidebar from './components/common/Sidebar'
import SITPMDashboard from './components/dashboard/SITPMDashboard'
import TriagemIA from './components/medical/TriagemIA'
import Agendar from './components/scheduling/Agendar'
import Consultas from './components/scheduling/Consultas'
import Prontuario from './components/medical/Prontuario'
import Auth from './components/auth/Auth'

export default function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [currentPage, setCurrentPage] = useState('inicio')
  const [consultas, setConsultas] = useState([])
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [toastMessage, setToastMessage] = useState({ title: '', subtitle: '' })
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Verifica se há um usuário logado ao carregar o app
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Erro ao carregar usuário:', error)
        localStorage.removeItem('user')
      }
    }
    
    // Carrega consultas do localStorage
    const storedConsultas = localStorage.getItem('consultas')
    if (storedConsultas) {
      try {
        const parsed = JSON.parse(storedConsultas)
        setConsultas(parsed)
        console.log('✅ Consultas carregadas do localStorage:', parsed.length)
      } catch (error) {
        console.error('Erro ao carregar consultas:', error)
        setConsultas([])
      }
    } else {
      console.log('ℹ️ Nenhuma consulta encontrada no localStorage')
    }
    
    setIsLoading(false)
  }, [])

  // Salva consultas no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('consultas', JSON.stringify(consultas))
    console.log('📝 Consultas salvas no localStorage:', consultas.length)
  }, [consultas])

  const handleAuthSuccess = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    setCurrentPage('inicio')
    setToastMessage({
      title: 'Você saiu do sistema',
      subtitle: 'Até logo!'
    })
    setShowSuccessToast(true)
    setTimeout(() => {
      setShowSuccessToast(false)
    }, 3000)
  }

  const handleAgendarConsulta = (novaConsulta) => {
    setConsultas([...consultas, novaConsulta])
    
    // Mostrar toast
    setToastMessage({
      title: 'Consulta agendada com sucesso!',
      subtitle: 'Sua consulta foi registrada.'
    })
    setShowSuccessToast(true)
    
    // Esconder após 5 segundos
    setTimeout(() => {
      setShowSuccessToast(false)
    }, 5000)
  }

  const handleEditarConsulta = (consultaId, dadosAtualizados) => {
    setConsultas(consultas.map(consulta => 
      consulta.id === consultaId 
        ? { ...consulta, ...dadosAtualizados }
        : consulta
    ))
    
    // Mostrar toast
    setToastMessage({
      title: 'Consulta atualizada!',
      subtitle: 'As alterações foram salvas com sucesso.'
    })
    setShowSuccessToast(true)
    
    // Esconder após 5 segundos
    setTimeout(() => {
      setShowSuccessToast(false)
    }, 5000)
  }

  const handleExcluirConsulta = (consultaId) => {
    setConsultas(consultas.map(consulta => 
      consulta.id === consultaId 
        ? { ...consulta, status: 'cancelada' }
        : consulta
    ))
    
    // Mostrar toast
    setToastMessage({
      title: 'Consulta cancelada!',
      subtitle: 'A consulta foi marcada como cancelada.'
    })
    setShowSuccessToast(true)
    
    // Esconder após 5 segundos
    setTimeout(() => {
      setShowSuccessToast(false)
    }, 5000)
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'inicio':
        return <SITPMDashboard darkMode={darkMode} onNavigate={setCurrentPage} consultas={consultas} />
      case 'triagem':
        return <TriagemIA darkMode={darkMode} onAgendarConsulta={handleAgendarConsulta} />
      case 'agendar':
        return <Agendar darkMode={darkMode} onNavigate={setCurrentPage} onAgendarConsulta={handleAgendarConsulta} />
      case 'consultas':
        return <Consultas darkMode={darkMode} onNavigate={setCurrentPage} consultas={consultas} onEditarConsulta={handleEditarConsulta} onExcluirConsulta={handleExcluirConsulta} />
      case 'prontuario':
        return <Prontuario darkMode={darkMode} />
      default:
        return <SITPMDashboard darkMode={darkMode} onNavigate={setCurrentPage} consultas={consultas} />
    }
  }

  // Loading inicial
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Carregando...</p>
        </div>
      </div>
    )
  }

  // Se não houver usuário logado, mostra tela de autenticação
  if (!user) {
    return <Auth darkMode={darkMode} onAuthSuccess={handleAuthSuccess} />
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-[#EFFDF9]'}`}>
      {/* Top Header Mobile/Tablet */}
      <div className={`fixed top-0 left-0 right-0 h-16 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md z-40 lg:hidden`}>
        <div className="flex items-center justify-between h-full px-4">
          {/* Menu Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo Center */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-lg flex items-center justify-center">
              <HeartPulse className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <span className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>SITPM</span>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}
          >
            <Moon className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar 
        darkMode={darkMode} 
        setDarkMode={setDarkMode}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
        onLogout={handleLogout}
      />
      <div className="lg:ml-72 pt-16 lg:pt-0">
        {renderPage()}
      </div>

      {/* Toast de Sucesso Global */}
      {showSuccessToast && (
        <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 z-50 animate-slide-in">
          <div className="bg-emerald-500 text-white px-4 py-3 sm:px-6 sm:py-4 rounded-lg shadow-lg flex items-center gap-3 max-w-sm sm:min-w-[300px]">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm sm:text-base truncate">{toastMessage.title}</p>
              <p className="text-xs sm:text-sm text-emerald-100 truncate">{toastMessage.subtitle}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
