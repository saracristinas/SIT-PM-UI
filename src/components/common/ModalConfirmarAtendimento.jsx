import React from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { marcarComoAtendida, calcularTempoRestante } from '../../services/reminderService';

export default function ModalConfirmarAtendimento({ 
  consulta, 
  onClose,
  onConfirm,
  darkMode = false
}) {
  if (!consulta) return null;

  const tempoRestante = calcularTempoRestante(consulta.dataHora);

  const handleConfirmar = () => {
    marcarComoAtendida(consulta.id);
    onConfirm?.(consulta.id);
    onClose();
  };

  const handleNao = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`max-w-sm w-full rounded-3xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} animate-in zoom-in duration-300`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-5 py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
            <h3 className="text-lg font-bold text-white">Confirmar Atendimento</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 bg-white/20 hover:bg-white/30 rounded-lg transition flex-shrink-0"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Info Consulta */}
          <div className={`${darkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-2xl p-4 border border-blue-200`}>
            <div className="text-center">
              <div className="text-3xl mb-2">👨‍⚕️</div>
              <p className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {consulta.medico}
              </p>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                {consulta.especialidade}
              </p>
              <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                ⏰ {new Date(consulta.dataHora).toLocaleDateString('pt-BR')} às {new Date(consulta.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          {/* Pergunta */}
          <div className="text-center">
            <p className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Você foi atendido?
            </p>
          </div>

          {/* Informação sobre o que acontece */}
          <div className={`${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'} rounded-xl p-3 text-xs border border-blue-300`}>
            <p className={`font-semibold ${darkMode ? 'text-blue-200' : 'text-blue-900'} mb-1`}>Ao confirmar:</p>
            <ul className="space-y-1">
              <li className={darkMode ? 'text-blue-300' : 'text-blue-800'}>✅ Consulta marcada como concluída</li>
              <li className={darkMode ? 'text-blue-300' : 'text-blue-800'}>📋 Lembretes desativados</li>
              <li className={darkMode ? 'text-blue-300' : 'text-blue-800'}>📊 Histórico atualizado</li>
            </ul>
          </div>

          {/* Botões */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleNao}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                darkMode
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
            >
              Não
            </button>
            <button
              onClick={handleConfirmar}
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-all"
            >
              Sim, Fui
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
