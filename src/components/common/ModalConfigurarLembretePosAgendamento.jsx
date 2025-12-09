import React, { useState, useEffect } from 'react';
import { X, Bell, Check } from 'lucide-react';
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3">
      <div className={`w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} animate-in zoom-in duration-300`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Lembretes
            </h3>
            <button
              onClick={onClose}
              className="p-1 bg-white/20 hover:bg-white/30 rounded-lg transition"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        <div className="p-3 space-y-2.5 max-h-[85vh] overflow-y-auto">
          {/* Info Consulta */}
          <div className={`${darkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-lg p-2.5 border border-blue-200 text-sm space-y-1`}>
            <div className="flex justify-between">
              <span className={`font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>👨‍⚕️</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{consulta.medico}</span>
            </div>
            <div className="flex justify-between">
              <span className={`font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>🏥</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{consulta.especialidade}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>📅</span>
              <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{new Date(consulta.dataHora).toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>⏰</span>
              <span className="text-blue-600 font-bold">{new Date(consulta.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>

          {/* Contador */}
          {!tempoRestante.passado && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-300 rounded-lg p-2.5 text-center">
              <p className="text-xs font-bold text-yellow-700 mb-0.5">⏰ FALTA</p>
              <p className="text-xl font-black text-yellow-900">{tempoRestante.texto}</p>
            </div>
          )}

          {/* Toggle Lembretes */}
          <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-2.5 flex items-center justify-between`}>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded flex items-center justify-center ${config.habilitado ? 'bg-blue-500' : 'bg-gray-400'}`}>
                <Bell className="w-4 h-4 text-white" />
              </div>
              <div className="text-sm">
                <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Lembretes</p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{config.habilitado ? '✅ On' : '❌ Off'}</p>
              </div>
            </div>
            <button
              onClick={() => setConfig(prev => ({ ...prev, habilitado: !prev.habilitado }))}
              className={`relative w-11 h-6 rounded-full transition-all ${config.habilitado ? 'bg-blue-500' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${config.habilitado ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>

          {config.habilitado && (
            <>
              {/* Frequência */}
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-lg p-2.5`}>
                <label className={`block text-xs font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>📬 A cada:</label>
                <div className="grid grid-cols-5 gap-1">
                  {[1, 5, 15, 30, 60].map(minutos => (
                    <button
                      key={minutos}
                      onClick={() => setConfig(prev => ({ ...prev, frequenciaMinutos: minutos }))}
                      className={`p-1.5 rounded text-xs font-bold transition ${
                        config.frequenciaMinutos === minutos
                          ? 'bg-blue-500 text-white shadow-lg'
                          : darkMode
                          ? 'bg-gray-600 text-gray-200 hover:bg-gray-500'
                          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {minutos}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Antecedência */}
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-cyan-50'} rounded-lg p-2.5`}>
                <label className={`block text-xs font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>⏳ Antes de:</label>
                <div className="grid grid-cols-4 gap-1">
                  {[1, 6, 12, 24].map(horas => (
                    <button
                      key={horas}
                      onClick={() => setConfig(prev => ({ ...prev, antecedenciaHoras: horas }))}
                      className={`p-1.5 rounded text-xs font-bold transition ${
                        config.antecedenciaHoras === horas
                          ? 'bg-cyan-500 text-white shadow-lg'
                          : darkMode
                          ? 'bg-gray-600 text-gray-200 hover:bg-gray-500'
                          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {horas}h
                    </button>
                  ))}
                </div>
              </div>

              {/* Documentos */}
              <div className={`${darkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'} border rounded-lg p-2.5 text-xs`}>
                <p className={`font-bold mb-1.5 ${darkMode ? 'text-green-400' : 'text-green-700'}`}>✅ Documentos</p>
                <ul className={`space-y-0.5 ml-2 ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
                  <li>• RG ou CNH</li>
                  <li>• Convênio</li>
                  <li>• Pedido/Exames</li>
                  <li>• Medicamentos</li>
                </ul>
              </div>
            </>
          )}

          {/* Botões */}
          <div className="flex gap-2 pt-2 border-t border-gray-200">
            <button
              onClick={onClose}
              className={`flex-1 px-2 py-2 rounded-lg text-xs font-semibold transition ${
                darkMode
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-2 py-2 rounded-lg text-xs font-bold shadow hover:shadow-lg transition flex items-center justify-center gap-1"
            >
              <Check className="w-3 h-3" />
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
