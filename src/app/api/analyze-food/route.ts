// API Route para análise de imagens de alimentos usando OpenAI Vision

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface FoodAnalysis {
  foods: Array<{
    name: string;
    portion: string;
    estimatedWeight: string;
    calories: number;
    macros: {
      protein: number;
      carbs: number;
      fat: number;
    };
    confidence: 'high' | 'medium' | 'low';
    alternatives?: string[];
  }>;
  totalCalories: number;
  totalMacros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

// Função auxiliar para retry com backoff exponencial
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 2,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Não fazer retry para erros que não são rate limit
      if (error.status !== 429 && error.code !== 'rate_limit_exceeded') {
        throw error;
      }
      
      // Se for o último retry, lançar o erro
      if (i === maxRetries) {
        throw error;
      }
      
      // Calcular delay com backoff exponencial
      const delay = baseDelay * Math.pow(2, i);
      console.log(`⏳ Rate limit atingido. Tentando novamente em ${delay}ms... (tentativa ${i + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

export async function POST(req: NextRequest) {
  try {
    // Validar API Key
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY não configurada');
      return NextResponse.json(
        { error: 'Chave da API OpenAI não configurada. Configure a variável OPENAI_API_KEY.' },
        { status: 500 }
      );
    }

    console.log('✅ API Key encontrada');

    const { image } = await req.json();

    if (!image) {
      console.error('❌ Imagem não fornecida no request');
      return NextResponse.json(
        { error: 'Imagem não fornecida' },
        { status: 400 }
      );
    }

    // Validar formato da imagem
    if (!image.startsWith('data:image/')) {
      console.error('❌ Formato de imagem inválido:', image.substring(0, 50));
      return NextResponse.json(
        { error: 'Formato de imagem inválido. Use data:image/...' },
        { status: 400 }
      );
    }

    console.log('📸 Iniciando análise de imagem...');
    console.log('📏 Tamanho da imagem (base64):', image.length, 'caracteres');

    // Análise da imagem usando OpenAI Vision API com retry automático
    const response = await retryWithBackoff(async () => {
      return await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Você é um nutricionista especializado em análise de alimentos. Analise esta imagem e identifique TODOS os alimentos visíveis.

Para cada alimento identificado, forneça:
1. Nome do alimento (em português)
2. Porção estimada (ex: "1 unidade média", "150g", "2 colheres de sopa")
3. Peso estimado em gramas
4. Calorias aproximadas
5. Macronutrientes (proteína, carboidratos, gordura em gramas)
6. Nível de confiança da identificação (high/medium/low)
7. Se houver ambiguidade, liste 2-3 alimentos similares possíveis

Retorne APENAS um JSON válido no seguinte formato (sem markdown, sem explicações):
{
  "foods": [
    {
      "name": "nome do alimento",
      "portion": "porção estimada",
      "estimatedWeight": "peso em gramas",
      "calories": número,
      "macros": {
        "protein": número,
        "carbs": número,
        "fat": número
      },
      "confidence": "high" | "medium" | "low",
      "alternatives": ["alimento similar 1", "alimento similar 2"]
    }
  ]
}

Seja preciso e detalhado. Se houver múltiplos itens no prato, liste todos separadamente.`,
              },
              {
                type: 'image_url',
                image_url: {
                  url: image,
                },
              },
            ],
          },
        ],
        max_tokens: 1500,
      });
    });

    console.log('✅ Resposta recebida da OpenAI');

    const content = response.choices[0].message.content;
    
    if (!content) {
      console.error('❌ Resposta vazia da OpenAI');
      throw new Error('Resposta vazia da OpenAI');
    }

    console.log('📄 Conteúdo da resposta (primeiros 200 chars):', content.substring(0, 200));

    // Parse da resposta JSON
    let analysisData;
    try {
      // Remove markdown code blocks se existirem
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      console.log('🧹 Conteúdo limpo:', cleanContent.substring(0, 200));
      analysisData = JSON.parse(cleanContent);
      console.log('✅ Parse JSON bem-sucedido');
    } catch (parseError: any) {
      console.error('❌ Erro ao fazer parse da resposta');
      console.error('📄 Conteúdo completo:', content);
      console.error('🔥 Erro de parse:', parseError.message);
      throw new Error(`Formato de resposta inválido da IA: ${parseError.message}`);
    }

    // Validar estrutura da resposta
    if (!analysisData.foods || !Array.isArray(analysisData.foods)) {
      console.error('❌ Estrutura de resposta inválida:', JSON.stringify(analysisData, null, 2));
      throw new Error('Estrutura de resposta inválida: campo "foods" ausente ou não é array');
    }

    if (analysisData.foods.length === 0) {
      console.warn('⚠️ Nenhum alimento identificado na imagem');
      return NextResponse.json(
        { error: 'Nenhum alimento foi identificado na imagem. Tente tirar uma foto mais clara.' },
        { status: 400 }
      );
    }

    console.log(`✅ ${analysisData.foods.length} alimento(s) identificado(s)`);

    // Calcular totais
    const totalCalories = analysisData.foods.reduce(
      (sum: number, food: any) => sum + (food.calories || 0),
      0
    );
    
    const totalMacros = analysisData.foods.reduce(
      (acc: any, food: any) => ({
        protein: acc.protein + (food.macros?.protein || 0),
        carbs: acc.carbs + (food.macros?.carbs || 0),
        fat: acc.fat + (food.macros?.fat || 0),
      }),
      { protein: 0, carbs: 0, fat: 0 }
    );

    const result: FoodAnalysis = {
      foods: analysisData.foods,
      totalCalories: Math.round(totalCalories),
      totalMacros: {
        protein: Math.round(totalMacros.protein),
        carbs: Math.round(totalMacros.carbs),
        fat: Math.round(totalMacros.fat),
      },
    };

    console.log('✅ Análise concluída com sucesso');
    console.log('📊 Total de calorias:', result.totalCalories);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('❌ ERRO NA ANÁLISE DE ALIMENTOS');
    console.error('🔥 Tipo do erro:', error.constructor.name);
    console.error('📝 Mensagem:', error.message);
    console.error('📚 Stack trace:', error.stack);
    
    // Log detalhado do erro da OpenAI
    if (error.response) {
      console.error('🌐 Status HTTP:', error.response.status);
      console.error('📄 Dados da resposta:', JSON.stringify(error.response.data, null, 2));
    }
    
    // Retornar mensagem de erro mais específica e amigável
    let errorMessage = 'Erro ao analisar imagem';
    let errorDetails = error.message;
    let userSuggestion = '';

    if (error.code === 'invalid_api_key' || error.status === 401) {
      errorMessage = 'Chave da API OpenAI inválida';
      errorDetails = 'A chave da API configurada não é válida ou expirou.';
      userSuggestion = 'Verifique se a chave OPENAI_API_KEY está correta nas configurações.';
    } else if (error.code === 'insufficient_quota' || error.status === 429 || error.code === 'rate_limit_exceeded') {
      errorMessage = 'Limite de uso da API OpenAI atingido';
      errorDetails = 'Sua conta OpenAI atingiu o limite de requisições ou ficou sem créditos.';
      userSuggestion = 'Aguarde alguns minutos e tente novamente, ou adicione créditos na sua conta OpenAI em https://platform.openai.com/account/billing';
    } else if (error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
      errorMessage = 'Erro de conexão com OpenAI';
      errorDetails = 'Não foi possível conectar aos servidores da OpenAI.';
      userSuggestion = 'Verifique sua conexão com a internet e tente novamente.';
    } else if (error.message.includes('Formato de resposta inválido')) {
      errorMessage = 'Erro ao processar resposta da IA';
      errorDetails = error.message;
      userSuggestion = 'Tente tirar outra foto com melhor iluminação e enquadramento.';
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetails,
        suggestion: userSuggestion,
        code: error.code || error.status || 'unknown'
      },
      { status: 500 }
    );
  }
}
