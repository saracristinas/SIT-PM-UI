import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertCircle } from 'lucide-react';

export default function NotificacaoLembrete({ 
  mensagem, 
  tipo = 'info',
  consultaInfo = null,
  onClose,
  duracao = 5000 
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duracao);

    return () => clearTimeout(timer);
  }, [duracao, onClose]);

  if (!isVisible) return null;

  const cores = {
    success: {
      bg: 'bg-green-50 border-green-200',
      icon: 'bg-green-500 text-white',
      text: 'text-green-800',
      title: 'text-green-900'
    },
    warning: {
      bg: 'bg-yellow-50 border-yellow-200',
      icon: 'bg-yellow-500 text-white',
      text: 'text-yellow-800',
      title: 'text-yellow-900'
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      icon: 'bg-red-500 text-white',
      text: 'text-red-800',
      title: 'text-red-900'
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      icon: 'bg-blue-500 text-white',
      text: 'text-blue-800',
      title: 'text-blue-900'
    }
  };

  const cor = cores[tipo] || cores.info;
  const iconos = {
    success: CheckCircle,
    warning: AlertCircle,
    error: AlertCircle,
    info: Bell
  };
  const Icon = iconos[tipo] || Bell;

  return (
    <div className={`fixed bottom-6 right-6 max-w-md animate-in slide-in-from-right-5 fade-in duration-300 z-40`}>
      <div className={`${cor.bg} border-2 rounded-xl p-5 shadow-2xl backdrop-blur-sm`}>
        <div className="flex items-start gap-4">
          <div className={`${cor.icon} rounded-full p-2 flex-shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className={`font-bold ${cor.title}`}>
              {tipo === 'success' && '✅ Lembrete Enviado!'}
              {tipo === 'warning' && '⏰ Lembrete Urgente!'}
              {tipo === 'error' && '❌ Erro'}
              {tipo === 'info' && '📬 Notificação'}
            </h4>

            <p className={`text-sm ${cor.text} mt-1`}>
              {mensagem}
            </p>

            {consultaInfo && (
              <div className={`mt-3 p-3 ${tipo === 'success' ? 'bg-white/50' : 'bg-white/40'} rounded-lg text-sm`}>
                <div className="font-semibold text-gray-900">
                  👨‍⚕️ {consultaInfo.medico}
                </div>
                <div className={`${cor.text} text-xs mt-1`}>
                  📅 {new Date(consultaInfo.dataHora).toLocaleDateString('pt-BR')} 
                  {' '}
                  ⏰ {new Date(consultaInfo.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setIsVisible(false);
              onClose?.();
            }}
            className={`flex-shrink-0 ${cor.text} hover:opacity-70 transition`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de progresso de desaparecimento */}
        <div className={`mt-3 h-1 bg-current opacity-20 rounded-full overflow-hidden`}>
          <div 
            className={`h-full ${cor.icon.split(' ')[0]} animate-pulse`}
            style={{
              animation: `shrink ${duracao}ms linear forwards`,
              transformOrigin: 'right'
            }}
          />
        </div>

        <style>{`
          @keyframes shrink {
            from { width: 100%; }
            to { width: 0%; }
          }
        `}</style>
      </div>
    </div>
  );
}
