import { Loader2 } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
        <p className="text-lg font-medium text-gray-600">Cargando, Por favor espera...</p>
      </div>
    </div>
  );
}
