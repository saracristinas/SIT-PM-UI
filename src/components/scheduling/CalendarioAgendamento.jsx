import React, { useState } from 'react';
import { Calendar, Clock, Check, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarioAgendamento({ darkMode = false, onAgendarConsulta, especialidade }) {
  const [mesAtual, setMesAtual] = useState(new Date());
  const [diaSelecionado, setDiaSelecionado] = useState(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);
  const [confirmado, setConfirmado] = useState(false);
  const [lembreteEmail, setLembreteEmail] = useState(true); // Lembrete ativado por padrão

  // Função para verificar se um horário já passou (para o dia atual)
  const horarioJaPassou = (horario, diaInfo) => {
    if (!diaInfo) return false;
    
    const agora = new Date();
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const diaSelecionadoDate = new Date(diaInfo.data);
    diaSelecionadoDate.setHours(0, 0, 0, 0);
    
    // Se não é hoje, não há problema
    if (diaSelecionadoDate.getTime() !== hoje.getTime()) {
      return false;
    }
    
    // Se é hoje, verifica se o horário já passou
    const [hora, minuto] = horario.split(':');
    const horarioConsulta = new Date();
    horarioConsulta.setHours(parseInt(hora), parseInt(minuto), 0, 0);
    
    return horarioConsulta <= agora;
  };

  // Horários disponíveis
  const horariosDisponiveis = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];

  // Função para obter dias do mês
  const getDiasDoMes = () => {
    const ano = mesAtual.getFullYear();
    const mes = mesAtual.getMonth();
    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);
    const diasNoMes = ultimoDia.getDate();
    const diaSemanaInicio = primeiroDia.getDay();

    const dias = [];
    
    // Dias vazios antes do primeiro dia
    for (let i = 0; i < diaSemanaInicio; i++) {
      dias.push(null);
    }
    
    // Dias do mês
    for (let dia = 1; dia <= diasNoMes; dia++) {
      const data = new Date(ano, mes, dia);
      const diaSemana = data.getDay();
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      // Terças (2) e Quartas (3) são disponíveis, mas só datas futuras
      const isDisponivel = (diaSemana === 2 || diaSemana === 3) && data >= hoje;
      
      dias.push({
        dia,
        data,
        disponivel: isDisponivel
      });
    }
    
    return dias;
  };

  const mesAnterior = () => {
    setMesAtual(new Date(mesAtual.getFullYear(), mesAtual.getMonth() - 1, 1));
    setDiaSelecionado(null);
    setHorarioSelecionado(null);
  };

  const proximoMes = () => {
    setMesAtual(new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1, 1));
    setDiaSelecionado(null);
    setHorarioSelecionado(null);
  };

  const selecionarDia = (diaInfo) => {
    if (diaInfo && diaInfo.disponivel) {
      setDiaSelecionado(diaInfo);
      setHorarioSelecionado(null);
    }
  };

  const confirmarAgendamento = () => {
    if (diaSelecionado && horarioSelecionado) {
      const dataConsulta = new Date(diaSelecionado.data);
      const [hora, minuto] = horarioSelecionado.split(':');
      dataConsulta.setHours(parseInt(hora), parseInt(minuto), 0, 0);

      // Formata a data no formato local YYYY-MM-DD
      const ano = dataConsulta.getFullYear();
      const mes = String(dataConsulta.getMonth() + 1).padStart(2, '0');
      const dia = String(dataConsulta.getDate()).padStart(2, '0');
      const dataFormatada = `${ano}-${mes}-${dia}`;

      onAgendarConsulta({
        data: dataFormatada,
        hora: horarioSelecionado,
        especialidade: especialidade,
        dataCompleta: dataConsulta,
        lembreteEmail: lembreteEmail // Adiciona preferência de lembrete
      });
      
      setConfirmado(true);
    }
  };

  const dias = getDiasDoMes();
  const nomeMes = mesAtual.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  if (confirmado) {
    return (
      <div className={`rounded-xl p-3 sm:p-4 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-lg max-w-md mx-auto`}>
        <div className="text-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full flex items-center justify-center">
            <Check className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <h3 className={`text-base sm:text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Consulta Agendada!
          </h3>
          <p className={`text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <strong>{especialidade}</strong>
          </p>
          <p className={`text-xs mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            📅 {diaSelecionado.data.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
          <p className={`text-xs mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            🕐 {horarioSelecionado}
          </p>
          
          <div className={`mt-3 p-2 rounded-lg ${darkMode ? 'bg-blue-900/30 border border-blue-800' : 'bg-blue-50 border border-blue-200'}`}>
            <p className={`text-xs ${darkMode ? 'text-blue-300' : 'text-blue-900'}`}>
              💌 <strong>Email enviado!</strong> Verifique sua caixa de entrada.
            </p>
          </div>

          <div className={`mt-2 p-2 rounded-lg ${darkMode ? 'bg-emerald-900/30 border border-emerald-800' : 'bg-emerald-50 border border-emerald-200'}`}>
            <p className={`text-xs ${darkMode ? 'text-emerald-300' : 'text-emerald-900'}`}>
              ℹ️ Para mais informações, <strong>abra a aba "Consultas"</strong>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-lg max-w-md mx-auto`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 p-2 sm:p-2.5">
        <div className="flex items-center justify-between mb-1">
          <button
            onClick={mesAnterior}
            className="p-0.5 sm:p-1 rounded-lg hover:bg-white/20 transition"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <h3 className="text-sm sm:text-base font-bold text-white capitalize">{nomeMes}</h3>
          <button
            onClick={proximoMes}
            className="p-0.5 sm:p-1 rounded-lg hover:bg-white/20 transition"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
        <p className="text-[9px] sm:text-[10px] text-white/90 text-center">
          📅 Selecione uma data (Terças e Quartas)
        </p>
      </div>

      <div className="p-2 sm:p-2.5">
        {/* Dias da semana */}
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1">
          {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((dia, i) => (
            <div key={i} className={`text-center text-[9px] sm:text-[10px] font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {dia}
            </div>
          ))}
        </div>

        {/* Dias do mês */}
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-3">
          {dias.map((diaInfo, index) => (
            <button
              key={index}
              onClick={() => selecionarDia(diaInfo)}
              disabled={!diaInfo || !diaInfo.disponivel}
              className={`
                aspect-square rounded-md text-[10px] sm:text-xs font-semibold transition-all
                ${!diaInfo ? 'invisible' : ''}
                ${diaInfo && !diaInfo.disponivel 
                  ? darkMode 
                    ? 'text-gray-600 cursor-not-allowed' 
                    : 'text-gray-300 cursor-not-allowed'
                  : ''
                }
                ${diaInfo && diaInfo.disponivel
                  ? diaSelecionado?.dia === diaInfo.dia
                    ? 'bg-emerald-500 text-white shadow-lg scale-105'
                    : darkMode
                    ? 'bg-emerald-900/30 text-emerald-300 hover:bg-emerald-800/50 border border-emerald-700'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300'
                  : ''
                }
              `}
            >
              {diaInfo?.dia}
            </button>
          ))}
        </div>

        {/* Horários */}
        {diaSelecionado && (
          <div className="border-t pt-2.5" style={{ borderColor: darkMode ? '#374151' : '#e5e7eb' }}>
            <div className="flex items-center gap-1.5 mb-2">
              <Clock className={`w-3.5 h-3.5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
              <h4 className={`text-xs sm:text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Selecione o horário:
              </h4>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-4 gap-1 sm:gap-1.5 max-h-32 overflow-y-auto">
              {horariosDisponiveis.map((horario) => {
                const horarioPassou = horarioJaPassou(horario, diaSelecionado);
                
                return (
                  <button
                    key={horario}
                    onClick={() => !horarioPassou && setHorarioSelecionado(horario)}
                    disabled={horarioPassou}
                    className={`
                      py-1 px-1.5 rounded-md text-[10px] sm:text-xs font-semibold transition-all
                      ${horarioPassou
                        ? darkMode
                          ? 'bg-gray-800 text-gray-600 cursor-not-allowed line-through'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                        : horarioSelecionado === horario
                        ? 'bg-emerald-500 text-white shadow-md'
                        : darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }
                    `}
                  >
                    {horario}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Checkbox de Lembrete e Botão Confirmar */}
        {diaSelecionado && horarioSelecionado && (
          <div className="mt-3 pt-2.5 border-t" style={{ borderColor: darkMode ? '#374151' : '#e5e7eb' }}>
            {/* Checkbox Lembrete por Email */}
            <div className="mb-2.5 flex items-start gap-2">
              <input
                type="checkbox"
                id="lembreteEmail"
                checked={lembreteEmail}
                onChange={(e) => setLembreteEmail(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2 cursor-pointer"
              />
              <label
                htmlFor="lembreteEmail"
                className={`text-xs cursor-pointer ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
              >
                📧 <strong>Enviar lembrete por email</strong> antes da consulta
              </label>
            </div>
            
            <button
              onClick={confirmarAgendamento}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-400 text-white py-2 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-1.5 text-xs sm:text-sm"
            >
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Confirmar Agendamento
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
