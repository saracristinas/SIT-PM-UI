import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

export default function Login({ darkMode = false, onSwitchToCadastro, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showCadastroPrompt, setShowCadastroPrompt] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setShowCadastroPrompt(false);
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simula chamada à API com verificação de cadastro
    setTimeout(() => {
      setIsLoading(false);
      
      // Verifica se o email está cadastrado
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const userExists = registeredUsers.find(u => u.email.toLowerCase() === formData.email.toLowerCase());
      
      if (!userExists) {
        setMessage({ 
          type: 'error', 
          text: 'Email não cadastrado. Por favor, crie uma conta primeiro.' 
        });
        setShowCadastroPrompt(true);
        return;
      }
      
      // Verifica a senha
      if (userExists.password !== formData.password) {
        setMessage({ 
          type: 'error', 
          text: 'Senha incorreta. Tente novamente.' 
        });
        setShowCadastroPrompt(false);
        return;
      }
      
      // Login bem-sucedido
      const { password, ...userWithoutPassword } = userExists;
      
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      localStorage.setItem('userData', JSON.stringify(userWithoutPassword));
      setMessage({ type: 'success', text: 'Login realizado com sucesso!' });
      
      setTimeout(() => {
        onLoginSuccess?.(userWithoutPassword);
      }, 1000);
    }, 1500);
  };

  // Função para login com Google (real)
  const handleGoogleSuccess = (credentialResponse) => {
    try {
      // Decodifica o token JWT do Google
      const decoded = jwtDecode(credentialResponse.credential);
      
      console.log('✅ Login Google bem-sucedido:', decoded);
      
      // Verifica se o email já está registrado
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      let userExists = registeredUsers.find(u => u.email.toLowerCase() === decoded.email.toLowerCase());
      
      // Se o usuário não existe, cria automaticamente
      if (!userExists) {
        const newGoogleUser = {
          id: decoded.sub,
          name: decoded.name,
          email: decoded.email,
          phone: '',
          birthDate: '',
          avatar: decoded.picture,
          provider: 'google',
          createdAt: new Date().toISOString()
        };
        
        // Adiciona o novo usuário à lista de registrados
        registeredUsers.push(newGoogleUser);
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        userExists = newGoogleUser;
        
        console.log('🆕 Nova conta criada automaticamente via Google:', newGoogleUser.email);
      }
      
      const googleUser = {
        ...userExists,
        avatar: decoded.picture,
        provider: 'google'
      };
      
      // Remove a senha antes de salvar
      const { password, ...userWithoutPassword } = googleUser;
      
      // Salva no localStorage
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      localStorage.setItem('userData', JSON.stringify(userWithoutPassword));
      
      setMessage({ type: 'success', text: `Bem-vindo(a), ${userWithoutPassword.name}!` });
      
      setTimeout(() => {
        onLoginSuccess?.(userWithoutPassword);
      }, 1000);
      
    } catch (error) {
      console.error('Erro ao processar login do Google:', error);
      setMessage({ type: 'error', text: 'Erro ao fazer login com Google' });
    }
  };

  const handleGoogleError = () => {
    console.error('❌ Erro no login do Google');
    setMessage({ type: 'error', text: 'Falha ao conectar com o Google' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpa erro do campo ao digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
      <div className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Bem-vindo!</h1>
          <p className="text-blue-100">Entre para acessar sua conta</p>
        </div>

        {/* Form */}
        <div className="p-8">
          {/* Mensagem de Feedback */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              <div className="flex items-center gap-3">
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                )}
                <p className="text-sm font-medium">{message.text}</p>
              </div>
              
              {/* Botão para ir ao cadastro quando email não existe */}
              {showCadastroPrompt && (
                <button
                  type="button"
                  onClick={onSwitchToCadastro}
                  className="mt-3 w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:shadow-lg transition-all text-sm"
                >
                  Criar conta agora →
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Email
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  className={`w-full pl-11 pr-4 py-3 rounded-lg border-2 transition focus:outline-none focus:ring-2 ${
                    errors.email
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : darkMode
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-900'
                      : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Senha */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Senha
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-12 py-3 rounded-lg border-2 transition focus:outline-none focus:ring-2 ${
                    errors.password
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : darkMode
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-900'
                      : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100 transition ${darkMode ? 'hover:bg-gray-600' : ''}`}
                >
                  {showPassword ? (
                    <EyeOff className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                  ) : (
                    <Eye className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Esqueceu a senha */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Lembrar-me
                </span>
              </label>
              <button
                type="button"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition"
              >
                Esqueceu a senha?
              </button>
            </div>

            {/* Botão Login */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Entrando...</span>
                </div>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className={`absolute inset-0 flex items-center ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}>
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-4 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
                Ou continue com
              </span>
            </div>
          </div>

          {/* Google Login */}
          <div className="mt-4">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              theme={darkMode ? "filled_black" : "outline"}
              size="large"
              text="continue_with"
              shape="rectangular"
              logo_alignment="left"
            />
          </div>

          {/* Link para Cadastro */}
          <p className={`mt-6 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Não tem uma conta?{' '}
            <button
              type="button"
              onClick={onSwitchToCadastro}
              className="font-semibold text-blue-600 hover:text-blue-700 transition"
            >
              Cadastre-se
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
