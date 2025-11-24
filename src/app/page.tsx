'use client';

import { useState, useEffect } from 'react';
import FoodDiary from './components/FoodDiary';
import DietPlanView from './components/DietPlanView';
import { DietPlan } from '@/lib/nutrition'; // assuming this exists

export default function Home() {
  const [paid, setPaid] = useState(false);
  const [step, setStep] = useState(0); // 0: welcome, 1-5: questions, 6: final
  const [data, setData] = useState({
    weight: '',
    height: '',
    age: '',
    goal: '',
    activity: ''
  });

  useEffect(() => {
    const isPaid = localStorage.getItem('paid') === 'true';
    setPaid(isPaid);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (step < 6) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const handlePaymentRedirect = () => {
    // Store quiz data in localStorage
    localStorage.setItem('quizData', JSON.stringify(data));
    window.location.href = 'https://checkout.keoto.com/77872f9f-59ed-4465-98b8-1e7daf132888';
  };

  if (!paid) {
    // Quiz flow
    if (step === 0) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="text-center px-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Vamos começar sua jornada
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Responda algumas perguntas rápidas para criarmos sua dieta personalizada.
            </p>
            <button
              onClick={nextStep}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Iniciar Quiz
            </button>
          </div>
        </div>
      );
    }

    if (step === 1) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="text-center px-6 max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Qual é o seu peso atual?</h2>
            <p className="text-gray-600 mb-6">(Responda em kg)</p>
            <input
              type="number"
              value={data.weight}
              onChange={(e) => handleInputChange('weight', e.target.value)}
              placeholder="Ex: 72"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex justify-between">
              <button onClick={prevStep} className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600">Voltar</button>
              <button onClick={nextStep} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">Próximo</button>
            </div>
          </div>
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="text-center px-6 max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Qual é a sua altura?</h2>
            <p className="text-gray-600 mb-6">(Responda em centímetros)</p>
            <input
              type="number"
              value={data.height}
              onChange={(e) => handleInputChange('height', e.target.value)}
              placeholder="Ex: 168"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex justify-between">
              <button onClick={prevStep} className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600">Voltar</button>
              <button onClick={nextStep} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">Próximo</button>
            </div>
          </div>
        </div>
      );
    }

    if (step === 3) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="text-center px-6 max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Quantos anos você tem?</h2>
            <input
              type="number"
              value={data.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              placeholder="Ex: 28"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex justify-between">
              <button onClick={prevStep} className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600">Voltar</button>
              <button onClick={nextStep} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">Próximo</button>
            </div>
          </div>
        </div>
      );
    }

    if (step === 4) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="text-center px-6 max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Qual é seu objetivo no momento?</h2>
            <p className="text-gray-600 mb-6">(Opcional, mas recomendado)</p>
            <div className="text-left mb-6">
              {['Perder peso', 'Manter peso', 'Ganhar massa muscular', 'Não sei ainda (o app decide automaticamente)'].map(option => (
                <label key={option} className="block mb-2">
                  <input
                    type="radio"
                    name="goal"
                    value={option}
                    checked={data.goal === option}
                    onChange={(e) => handleInputChange('goal', e.target.value)}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
            <div className="flex justify-between">
              <button onClick={prevStep} className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600">Voltar</button>
              <button onClick={nextStep} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">Próximo</button>
            </div>
          </div>
        </div>
      );
    }

    if (step === 5) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="text-center px-6 max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Qual é seu nível de atividade física?</h2>
            <p className="text-gray-600 mb-6">(Opcional - Isso melhora o cálculo calórico, mas pode ser pulado.)</p>
            <div className="text-left mb-6">
              {['Sedentário', 'Levemente ativo', 'Moderadamente ativo', 'Muito ativo', 'Atleta'].map(option => (
                <label key={option} className="block mb-2">
                  <input
                    type="radio"
                    name="activity"
                    value={option}
                    checked={data.activity === option}
                    onChange={(e) => handleInputChange('activity', e.target.value)}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
            <div className="flex justify-between">
              <button onClick={prevStep} className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600">Voltar</button>
              <button onClick={nextStep} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">Próximo</button>
            </div>
          </div>
        </div>
      );
    }

    if (step === 6) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="text-center px-6 max-w-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Pronto!</h2>
            <p className="text-lg text-gray-600 mb-8">
              Com base nas suas respostas, vamos gerar sua dieta completa, com calorias, macros, fibras e micronutrientes ideais para seu corpo.
            </p>
            <button
              onClick={handlePaymentRedirect}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Gerar Dieta
            </button>
          </div>
        </div>
      );
    }

    return null;
  } else {
    // App after payment
    // Assuming a basic diet plan for demo
    const sampleDietPlan: DietPlan = {
      meals: {
        breakfast: {
          name: 'Café da Manhã',
          foods: [
            { name: 'Aveia com leite', quantity: '50g + 200ml', calories: 180, protein: 8, carbs: 30, fat: 4 }
          ],
          totalCalories: 180,
          macros: { protein: 8, carbs: 30, fat: 4 }
        },
        morningSnack: {
          name: 'Lanche da Manhã',
          foods: [
            { name: 'Maçã', quantity: '1 unidade média', calories: 80, protein: 0, carbs: 22, fat: 0 }
          ],
          totalCalories: 80,
          macros: { protein: 0, carbs: 22, fat: 0 }
        },
        lunch: {
          name: 'Almoço',
          foods: [
            { name: 'Arroz branco', quantity: '4 colheres', calories: 200, protein: 4, carbs: 44, fat: 0 }
          ],
          totalCalories: 200,
          macros: { protein: 4, carbs: 44, fat: 0 }
        },
        afternoonSnack: {
          name: 'Lanche da Tarde',
          foods: [
            { name: 'Banana', quantity: '1 unidade média', calories: 105, protein: 1, carbs: 27, fat: 0 }
          ],
          totalCalories: 105,
          macros: { protein: 1, carbs: 27, fat: 0 }
        },
        dinner: {
          name: 'Jantar',
          foods: [
            { name: 'Peixe assado', quantity: '150g', calories: 200, protein: 30, carbs: 0, fat: 8 }
          ],
          totalCalories: 200,
          macros: { protein: 30, carbs: 0, fat: 8 }
        }
      },
      dailyTotal: {
        calories: 765,
        protein: 43,
        carbs: 123,
        fat: 12
      }
    };

    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <h1 className="text-3xl font-bold mb-6">Seu App de Dieta</h1>
        <FoodDiary />
        <DietPlanView dietPlan={sampleDietPlan} onUpdate={(updated) => console.log(updated)} />
      </div>
    );
  }
}