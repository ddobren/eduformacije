import React from "react";
import { Mail, Sparkles, MessageCircle } from "lucide-react";

// Umjesto izravnog layouta za svaku "karticu", možeš iskoristiti reusable komponentu:
interface ContactCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
}

const ContactCard: React.FC<ContactCardProps> = ({
  icon: Icon,
  title,
  description,
  href,
  linkLabel,
}) => {
  return (
    <div className="flex flex-col items-center bg-gray-800/60 backdrop-blur-sm 
                    rounded-lg p-6 border border-gray-700 transition-colors 
                    hover:border-primary-500 hover:shadow-lg">
      <div className="flex flex-col items-center text-center space-y-3">
        {/* Ikona u kružiću */}
        <div className="bg-primary-500/10 p-3 rounded-full">
          <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-primary-400" />
        </div>
        {/* Naslov */}
        <h3 className="text-lg sm:text-xl font-semibold text-white">{title}</h3>
        {/* Opis */}
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          {description}
        </p>
        {/* Link */}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-400 hover:text-primary-300 transition-colors 
                     underline text-sm sm:text-base mt-2"
        >
          {linkLabel}
        </a>
      </div>
    </div>
  );
};

export const ContactContent = () => {
  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-10">
      {/* Zaglavlje */}
      <header className="text-center py-8 sm:py-12">
        <div className="inline-flex items-center gap-3 px-5 py-2 
                        rounded-full bg-primary-500/20 border border-primary-500/30 
                        mb-6 hover:bg-primary-500/25 transition">
          <Sparkles className="w-5 h-5 text-primary-400" />
          <span className="text-base text-primary-400 font-medium">Kontakt</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 sm:mb-8 tracking-tight leading-tight">
          Stupite u kontakt
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-gray-400 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
          Ako imate pitanja, trebate dodatne informacije ili želite surađivati,
          slobodno nam se javite.
        </p>
      </header>

      {/* Sekcije za kontakt */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
        {/* Email Sekcija */}
        <ContactCard
          icon={Mail}
          title="Email"
          description="Slobodno nam se javite putem emaila za bilo kakva pitanja, prijedloge ili informacije."
          href="mailto:dragojevicdobren@gmail.com"
          linkLabel="dragojevicdobren@gmail.com"
        />

        {/* WhatsApp Sekcija */}
        <ContactCard
          icon={MessageCircle}
          title="WhatsApp"
          description="Pridružite se našoj zajednici na WhatsAppu i budite u tijeku s najnovijim informacijama i diskusijama."
          href="https://chat.whatsapp.com/H9Gqn0TWWlt0zWMbA1mSfV"
          linkLabel="Pridružite se putem WhatsAppa"
        />
      </div>
    </div>
  );
};
