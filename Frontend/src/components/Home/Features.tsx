import { Search, School, Brain } from 'lucide-react';
import { FeatureCard } from './FeatureCard';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

export const Features = () => {
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

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto">
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

