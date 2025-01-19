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
    <>
      <main className="relative min-h-screen flex flex-col justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 overflow-hidden px-4 sm:px-6 lg:px-8">
        <AnimatedBackground />

        <div className="relative w-full max-w-7xl mx-auto flex flex-col justify-center items-center space-y-10 sm:space-y-12 py-16 sm:py-20 lg:py-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-8 sm:mb-10 hover:bg-primary-500/15 transition-all duration-300 transform hover:scale-105">
              <Sparkles className="w-4 h-4 text-primary-400 animate-pulse" />
              <span className="text-sm sm:text-base text-primary-400 font-medium">Powered by AI tehnologija</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-red-600 via-white to-blue-600 bg-clip-text text-transparent animate-gradient-flow">
                Pronađi
              </span>{' '}
              svoju idealnu{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-400 bg-clip-text text-transparent">
                  školu
                </span>
                <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400/0 via-primary-500/50 to-primary-400/0"></span>
              </span>
            </h1>

            <p className="text-lg sm:text-xl md:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed">
              Otkrij najbolje obrazovne mogućnosti uz pomoć našeg naprednog AI sustava koji personalizira preporuke prema
              tvojim jedinstvenim interesima i ciljevima
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
              <NormalButton 
                onClick={() => navigateTo('/search')}
                className="w-full sm:w-auto text-base sm:text-lg py-3 px-6 sm:py-3 sm:px-7"
              >
                <School className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Istraži sve škole
              </NormalButton>

              <GradientButton 
                onClick={() => navigateTo('/find')}
                className="w-full sm:w-auto text-base sm:text-lg py-3 px-6 sm:py-3 sm:px-7"
              >
                <Robot className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Otkrij svoju školu
              </GradientButton>
            </div>
          </div>
        </div>
      </main>

      <section className="bg-gray-950 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            Icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
          </div>
        </div>
      </section>
    </>
  );
};

