import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, AlertCircle, CheckCircle, Phone, Calendar } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

export default function Cadastro({ darkMode = false, onSwitchToLogin, onCadastroSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = 'Nome completo é obrigatório';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.phone) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.phone) && formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Telefone inválido';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'Data de nascimento é obrigatória';
    }
    
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirme sua senha';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    if (!acceptTerms) {
      newErrors.terms = 'Você deve aceitar os termos de uso';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    
    if (!validateForm()) {
      setMessage({ type: 'error', text: 'Por favor, corrija os erros no formulário' });
      return;
    }
    
    setIsLoading(true);
    
    // Simula chamada à API
    setTimeout(() => {
      setIsLoading(false);
      
      const mockUser = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        birthDate: formData.birthDate,
        avatar: null
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('userData', JSON.stringify(mockUser)); // Para compatibilidade
      setMessage({ type: 'success', text: 'Cadastro realizado com sucesso!' });
      
      setTimeout(() => {
        onCadastroSuccess?.(mockUser);
      }, 1500);
    }, 2000);
  };

  // Função para cadastro com Google (real)
  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      
      console.log('✅ Cadastro Google bem-sucedido:', decoded);
      
      const googleUser = {
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        phone: '', // Não vem do Google
        birthDate: '', // Não vem do Google
        avatar: decoded.picture,
        provider: 'google'
      };
      
      localStorage.setItem('user', JSON.stringify(googleUser));
      localStorage.setItem('userData', JSON.stringify(googleUser));
      
      setMessage({ type: 'success', text: `Bem-vindo(a), ${googleUser.name}!` });
      
      setTimeout(() => {
        onCadastroSuccess?.(googleUser);
      }, 1000);
      
    } catch (error) {
      console.error('Erro ao processar cadastro do Google:', error);
      setMessage({ type: 'error', text: 'Erro ao fazer cadastro com Google' });
    }
  };

  const handleGoogleError = () => {
    console.error('❌ Erro no cadastro do Google');
    setMessage({ type: 'error', text: 'Falha ao conectar com o Google' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Formata telefone
    if (name === 'phone') {
      const numbers = value.replace(/\D/g, '');
      if (numbers.length <= 11) {
        if (numbers.length <= 2) {
          formattedValue = numbers;
        } else if (numbers.length <= 6) {
          formattedValue = `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
        } else if (numbers.length <= 10) {
          formattedValue = `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
        } else {
          formattedValue = `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
        }
      } else {
        return;
      }
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
    
    // Limpa erro do campo ao digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-50 via-white to-blue-50'}`}>
      <div className={`w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Criar Conta</h1>
          <p className="text-purple-100">Preencha seus dados para começar</p>
        </div>

        {/* Form */}
        <div className="p-8">
          {/* Mensagem de Feedback */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          )}

          {/* Google Signup */}
          <div className="mb-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme={darkMode ? "filled_black" : "outline"}
              size="large"
              text="signup_with"
              shape="rectangular"
              logo_alignment="left"
            />
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className={`absolute inset-0 flex items-center ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}>
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-4 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
                Ou cadastre-se com email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome Completo */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Nome Completo
              </label>
              <div className="relative">
                <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                  className={`w-full pl-11 pr-4 py-3 rounded-lg border-2 transition focus:outline-none focus:ring-2 ${
                    errors.name
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : darkMode
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-900'
                      : 'bg-white border-gray-200 text-gray-900 focus:border-purple-500 focus:ring-purple-100'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email e Telefone - Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-900'
                        : 'bg-white border-gray-200 text-gray-900 focus:border-purple-500 focus:ring-purple-100'
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

              {/* Telefone */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Telefone
                </label>
                <div className="relative">
                  <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(11) 99999-9999"
                    className={`w-full pl-11 pr-4 py-3 rounded-lg border-2 transition focus:outline-none focus:ring-2 ${
                      errors.phone
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                        : darkMode
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-900'
                        : 'bg-white border-gray-200 text-gray-900 focus:border-purple-500 focus:ring-purple-100'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Data de Nascimento */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Data de Nascimento
              </label>
              <div className="relative">
                <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 rounded-lg border-2 transition focus:outline-none focus:ring-2 ${
                    errors.birthDate
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : darkMode
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-900'
                      : 'bg-white border-gray-200 text-gray-900 focus:border-purple-500 focus:ring-purple-100'
                  }`}
                />
              </div>
              {errors.birthDate && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.birthDate}
                </p>
              )}
            </div>

            {/* Senha e Confirmar Senha - Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-900'
                        : 'bg-white border-gray-200 text-gray-900 focus:border-purple-500 focus:ring-purple-100'
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

              {/* Confirmar Senha */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Confirmar Senha
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-11 pr-12 py-3 rounded-lg border-2 transition focus:outline-none focus:ring-2 ${
                      errors.confirmPassword
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                        : darkMode
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-900'
                        : 'bg-white border-gray-200 text-gray-900 focus:border-purple-500 focus:ring-purple-100'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100 transition ${darkMode ? 'hover:bg-gray-600' : ''}`}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                    ) : (
                      <Eye className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Termos de Uso */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => {
                    setAcceptTerms(e.target.checked);
                    if (errors.terms) {
                      setErrors(prev => ({ ...prev, terms: '' }));
                    }
                  }}
                  className={`mt-1 w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 ${errors.terms ? 'border-red-500' : ''}`}
                />
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Eu aceito os{' '}
                  <button type="button" className="text-purple-600 hover:text-purple-700 font-medium">
                    Termos de Uso
                  </button>
                  {' '}e a{' '}
                  <button type="button" className="text-purple-600 hover:text-purple-700 font-medium">
                    Política de Privacidade
                  </button>
                </span>
              </label>
              {errors.terms && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.terms}
                </p>
              )}
            </div>

            {/* Botão Cadastrar */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Criando conta...</span>
                </div>
              ) : (
                'Criar Conta'
              )}
            </button>
          </form>

          {/* Link para Login */}
          <p className={`mt-6 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Já tem uma conta?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="font-semibold text-purple-600 hover:text-purple-700 transition"
            >
              Faça login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
