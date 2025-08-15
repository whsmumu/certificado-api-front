import { useLocation } from "react-router-dom";
import { useEffect } from "react";

// 1. Importe o GIF do seu diretório de assets
import catGif from "../assets/cat.gif"; 

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        
        {/* 2. Adicione a tag <img> com o GIF importado */}
        <img 
          src={catGif} 
          alt="Gatinho fofo se aproximando da câmera" 
          className="mx-auto mb-4 w-64 rounded-lg" 
        />
        <p className="text-xl text-gray-800 mb-4">Calma rapaz, aqui tem segurança</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Voltar
        </a>
      </div>
    </div>
  );
};

export default NotFound;