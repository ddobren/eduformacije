import { Loader2 } from 'lucide-react';

export const FetchLoading = () => {
    return (
        <div className="w-full px-2 sm:px-6 lg:px-8">
            <div className="w-full max-w-[100%] sm:max-w-4xl mx-auto bg-gray-900/30 backdrop-blur-sm p-8 rounded-lg sm:rounded-2xl border border-gray-800/50">
                <div className="flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="w-12 h-12 text-primary-400 animate-spin" />
                    <h3 className="text-xl font-medium text-white">Dohvaćamo tvoje interese...</h3>
                </div>
            </div>
        </div>
    );
};

export default FetchLoading;
