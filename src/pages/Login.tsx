import { useState } from "react";
import { LoginForm } from "@/components/ui/login-form";
import { toast } from "sonner";
import api from "@/services/api"; // Importe sua instância do axios

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (username: string, password: string) => {
    setIsLoading(true);
    setError("");

    try {
    
      const params = new URLSearchParams();
      params.append('username', username);
      params.append('password', password);

      // A URL será '/api/login' por causa do proxy do Nginx
      const response = await api.post('/login', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (response.status === 200) {
        toast.success("Login realizado com sucesso!");
  
        console.log("Usuário autenticado:", username);
       
      }
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        toast.error("Credenciais inválidas.");
      } else {
        toast.error("Erro ao conectar com o servidor. Tente novamente.");
        console.error("Login error:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <LoginForm
        onSubmit={handleLogin}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default Login;