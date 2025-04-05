import { Loader2 } from "lucide-react";

export default function Spinner() {
    return (
        <div className="flex justify-center items-center min-h-screen bg-white">
            <style>
                {`
                    @keyframes slow-spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }

                    .animate-slow-spin {
                        animation: slow-spin 6s linear infinite;
                    }

                    .animate-spin-fast {
                        animation: spin 1.5s linear infinite;
                    }
                `}
            </style>

            <div className="relative flex justify-center items-center">
                {/* 🔹 Halo nebuloso en tonos azules */}
                <div className="absolute w-40 h-40 rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-700 opacity-30 blur-3xl animate-pulse"></div>

                {/* 🔹 Círculo de partículas galácticas */}
                <div className="absolute w-28 h-28 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-300 opacity-40 blur-xl animate-slow-spin"></div>

                {/* 🔹 Spinner principal */}
                <Loader2 className="w-24 h-24 text-blue-500 animate-spin-fast drop-shadow-lg" />
            </div>
        </div>
    );
}
