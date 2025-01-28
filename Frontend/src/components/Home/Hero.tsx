import { Search, BotIcon as Robot } from 'lucide-react';
import { NormalButton } from '../common/NormalButton';
import { GradientButton } from '../common/GradientButton';
import { AnimatedBackground } from '../common/AnimatedBackground';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ScrollIndicator } from './ScrollIndicator';

export const Hero = () => {
  const navigateTo = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
      <AnimatedBackground />

      <div className="relative w-full max-w-7xl mx-auto flex flex-col justify-center items-center space-y-10 sm:space-y-12 py-16 sm:py-20 lg:py-24">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-8 sm:mb-10 hover:bg-primary-500/15 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-sm sm:text-base text-primary-400 font-medium">Powered by AI tehnologija</span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 sm:mb-8 tracking-tight leading-tight">
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

          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-10 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
            Otkrij najbolje obrazovne mogućnosti uz pomoć našeg naprednog AI sustava koji personalizira preporuke prema
            tvojim jedinstvenim interesima i ciljevima
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <NormalButton 
              onClick={() => navigateTo('/search')}
              className="w-full sm:w-auto text-base sm:text-lg py-3 px-6 sm:py-4 sm:px-8"
            >
              <Search className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              Istraži sve škole
            </NormalButton>

            <GradientButton 
              onClick={() => navigateTo('/find')}
              className="w-full sm:w-auto text-base sm:text-lg py-3 px-6 sm:py-4 sm:px-8"
            >
              <Robot className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              Otkrij svoju školu
            </GradientButton>
          </div>
        </motion.div>
      </div>

      <ScrollIndicator />
    </section>
  );
};
