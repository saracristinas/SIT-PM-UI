import React, { useState, useEffect } from 'react';
import { X, Bell, Settings, Check } from 'lucide-react';
import { 
  obterConfiguracaoLembrete, 
  salvarConfiguracaoLembrete,
  calcularTempoRestante
} from '../../services/reminderService';

export default function ModalConfigurarLembretePosAgendamento({ 
  consulta, 
  onClose,
  onSave,
  darkMode = false
}) {
  const [config, setConfig] = useState({
    frequenciaMinutos: 30,
    antecedenciaHoras: 24,
    lembreteUrgente: 60,
    habilitado: true
  });

  useEffect(() => {
    if (consulta?.id) {
      const configSalva = obterConfiguracaoLembrete(consulta.id);
      setConfig(configSalva);
    }
  }, [consulta]);

  const handleSave = () => {
    if (consulta?.id) {
      salvarConfiguracaoLembrete(consulta.id, config);
      onSave?.(config);
      onClose();
    }
  };

  if (!consulta) return null;

  const tempoRestante = calcularTempoRestante(consulta.dataHora);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`max-w-2xl w-full rounded-3xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} animate-in zoom-in duration-300`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Configurar Lembretes
            </h3>
            <button
              onClick={onClose}
              className="p-2 bg-white/20 backdrop-blur-md rounded-xl hover:bg-white/30 transition"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          <p className="text-blue-100 mt-1 text-sm">
            Personalize os lembretes da consulta
          </p>
        </div>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Info Consulta */}
          <div className={`${darkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-2xl p-5 border-2 border-blue-200`}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className={`text-xs uppercase font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  👨‍⚕️ Médico
                </p>
                <p className={`text-base font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mt-2`}>
                  {consulta.medico}
                </p>
              </div>
              <div>
                <p className={`text-xs uppercase font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  🏥 Especialidade
                </p>
                <p className={`text-base font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mt-2`}>
                  {consulta.especialidade}
                </p>
              </div>
              <div>
                <p className={`text-xs uppercase font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  📅 Data
                </p>
                <p className={`text-base font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mt-2`}>
                  {new Date(consulta.dataHora).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div>
                <p className={`text-xs uppercase font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  ⏰ Horário
                </p>
                <p className="text-blue-600 font-bold text-base mt-2">
                  {new Date(consulta.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>

          {/* Contador */}
          {!tempoRestante.passado && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl p-4">
              <p className="text-yellow-800 text-xs font-bold mb-2 tracking-wider">⏰ FALTA</p>
              <p className="text-4xl font-black text-yellow-900 leading-tight">{tempoRestante.texto}</p>
            </div>
          )}

          {/* Ativar/Desativar */}
          <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-2xl p-4`}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  config.habilitado ? 'bg-blue-500' : 'bg-gray-400'
                }`}>
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Lembretes
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {config.habilitado ? '✅ Ativado' : '❌ Desativado'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setConfig(prev => ({ ...prev, habilitado: !prev.habilitado }))}
                className={`relative w-14 h-7 rounded-full transition-all flex-shrink-0 ${
                  config.habilitado ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                  config.habilitado ? 'translate-x-7' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>

          {config.habilitado && (
            <>
              {/* Frequência */}
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-2xl p-5`}>
                <label className={`block font-bold text-base mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  📬 Receber lembretes a cada:
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 5, 15, 30, 60].map(minutos => (
                    <button
                      key={minutos}
                      onClick={() => setConfig(prev => ({ ...prev, frequenciaMinutos: minutos }))}
                      className={`p-3 rounded-lg font-bold transition-all transform ${
                        config.frequenciaMinutos === minutos
                          ? 'bg-blue-500 text-white shadow-lg scale-105'
                          : darkMode
                          ? 'bg-gray-600 text-gray-200 hover:bg-gray-500'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <div className="text-xl font-black">{minutos}</div>
                      <div className="text-xs mt-1">{minutos === 1 ? 'min' : 'min'}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Antecedência */}
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-cyan-50'} rounded-2xl p-5`}>
                <label className={`block font-bold text-base mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  ⏳ Começar a enviar lembretes com:
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {[1, 6, 12, 24].map(horas => (
                    <button
                      key={horas}
                      onClick={() => setConfig(prev => ({ ...prev, antecedenciaHoras: horas }))}
                      className={`p-3 rounded-lg font-bold transition-all transform ${
                        config.antecedenciaHoras === horas
                          ? 'bg-cyan-500 text-white shadow-lg scale-105'
                          : darkMode
                          ? 'bg-gray-600 text-gray-200 hover:bg-gray-500'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <div className="text-2xl font-black">{horas}</div>
                      <div className="text-xs mt-1">horas</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Resumo */}
              <div className={`${darkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'} border-2 rounded-xl p-4`}>
                <p className={`text-sm font-bold ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                  ✅ Documentos Necessários
                </p>
                <p className={`text-sm mt-3 ${darkMode ? 'text-green-300' : 'text-green-800'} leading-relaxed`}>
                  Todos os lembretes incluirão uma lista de documentos obrigatórios:
                </p>
                <ul className={`text-xs mt-2 space-y-1 ml-4 ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
                  <li>✅ Documento de identidade (RG ou CNH)</li>
                  <li>✅ Cartão do convênio (se aplicável)</li>
                  <li>✅ Pedido médico ou exames anteriores</li>
                  <li>✅ Lista de medicamentos em uso</li>
                </ul>
              </div>
            </>
          )}

          {/* Botões */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                darkMode
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Salvar Configurações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
