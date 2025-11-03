import React, { useState } from 'react';
import { Calendar, FileText, Clock, Clipboard, Moon, LogOut } from 'lucide-react';

export default function SITPMDashboard({ onNavigate, darkMode }) {

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-52 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
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
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-emerald-500 text-white rounded-lg font-medium">
              <Clipboard className="w-5 h-5" />
              Início
            </button>
            
            <button className={`w-full flex items-center gap-3 px-4 py-3 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} rounded-lg transition`}>
              <Clock className="w-5 h-5" />
              Triagem IA
            </button>
            
            <button className={`w-full flex items-center gap-3 px-4 py-3 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} rounded-lg transition`}>
              <Calendar className="w-5 h-5" />
              Agendar
            </button>
            
            <button className={`w-full flex items-center gap-3 px-4 py-3 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} rounded-lg transition`}>
              <FileText className="w-5 h-5" />
              Consultas
            </button>
            
            <button className={`w-full flex items-center gap-3 px-4 py-3 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} rounded-lg transition`}>
              <Clipboard className="w-5 h-5" />
              Prontuário
            </button>
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

      {/* Main Content */}
      <div className="ml-52 p-8">
        {/* Header */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6 mb-8`}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-emerald-500 rounded-xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Olá, Sara!</h1>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} flex items-center gap-2 mt-1`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Bem-vindo ao seu portal de saúde inteligente
              </p>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div 
            onClick={() => onNavigate('triagem')}
            className={`${darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:shadow-lg'} rounded-xl shadow-md p-6 transition cursor-pointer`}
          >
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className={`font-bold text-lg mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Triagem com IA</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avaliação inteligente 24/7</p>
          </div>

          <div 
            onClick={() => onNavigate('agendar')}
            className={`${darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:shadow-lg'} rounded-xl shadow-md p-6 transition cursor-pointer`}
          >
            <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-cyan-600" />
            </div>
            <h3 className={`font-bold text-lg mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Agendar Consulta</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Marque seu atendimento</p>
          </div>

          <div 
            onClick={() => onNavigate('consultas')}
            className={`${darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:shadow-lg'} rounded-xl shadow-md p-6 transition cursor-pointer`}
          >
            <div className="w-12 h-12 bg-lime-100 rounded-xl flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-lime-600" />
            </div>
            <h3 className={`font-bold text-lg mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Minhas Consultas</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>0 agendamento(s)</p>
          </div>

          <div 
            onClick={() => onNavigate('prontuario')}
            className={`${darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:shadow-lg'} rounded-xl shadow-md p-6 transition cursor-pointer`}
          >
            <div className="w-12 h-12 bg-lime-100 rounded-xl flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-lime-600" />
            </div>
            <h3 className={`font-bold text-lg mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Meu Prontuário</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>0 registro(s)</p>
          </div>
        </div>

        {/* History Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Consultas */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Calendar className={`w-5 h-5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>Histórico de Consultas</h3>
              </div>
              <button 
                onClick={() => onNavigate('consultas')}
                className="text-emerald-600 text-sm font-medium hover:underline"
              >
                Ver todas
              </button>
            </div>
            
            <div 
              onClick={() => onNavigate('consultas')}
              className="flex flex-col items-center justify-center py-12 cursor-pointer hover:opacity-80 transition"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-emerald-600" />
              </div>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Nenhuma consulta agendada ainda</p>
            </div>
          </div>

          {/* Registros */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <FileText className={`w-5 h-5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>Registros Médicos</h3>
              </div>
              <button 
                onClick={() => onNavigate('prontuario')}
                className="text-emerald-600 text-sm font-medium hover:underline"
              >
                Ver todos
              </button>
            </div>
            
            <div 
              onClick={() => onNavigate('prontuario')}
              className="flex flex-col items-center justify-center py-12 cursor-pointer hover:opacity-80 transition"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-emerald-600" />
              </div>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Nenhum registro médico ainda</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}