import { Search, BotIcon as Robot, ArrowRight } from 'lucide-react';
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-8 sm:mb-10 hover:bg-primary-500/15 transition-all duration-300 backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
          >
            <Robot className="w-4 h-4 text-primary-400" />
            <span className="text-sm sm:text-base text-primary-400 font-medium">Powered by AI model</span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 sm:mb-8 tracking-tight leading-tight">
            Pronađi svoju{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-400 bg-clip-text text-transparent">
                idealnu školu
              </span>
              <motion.span 
                className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary-400/0 via-primary-500 to-primary-400/0"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 mb-10 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
            Otkrijte najbolje obrazovne mogućnosti uz pomoć našeg AI sustava koji personalizira preporuke prema vašim jedinstvenim potrebama.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <GradientButton
              onClick={() => navigateTo('/find')}
              className="w-full sm:w-auto text-base py-4 px-8 group"
            >
              <Robot className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              Započni AI pretragu
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </GradientButton>

            <NormalButton
              onClick={() => navigateTo('/search')}
              className="w-full sm:w-auto text-base py-4 px-8 bg-white/10 hover:bg-white/15 backdrop-blur-sm transition-all duration-300"
            >
              <Search className="w-5 h-5 mr-2" />
              Pretraži sve škole
            </NormalButton>
          </div>

          <motion.div 
            className="mt-16 flex items-center justify-center gap-8 text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary-500" />
              <span>1000+ škola</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary-500" />
              <span>AI preporuke</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary-500" />
              <span>24/7 podrška</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <ScrollIndicator />
    </section>
  );
};
