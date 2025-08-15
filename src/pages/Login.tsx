import { useState } from "react";
import { LoginForm } from "@/components/ui/login-form";
import { toast } from "sonner";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (username: string, password: string) => {
    setIsLoading(true);
    setError("");

    try {
      // Simulate LDAP authentication
      // Replace this with actual LDAP authentication logic
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes - you can customize the validation logic
      if (username.toLowerCase() === "admin" && password === "password") {
        toast.success("Login realizado com sucesso!");
        // Redirect to dashboard or main app
        console.log("User authenticated:", username);
      } else {
        setError("Credenciais inválidas. Verifique seu usuário e senha.");
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor. Tente novamente.");
      console.error("Login error:", err);
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