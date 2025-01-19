import { Loader2 } from 'lucide-react';

export const LoadingSchools = () => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[100%] sm:max-w-4xl mx-auto bg-gray-900/30 backdrop-blur-sm p-6 sm:p-8 rounded-lg sm:rounded-2xl border border-gray-800/50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-primary-400 animate-spin" />
        <h3 className="text-lg sm:text-xl font-medium text-white mt-4">Učitavanje...</h3>
      </div>
    </div>
  );
};

export default LoadingSchools;
