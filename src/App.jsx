import React, { useState } from 'react'
import { Check } from 'lucide-react'
import Sidebar from './components/Sidebar'
import SITPMDashboard from './components/SITPMDashboard'
import TriagemIA from './components/TriagemIA'
import Agendar from './components/Agendar'
import Consultas from './components/Consultas'
import Prontuario from './components/Prontuario'

export default function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [currentPage, setCurrentPage] = useState('inicio')
  const [consultas, setConsultas] = useState([])
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [toastMessage, setToastMessage] = useState({ title: '', subtitle: '' })

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
        return <TriagemIA darkMode={darkMode} />
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

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Sidebar 
        darkMode={darkMode} 
        setDarkMode={setDarkMode}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <div className="ml-52">
        {renderPage()}
      </div>

      {/* Toast de Sucesso Global */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-emerald-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">{toastMessage.title}</p>
              <p className="text-sm text-emerald-100">{toastMessage.subtitle}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
