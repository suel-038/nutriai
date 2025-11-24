'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { UserData } from '@/lib/nutrition';

interface OnboardingQuizProps {
  onComplete: (userData: QuizUserData) => void;
}

interface QuizUserData {
  weight: number;
  height: number;
  age: number;
  goal?: 'lose' | 'maintain' | 'gain' | 'auto';
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
}