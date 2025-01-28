import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const ScrollIndicator = () => {
    const [isVisible, setIsVisible] = useState(true);

    const scrollToFeatures = () => {
        const featuresSection = document.querySelector('#features');
        featuresSection?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleScroll = () => {
        if (window.scrollY > 50) {
            setIsVisible(false);
        } else {
            setIsVisible(true);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className={`absolute bottom-0 left-0 w-full flex justify-center pb-8 ${isVisible ? 'block' : 'hidden'}`}>
            <motion.div
                className="cursor-pointer"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                onClick={scrollToFeatures}
            >
                <motion.div
                    animate={{
                        y: [0, 8, 0],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="flex flex-col items-center gap-2"
                >
                    <span className="text-gray-400 text-sm font-medium hidden sm:block">Scroll za više</span>
                    <ChevronDown className="w-6 h-6 text-primary-400" />
                </motion.div>
            </motion.div>
        </div>
    );
};
