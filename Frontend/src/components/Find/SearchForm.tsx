import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Search, Sparkles, AlertCircle, FilterIcon } from "lucide-react";
import { CountySelect } from "./CountySelect";
import { CitySelect } from "./CitySelect";
import { EntranceExamSelect } from "./EntranceExamSelect";
import { FounderTypeSelect } from "./FounderTypeSelect";
import { GradientButton } from "../common/GradientButton";
import { toast } from "../../utils/toast";

const MAX_CHARS = 200;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.4rz5eH4rojtUQSPI8CcroOf4CRJjo6N9_HQAI_9e1t0";

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries: number = MAX_RETRIES,
  delayMs: number = RETRY_DELAY
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      if (response.ok || response.status !== 500) {
        return response;
      }

      if (attempt === maxRetries) {
        throw new Error(`Server error after ${maxRetries} attempts`);
      }

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries) {
        throw lastError;
      }

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError || new Error("Unknown error occurred");
}

interface SearchFormProps {
  onSearchStart: () => void;
  onSearchComplete: (
    results: {
      objasnjenje: string;
      programi: {
        skolaProgramRokId: string;
        program: string;
      }[];
    } | null
  ) => void;
}

export const SearchForm = ({
  onSearchStart,
  onSearchComplete,
}: SearchFormProps) => {
  const [interests, setInterests] = useState("");
  const [selectedCounty, setSelectedCounty] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedFounderType, setSelectedFounderType] = useState("");
  const [hasEntranceExam, setHasEntranceExam] = useState<boolean | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInterestsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARS) {
      setInterests(text);
    }
  };

  const handleClearCounty = () => {
    setSelectedCounty("");
    setSelectedCity("");
  };

  const handleClearCity = () => {
    setSelectedCity("");
  };

  const handleClearFounderType = () => {
    setSelectedFounderType("");
  };

  useEffect(() => {
    const adjustTextareaHeight = () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    };

    adjustTextareaHeight();
    window.addEventListener("resize", adjustTextareaHeight);

    return () => {
      window.removeEventListener("resize", adjustTextareaHeight);
    };
  }, [textareaRef]);

  const charsRemaining = MAX_CHARS - interests.length;
  const isNearLimit = charsRemaining <= 20;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (interests === "") {
      toast.warning("Molimo unesite svoje interese i želje.");
      return;
    }

    const params = new URLSearchParams();
    if (selectedCounty) params.append("zupanija", selectedCounty);
    if (selectedCity) params.append("mjesto", selectedCity);
    if (selectedFounderType) params.append("founderType", selectedFounderType);
    if (hasEntranceExam !== null)
      params.append("imaDodatnuProvjeru", String(hasEntranceExam));

    onSearchStart();

    try {
      const endpoint = `https://engine.eduformacije.com/api/v1/srednje-skole?${params.toString()}`;
      const response = await fetchWithRetry(endpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Greška prilikom dohvaćanja podataka.");
      }

      const data = await response.json();
      const programs =
        data && data.length > 0
          ? data.map(
              (item: { Program: string; SkolaProgramRokId: number }) => ({
                skolaProgramRokId: String(item.SkolaProgramRokId),
                program: item.Program,
              })
            )
          : [];

      const jsonBody = {
        interesi: interests,
        programi: programs,
      };

      const suggestionsResponse = await fetchWithRetry(
        "https://engine.eduformacije.com/api/v1/srednje-skole/sugestije",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsonBody),
        }
      );

      if (!suggestionsResponse.ok) {
        throw new Error("Greška prilikom dohvaćanja sugestija.");
      }

      const suggestions = await suggestionsResponse.json();
      onSearchComplete(suggestions);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Došlo je do greške."
      );
      onSearchComplete(null);
    }
  };

  return (
    <div className="w-full overflow-x-hidden">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <form onSubmit={handleSubmit} className="relative">
          <div className="bg-gradient-to-b from-gray-900/80 to-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-800/50 shadow-2xl">
            {/* Header Section */}
            <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-gray-800/30">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20">
                  <Sparkles className="w-3.5 h-3.5 text-primary-400" />
                  <span className="text-xs font-medium text-primary-400">
                    AI asistent
                  </span>
                </div>
                <span
                  className={`text-xs ${
                    isNearLimit ? "text-orange-400" : "text-gray-400"
                  }`}
                >
                  {charsRemaining} znakova
                </span>
              </div>
            </div>

            {/* Main Content */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Interests Section */}
              <div className="space-y-2 sm:space-y-3">
                <label className="block text-sm font-medium text-white/90">
                  Opiši svoje interese i želje
                </label>
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={interests}
                    onChange={handleInterestsChange}
                    autoComplete="off"
                    spellCheck={false}
                    className="w-full min-h-[112px] px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/40 border border-gray-700/50 rounded-xl
                    focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 resize-none
                    text-white placeholder-gray-500 text-sm md:text-base transition-all outline-none overflow-hidden
                    md:leading-6"
                    style={{ fontSize: "16px" }}
                    placeholder="Npr: Zanima me fitness i zdrav način života. Volio/la bih postati personalni trener..."
                  />
                  {isNearLimit && (
                    <div className="absolute bottom-2 right-2 flex items-center gap-1.5 text-orange-400">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Što više detalja pružiš o svojim interesima i hobijima, to
                  ćemo ti preciznije pomoći pronaći idealnu školu.
                </p>
              </div>

              {/* Filters Section */}
              <div className="space-y-3 sm:space-y-4">
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center justify-between w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors border border-gray-700/50"
                >
                  <div className="flex items-center gap-2">
                    <FilterIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-white/90">
                      Dodatni filtri
                    </span>
                  </div>
                  <svg
                    className={`w-5 h-5 text-white transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isExpanded && (
                  <div className="space-y-3 sm:space-y-4 bg-gray-800/30 p-3 sm:p-4 rounded-lg animate-fadeIn">
                    <CountySelect
                      value={selectedCounty}
                      onChange={setSelectedCounty}
                      onClear={handleClearCounty}
                    />
                    <CitySelect
                      value={selectedCity}
                      onChange={setSelectedCity}
                      onClear={handleClearCity}
                      countyId={selectedCounty}
                    />
                    <FounderTypeSelect
                      value={selectedFounderType}
                      onChange={setSelectedFounderType}
                      onClear={handleClearFounderType}
                    />
                    <EntranceExamSelect
                      value={hasEntranceExam}
                      onChange={setHasEntranceExam}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Footer/Submit Section */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-800/30">
              <GradientButton className="w-full py-2.5 sm:py-3 text-sm font-medium">
                <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="ml-2">Pronađi škole</span>
              </GradientButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchForm;
