import { Logo } from './Logo';

export const LoadingScreen = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950">
            {/* Animirani logotip */}
            <div className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24">
                <Logo />
            </div>
            {/* Loading kružić */}
            <div className="mt-6 h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
};
