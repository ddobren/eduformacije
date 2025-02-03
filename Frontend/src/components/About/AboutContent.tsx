import { Sparkles, TrendingUp, Lightbulb, Globe } from "lucide-react";
import { FeatureCard } from "../Home/FeatureCard";

export const AboutContent = () => {
  const features = [
    {
      icon: TrendingUp,
      title: "Naša misija",
      description:
        "Naša misija je učenicima i roditeljima omogućiti pristup detaljnim informacijama o školama na intuitivan i jednostavan način, s naglaskom na AI preporuke.",
    },
    {
      icon: Lightbulb,
      title: "Kako radimo",
      description:
        "Koristimo najnovije tehnologije za analizu podataka o školama i interesima korisnika kako bismo pružili najbolje moguće preporuke.",
    },
    {
      icon: Globe,
      title: "Što nudimo",
      description:
        "Naša platforma omogućava korisnicima da istraže mogućnosti obrazovanja širom Hrvatske, prilagođene njihovim interesima i potrebama.",
    },
  ];

  return (
    <div
      className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 
                 pt-24 sm:pt-32 pb-10"
    >
      {/* Zaglavlje */}
      <header className="text-center py-8 sm:py-12">
        <div className="inline-flex items-center gap-3 px-5 py-2 
                        rounded-full bg-primary-500/20 border border-primary-500/30 
                        mb-6 hover:bg-primary-500/25 transition">
          <Sparkles className="w-5 h-5 text-primary-400" />
          <span className="text-base text-primary-400 font-medium">
            O aplikaciji
          </span>
        </div>
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold 
                     text-white mb-6 sm:mb-8 tracking-tight leading-tight"
        >
          Dobrodošli u Eduformacije
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
          Eduformacije koristi najsuvremenije tehnologije kako bi pomogla
          učenicima i roditeljima da pronađu idealnu školu prilagođenu
          jedinstvenim interesima i potrebama.
        </p>
      </header>

      {/* Kartice (FeatureCard) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
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
  );
};
