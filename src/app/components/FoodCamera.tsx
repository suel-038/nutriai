'use client';

import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Upload, Loader2, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import { FoodItem } from '@/lib/nutrition';
import { toast } from 'sonner';

interface FoodCameraProps {
  onAddToFoodDiary: (foods: FoodItem[]) => void;
}

interface AnalyzedFood {
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
}

export default function FoodCamera({ onAddToFoodDiary }: FoodCameraProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<{
    foods: AnalyzedFood[];
    totalCalories: number;
    totalMacros: { protein: number; carbs: number; fat: number };
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: selectedImage }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Exibir mensagem de erro específica da API
        const errorMessage = data.error || 'Erro ao analisar imagem';
        const errorDetails = data.details ? ` (${data.details})` : '';
        throw new Error(errorMessage + errorDetails);
      }

      setAnalysis(data);
      toast.success('Análise concluída com sucesso!');
    } catch (error: any) {
      console.error('Erro ao analisar imagem:', error);
      toast.error(error.message || 'Erro ao analisar imagem. Tente novamente.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addToFoodDiary = () => {
    if (!analysis) return;

    const foods: FoodItem[] = analysis.foods.map(food => ({
      name: food.name,
      quantity: food.portion,
      calories: food.calories,
      protein: food.macros.protein,
      carbs: food.macros.carbs,
      fat: food.macros.fat,
    }));

    onAddToFoodDiary(foods);
    toast.success(`${foods.length} alimento(s) adicionado(s) ao diário!`);
    
    // Reset
    setSelectedImage(null);
    setAnalysis(null);
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'medium':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'low':
        return 'text-red-400 bg-red-400/10 border-red-400/30';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  const getConfidenceText = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return 'Alta Confiança';
      case 'medium':
        return 'Média Confiança';
      case 'low':
        return 'Baixa Confiança';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Card */}
      <Card className="bg-gray-900/50 border-orange-500/20 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl">
            <Camera className="w-6 h-6 text-black" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Câmera Nutricional</h2>
            <p className="text-sm text-gray-400">Tire uma foto do alimento para análise instantânea</p>
          </div>
        </div>

        <div className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />

          {!selectedImage ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-orange-500/30 rounded-lg p-12 text-center cursor-pointer hover:border-orange-500/50 transition-all duration-300 hover:bg-orange-500/5"
            >
              <Upload className="w-16 h-16 text-orange-400 mx-auto mb-4" />
              <p className="text-white font-semibold mb-2">Clique para selecionar uma imagem</p>
              <p className="text-sm text-gray-400">Ou arraste e solte aqui</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden border border-orange-500/20">
                <img
                  src={selectedImage}
                  alt="Alimento selecionado"
                  className="w-full h-auto max-h-96 object-contain bg-black"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="flex-1 border-orange-500/30 text-white hover:bg-orange-500/10"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Trocar Imagem
                </Button>
                <Button
                  onClick={analyzeImage}
                  disabled={isAnalyzing}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black font-semibold"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analisando...
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4 mr-2" />
                      Analisar Alimento
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <Card className="bg-gray-900/50 border-orange-500/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Resultado da Análise</h3>
            <Button
              onClick={addToFoodDiary}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar ao Diário
            </Button>
          </div>

          {/* Total Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-black/30 p-4 rounded-lg border border-orange-500/20">
              <p className="text-gray-400 text-sm">Total de Calorias</p>
              <p className="text-2xl font-bold text-orange-400">{analysis.totalCalories} kcal</p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg border border-orange-500/20">
              <p className="text-gray-400 text-sm">Proteína</p>
              <p className="text-2xl font-bold text-orange-400">{analysis.totalMacros.protein}g</p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg border border-orange-500/20">
              <p className="text-gray-400 text-sm">Carboidratos</p>
              <p className="text-2xl font-bold text-orange-400">{analysis.totalMacros.carbs}g</p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg border border-orange-500/20">
              <p className="text-gray-400 text-sm">Gorduras</p>
              <p className="text-2xl font-bold text-orange-400">{analysis.totalMacros.fat}g</p>
            </div>
          </div>

          {/* Individual Foods */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Alimentos Identificados ({analysis.foods.length})</h4>
            {analysis.foods.map((food, index) => (
              <div
                key={index}
                className="bg-black/30 border border-orange-500/20 rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="text-lg font-semibold text-white">{food.name}</h5>
                    <p className="text-sm text-gray-400">
                      {food.portion} • {food.estimatedWeight}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getConfidenceColor(food.confidence)}`}>
                    {getConfidenceText(food.confidence)}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <p className="text-xs text-gray-400">Calorias</p>
                    <p className="text-lg font-bold text-white">{food.calories}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Proteína</p>
                    <p className="text-lg font-bold text-white">{food.macros.protein}g</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Carbs</p>
                    <p className="text-lg font-bold text-white">{food.macros.carbs}g</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Gordura</p>
                    <p className="text-lg font-bold text-white">{food.macros.fat}g</p>
                  </div>
                </div>

                {food.alternatives && food.alternatives.length > 0 && (
                  <div className="pt-3 border-t border-orange-500/20">
                    <p className="text-xs text-gray-400 mb-2">Alimentos similares:</p>
                    <div className="flex flex-wrap gap-2">
                      {food.alternatives.map((alt, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-orange-500/10 border border-orange-500/30 rounded text-xs text-orange-400"
                        >
                          {alt}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Info Card */}
      <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
        <p className="text-sm text-gray-300">
          <span className="font-semibold text-orange-400">💡 Dica:</span> Para melhores resultados, tire fotos com boa iluminação e enquadre bem os alimentos. A IA pode identificar múltiplos itens no mesmo prato!
        </p>
      </div>
    </div>
  );
}
