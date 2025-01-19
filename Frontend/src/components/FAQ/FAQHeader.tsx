import { Sparkles } from "lucide-react";

const FAQHeader = () => {
  return (
    <header className="text-center py-8 sm:py-12">
      <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-primary-500/20 border border-primary-500/30 mb-6 hover:bg-primary-500/25 transition-colors duration-300">
        <Sparkles className="w-5 h-5 text-primary-400" />
        <span className="text-base text-primary-400 font-medium">FAQ</span>
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 sm:mb-8 tracking-tight leading-tight">
        Često postavljena pitanja
      </h1>
      <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
        Pronađite odgovore na najčešća pitanja o našoj platformi i uslugama.
      </p>
    </header>
  );
};

export default FAQHeader;
