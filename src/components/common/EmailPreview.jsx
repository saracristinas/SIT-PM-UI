import React from 'react';
import { Mail, Calendar, Clock, User, MapPin, Phone } from 'lucide-react';

/**
 * Preview do Email de Confirmação de Consulta
 * Este componente mostra como o email ficará visualmente
 */
export default function EmailPreview({ userData, consultaData, darkMode = false }) {
  const { especialidade, medico, data, hora } = consultaData;
  
  const dataFormatada = new Date(data).toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="max-w-2xl mx-auto">
        <div className="mb-4 text-center">
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            📧 Preview do Email
          </p>
        </div>

        {/* Email Container */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            </div>
            
            <div className="relative">
              <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Consulta Confirmada!</h1>
              <p className="text-emerald-100 text-lg">SITPM - Sistema Inteligente de Triagem</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="mb-6">
              <p className="text-xl text-gray-900 mb-2">
                Olá, <strong>{userData.name}</strong>! 👋
              </p>
              <p className="text-gray-600 leading-relaxed">
                Sua consulta foi <strong>agendada com sucesso</strong>! Estamos felizes em atendê-lo(a). 
                Abaixo estão os detalhes da sua consulta:
              </p>
            </div>

            {/* Consulta Card */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-500 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-emerald-900 text-sm uppercase tracking-wide">
                  Detalhes da Consulta
                </h3>
              </div>

              <div className="space-y-4">
                {/* Especialidade */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <User className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-emerald-700 uppercase">Especialidade</p>
                    <p className="text-lg font-bold text-gray-900">{especialidade}</p>
                  </div>
                </div>

                {/* Médico */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="8.5" cy="7" r="4"/>
                      <polyline points="17 11 19 13 23 9"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-emerald-700 uppercase">Médico(a)</p>
                    <p className="text-lg font-bold text-gray-900">{medico}</p>
                  </div>
                </div>

                {/* Data */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Calendar className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-emerald-700 uppercase">Data</p>
                    <p className="text-lg font-bold text-gray-900 capitalize">{dataFormatada}</p>
                  </div>
                </div>

                {/* Horário */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Clock className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-emerald-700 uppercase">Horário</p>
                    <p className="text-lg font-bold text-gray-900">{hora}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Instruções */}
            <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">⚠️</span>
                <p className="font-bold text-amber-900 text-sm">Importante</p>
              </div>
              <ul className="text-sm text-amber-900 space-y-1 ml-6 list-disc">
                <li>Chegue com <strong>15 minutos de antecedência</strong></li>
                <li>Traga documento de identidade e carteirinha do convênio</li>
                <li>Em caso de impossibilidade, cancele com 24h de antecedência</li>
                <li>Se tiver sintomas de gripe/resfriado, entre em contato conosco</li>
              </ul>
            </div>

            {/* CTA Button */}
            <div className="text-center mb-6">
              <button className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all">
                Visualizar no Sistema
              </button>
            </div>

            <p className="text-sm text-gray-600 text-center">
              Caso precise alterar ou cancelar sua consulta, acesse o sistema ou entre em contato conosco.
            </p>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-8 border-t border-gray-200 text-center">
            <p className="font-bold text-gray-900 mb-2">SITPM - Sistema Inteligente de Triagem</p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mb-3 flex-wrap">
              <span className="flex items-center gap-1">
                <Mail className="w-4 h-4" /> contato@sitpm.com.br
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-4 h-4" /> (11) 99999-9999
              </span>
            </div>
            <p className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-4">
              <MapPin className="w-4 h-4" /> Av. Paulista, 1000 - São Paulo, SP
            </p>
            
            <div className="flex items-center justify-center gap-4 mb-4">
              <a href="#" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">Instagram</a>
              <a href="#" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">Facebook</a>
              <a href="#" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">LinkedIn</a>
            </div>
            
            <p className="text-xs text-gray-500">
              Este é um email automático. Por favor, não responda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
