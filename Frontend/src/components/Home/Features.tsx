import { Search, School, Brain } from 'lucide-react';
import { FeatureCard } from './FeatureCard';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

export const Features = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI Preporuke',
      description: 'Personalizirane preporuke škola bazirane na vašim interesima i ciljevima',
    },
    {
      icon: Search,
      title: 'Napredna pretraga',
      description: 'Filtrirajte škole po lokaciji, programu i specifičnim kriterijima',
    },
    {
      icon: School,
      title: 'Detaljan pregled',
      description: 'Istražite svaku školu kroz detaljan pregled programa i mogućnosti',
    }
  ];

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="features" ref={ref} className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950/50 to-gray-900/50 backdrop-blur-sm" />
      
      <div className="relative w-full max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Sve što trebate za pronalazak idealne škole
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Naše napredne funkcionalnosti omogućuju vam da donesete informiranu odluku o vašem obrazovanju
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, staggerChildren: 0.2 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <FeatureCard
                Icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
