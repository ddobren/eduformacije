import { Mail, Sparkles, MessageCircle } from 'lucide-react';

export const ContactContent = () => {
  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      {/* Zaglavlje */}
      <header className="text-center py-12 rounded-xl">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-primary-500/20 border border-primary-500/30 mb-6 hover:bg-primary-500/25 transition">
          <Sparkles className="w-5 h-5 text-primary-400" />
          <span className="text-base text-primary-400 font-medium">Kontakt</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-8 tracking-tight leading-tight">
          Stupite u kontakt
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
          Ako imate pitanja, trebate dodatne informacije ili želite surađivati, slobodno mi se javite.
        </p>
      </header>

      {/* Sekcije za kontakt */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email Sekcija */}
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-6 border border-gray-700 hover:border-primary-500 transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <Mail className="w-10 h-10 text-primary-400" />
            <h3 className="text-lg sm:text-xl font-semibold text-white">Email</h3>
          </div>
          <p className="text-gray-400 mb-4">
            Slobodno mi se javite putem emaila za bilo kakva pitanja, prijedloge ili informacije.
          </p>
          <a
            href="mailto:dragojevicdobren@gmail.com"
            className="text-primary-500 hover:text-primary-400 transition-colors underline text-sm sm:text-base lg:text-lg"
          >
            dragojevicdobren@gmail.com
          </a>
        </div>

        {/* WhatsApp Sekcija */}
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-6 border border-gray-700 hover:border-primary-500 transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <MessageCircle className="w-10 h-10 text-primary-400" />
            <h3 className="text-lg sm:text-xl font-semibold text-white">WhatsApp</h3>
          </div>
          <p className="text-gray-400 mb-4">
            Pridružite se našoj zajednici na WhatsAppu i budite u tijeku s najnovijim informacijama i diskusijama.
          </p>
          <a
            href="https://chat.whatsapp.com/H9Gqn0TWWlt0zWMbA1mSfV"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-500 hover:text-primary-400 transition-colors underline text-sm sm:text-base lg:text-lg"
          >
            Pridružite se putem WhatsAppa
          </a>
        </div>
      </div>
    </div>
  );
};
