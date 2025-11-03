import React, { useState } from 'react'
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

  const handleAgendarConsulta = (novaConsulta) => {
    setConsultas([...consultas, novaConsulta])
  }

  const handleEditarConsulta = (consultaId, dadosAtualizados) => {
    setConsultas(consultas.map(consulta => 
      consulta.id === consultaId 
        ? { ...consulta, ...dadosAtualizados }
        : consulta
    ))
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'inicio':
        return <SITPMDashboard darkMode={darkMode} onNavigate={setCurrentPage} />
      case 'triagem':
        return <TriagemIA darkMode={darkMode} />
      case 'agendar':
        return <Agendar darkMode={darkMode} onNavigate={setCurrentPage} onAgendarConsulta={handleAgendarConsulta} />
      case 'consultas':
        return <Consultas darkMode={darkMode} onNavigate={setCurrentPage} consultas={consultas} onEditarConsulta={handleEditarConsulta} />
      case 'prontuario':
        return <Prontuario darkMode={darkMode} />
      default:
        return <SITPMDashboard darkMode={darkMode} onNavigate={setCurrentPage} />
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
    </div>
  )
}
