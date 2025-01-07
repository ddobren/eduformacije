import { Search, School, Brain, Sparkles, BotIcon as Robot } from 'lucide-react';
import { NormalButton } from '../common/NormalButton';
import { GradientButton } from '../common/GradientButton';
import { FeatureCard } from './FeatureCard';
import { AnimatedBackground } from '../common/AnimatedBackground';
import { useNavigate } from 'react-router-dom';

export const Hero = () => {
  const features = [
    {
      icon: Search,
      title: 'Napredna pretraga',
      description: 'Pronađi savršenu školu koristeći napredne filtere za lokaciju, program i specifične kriterije',
    },
    {
      icon: Brain,
      title: 'AI Preporuke',
      description: 'Otkrij škole koje najbolje odgovaraju tvojim interesima uz pomoć našeg AI sustava',
    },
    {
      icon: School,
      title: 'Detaljan pregled',
      description: 'Upoznaj svaku školu kroz detaljan pregled programa, aktivnosti i mogućnosti',
    },
  ];

  const navigateTo = useNavigate();

  return (
    <div className="relative min-h-screen pt-20 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-8 hover:bg-primary-500/15 transition-colors">
            <Sparkles className="w-4 h-4 text-primary-400" />
            <span className="text-sm text-primary-400 font-medium">Powered by AI tehnologija</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-8 tracking-tight">
            <span className='bg-gradient-to-r from-red-600 via-white to-blue-600 bg-clip-text text-transparent animate-gradient-flow'>Pronađi</span> svoju idealnu{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-400 bg-clip-text text-transparent">
                školu
              </span>
              <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400/0 via-primary-500/50 to-primary-400/0"></span>
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Otkrij najbolje obrazovne mogućnosti uz pomoć našeg naprednog AI sustava koji personalizira preporuke prema
            tvojim jedinstvenim interesima i ciljevima
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-24">
            <NormalButton onClick={() => {
              navigateTo('/search');
            }}>
              <School size={20} />
              Istraži sve škole
            </NormalButton>

            <GradientButton onClick={() => {
              navigateTo('/find');
            }}>
              <Robot size={20} />
              Otkrij svoju školu
            </GradientButton>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-32">
            {features.map((feature, index) => (
              <FeatureCard key={index} Icon={feature.icon} title={feature.title} description={feature.description} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
