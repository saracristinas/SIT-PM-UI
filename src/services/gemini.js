// Serviço de integração com Google Gemini para triagem médica

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

console.log('🔑 Verificando Gemini API Key...');
console.log('API Key presente?', !!GEMINI_API_KEY);
console.log('Tamanho:', GEMINI_API_KEY?.length);

// Prompt do sistema - Define o comportamento da IA
const SYSTEM_PROMPT = `Você é uma assistente virtual médica especializada em triagem de pacientes para o MediCenter.

SEU PAPEL:
- Fazer perguntas claras e objetivas sobre os sintomas do paciente
- Coletar informações sobre: sintomas, duração, intensidade, histórico
- Ser empática, clara e profissional
- Não fazer diagnósticos definitivos
- Ao final, sugerir a especialidade médica adequada

IMPORTANTE:
- Perguntas curtas e diretas
- Uma pergunta de cada vez
- Seja acolhedora e tranquilizadora
- Use linguagem simples e acessível

PRIMEIRA INTERAÇÃO:
- Cumprimente o paciente
- Pergunte qual é o sintoma predominante

FLUXO DA TRIAGEM:
1. Sintoma principal
2. Há quanto tempo
3. Intensidade (leve/moderada/forte)
4. Sintomas associados
5. Histórico relevante
6. Recomendação de especialidade

Responda sempre em português brasileiro de forma empática e profissional. Lembre de nao utilizar ** antes das mensagens para fazer negrito, pois nao funciona!.`;

/**
 * Envia mensagem para o Gemini e recebe resposta
 * @param {Array} messages - Histórico de mensagens [{role: 'user'|'assistant', content: string}]
 * @returns {Promise<string>} Resposta da IA
 */
export async function sendMessageToGemini(messages) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'sua_api_key_aqui') {
    console.error('❌ API Key do Gemini não configurada!');
    console.error('Configure no arquivo .env.local');
    throw new Error('API Key do Gemini não configurada. Configure no arquivo .env.local');
  }

  console.log('🤖 Enviando mensagem para Gemini...');
  console.log('📊 Total de mensagens:', messages.length);

  try {
    // Converte o histórico de mensagens para o formato do Gemini
    const conversationText = messages
      .map(msg => `${msg.role === 'user' ? 'Paciente' : 'Assistente'}: ${msg.content}`)
      .join('\n\n');

    const fullPrompt = `${SYSTEM_PROMPT}\n\n--- CONVERSA ---\n\n${conversationText}\n\nAssistente:`;

    const requestBody = {
      contents: [{
        parts: [{
          text: fullPrompt
        }]
      }]
    };

    console.log('📤 Enviando para:', `${GEMINI_API_URL}?key=${GEMINI_API_KEY.substring(0, 10)}...`);

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Erro da API Gemini:', errorData);
      throw new Error(errorData.error?.message || 'Erro ao comunicar com Gemini');
    }

    const data = await response.json();
    console.log('✅ Resposta recebida do Gemini');
    
    const aiResponse = data.candidates[0].content.parts[0].text;
    return aiResponse;

  } catch (error) {
    console.error('❌ Erro no serviço Gemini:', error);
    console.error('Detalhes:', error.message);
    throw error;
  }
}

/**
 * Inicia uma nova triagem
 * @returns {Promise<string>} Mensagem inicial da IA
 */
export async function startTriagem() {
  try {
    const response = await sendMessageToGemini([
      { 
        role: 'user', 
        content: 'Olá, preciso fazer uma triagem médica' 
      }
    ]);
    return response;
  } catch (error) {
    console.error('Erro ao iniciar triagem:', error);
    return 'Olá! 👋 Sou a assistente virtual do MediCenter. Estou aqui para entender melhor seus sintomas. Para começar, qual é o seu sintoma predominante? (Ex: dor de cabeça, febre, dor abdominal, etc.)';
  }
}

/**
 * Analisa a gravidade dos sintomas
 * @param {string} conversation - Conversa completa
 * @returns {string} 'BAIXA' | 'MÉDIA' | 'ALTA'
 */
export function analyzeSymptomSeverity(conversation) {
  const conversationLower = conversation.toLowerCase();
  
  // Palavras-chave para alta gravidade
  const highSeverity = [
    'forte', 'intensa', 'insuportável', 'aguda', 'severa',
    'sangue', 'desmaio', 'perda de consciência', 'falta de ar',
    'peito', 'coração', 'confusão mental', 'muito forte'
  ];
  
  // Palavras-chave para média gravidade
  const mediumSeverity = [
    'moderada', 'persistente', 'contínua', 'frequente',
    'febre', 'vômito', 'tontura', 'enjoo'
  ];
  
  // Verifica alta gravidade
  if (highSeverity.some(word => conversationLower.includes(word))) {
    return 'ALTA';
  }
  
  // Verifica média gravidade
  if (mediumSeverity.some(word => conversationLower.includes(word))) {
    return 'MÉDIA';
  }
  
  // Padrão: baixa gravidade
  return 'BAIXA';
}
