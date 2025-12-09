import React, { useState, useEffect } from 'react';
import { Mail, Clock, Bell, X, Play } from 'lucide-react';
import { calcularTempoRestante, gerarEmailLembrete, obterConfiguracaoLembrete } from '../../services/reminderService';
import { sendReminderEmail } from '../../services/emailService';

export default function ReminderEmailPreview({ darkMode, consulta, onClose }) {
  const [tempoRestante, setTempoRestante] = useState(null);
  const [configuracao, setConfiguracao] = useState(null);
  const [emailHTML, setEmailHTML] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (consulta) {
      const tempo = calcularTempoRestante(consulta.dataHora);
      const config = obterConfiguracaoLembrete(consulta.id);
      
      setTempoRestante(tempo);
      setConfiguracao(config);
      
      // Gera o HTML do email
      const html = gerarEmailLembrete(consulta, tempo, config);
      setEmailHTML(html);
    }
  }, [consulta]);

  const handleEnviarTeste = async () => {
    setEnviando(true);
    try {
      await sendReminderEmail(consulta);
      alert('✅ Email de lembrete enviado com sucesso!');
    } catch (error) {
      alert('❌ Erro ao enviar email: ' + error.message);
    } finally {
      setEnviando(false);
    }
  };

  if (!consulta) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`w-full max-w-xs rounded-3xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} animate-in zoom-in duration-300`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-5 py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-white flex-shrink-0" />
            <h3 className="text-lg font-bold text-white">Email de Lembrete</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 bg-white/20 hover:bg-white/30 rounded-lg transition flex-shrink-0"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
          {/* Info da Consulta */}
          <div className={`${darkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-xl p-3 border border-blue-200`}>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  👨‍⚕️ Médico
                </p>
                <p className={`font-bold text-xs ${darkMode ? 'text-white' : 'text-gray-900'} mt-1`}>
                  {consulta.medico}
                </p>
              </div>
              <div>
                <p className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  ⏰ Horário
                </p>
                <p className="text-blue-600 font-bold text-xs mt-1">
                  {new Date(consulta.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>

          {/* Contador Regressivo */}
          {tempoRestante && !tempoRestante.passado && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-300 rounded-xl p-2">
              <p className="text-yellow-800 text-xs font-bold">⏰ Falta: {tempoRestante.texto}</p>
            </div>
          )}

          {/* Preview do Email */}
          <div>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <iframe
                srcDoc={emailHTML}
                className="w-full h-[150px] bg-white"
                title="Email Preview"
              />
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className={`flex-1 px-3 py-2 rounded-lg font-semibold text-xs transition-all ${
                darkMode
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              Fechar
            </button>
            <button
              onClick={handleEnviarTeste}
              disabled={enviando}
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 text-xs"
            >
              {enviando ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enviando
                </>
              ) : (
                <>
                  <Play className="w-3 h-3" />
                  Enviar
                </>
              )}
            </button>
          </div>

          {/* Info sobre envio automático */}
          {configuracao && configuracao.habilitado && (
            <div className={`${darkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'} border rounded-lg p-2`}>
              <p className={`text-xs font-semibold ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                ✅ A cada {configuracao.frequenciaMinutos}min, {configuracao.antecedenciaHoras}h antes
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
