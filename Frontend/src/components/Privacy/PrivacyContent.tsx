const PrivacyContent = () => {
  return (
    <div className="space-y-6 text-gray-300">
      <section>
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-3">
          Prikupljanje podataka
        </h2>
        <p className="text-sm sm:text-base leading-relaxed">
          Naša aplikacija ne prikuplja osobne podatke poput imena, email adrese
          ili bilo čega što je vezano uz tvoj uređaj.
        </p>
      </section>

      <section>
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-3">
          Promjene u politici privatnosti
        </h2>
        <p className="text-sm sm:text-base leading-relaxed">
          Povremeno možemo ažurirati ovu politiku privatnosti kako bismo je
          prilagodili novim tehnologijama ili zakonskim obvezama. Sve izmjene
          bit će jasno naznačene na ovoj stranici.
        </p>
      </section>
    </div>
  );
};

export default PrivacyContent;
