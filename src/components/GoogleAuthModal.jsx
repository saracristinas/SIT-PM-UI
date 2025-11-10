import React from 'react';
import { Check, X } from 'lucide-react';

export default function GoogleAuthModal({ onAuthorize, onCancel, darkMode = false }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {/* Header */}
        <div className="bg-white p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <svg className="w-8 h-8" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Fazer login com o Google</h2>
          <p className="text-sm text-gray-600">Escolha uma conta para continuar no SITPM</p>
        </div>

        {/* Conta Google Simulada */}
        <div className="p-6 bg-white">
          <div className="border-2 border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                U
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Usuário Google</p>
                <p className="text-sm text-gray-600">usuario@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Outra opção de conta */}
          <button className="w-full mt-3 py-3 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition font-medium">
            Usar outra conta
          </button>
        </div>

        {/* Permissões */}
        <div className={`p-6 border-t ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <p className={`text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            O SITPM deseja:
          </p>
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  Ver seu endereço de e-mail principal do Google
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  usuario@gmail.com
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  Ver suas informações pessoais
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Incluindo nome completo e foto do perfil
                </p>
              </div>
            </div>
          </div>

          <div className={`mt-4 p-3 rounded-lg ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
            <p className={`text-xs ${darkMode ? 'text-blue-300' : 'text-blue-900'}`}>
              ℹ️ Certifique-se de confiar no SITPM. Você poderá ver e gerenciar dados que este aplicativo tem permissão para acessar em{' '}
              <span className="font-semibold">myaccount.google.com</span>
            </p>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="p-6 bg-white border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            Cancelar
          </button>
          <button
            onClick={onAuthorize}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-md hover:shadow-lg"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
