import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Lock, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

// ... (interface e início do componente igual ao anterior)
interface LoginFormProps {
  onSubmit?: (username: string, password: string) => void;
  isLoading?: boolean;
  error?: string;
}

export const LoginForm = ({ onSubmit, isLoading = false, error }: LoginFormProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(username, password);
  };

  return (
    // As classes de gradiente do Tailwind foram adicionadas aqui
    <div className="min-h-screen flex items-center justify-center p-4 relative bg-gradient-to-br from-blue-800 via-slate-900 to-gray-900">
      <Card className={cn(
        "w-full max-w-lg login-fade-in rounded-3xl  border border-gray-400" 
      )}>
        <CardHeader className="space-y-2 text-center p-10 pb-4">
          <CardTitle className="text-3xl font-bold text-foreground pt-8">
            Certificado Digital Novo Mix
          </CardTitle>
          <CardDescription className="text-muted-foreground pt-1">
            Entre com suas credenciais do Active Directory
          </CardDescription>
        </CardHeader>

        <CardContent className="px-14 py-16 pt-6">
          {/* ... O resto do form é exatamente igual ... */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 text-left">
              <Label htmlFor="username" className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                <User className="w-4 h-4 text-foreground" />
                <span>Usuário</span>
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Digite seu usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={cn(
                  "bg-input-bg border-input-border rounded-md h-11",
                  "focus:outline-none focus:border-primary"
                )}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2 text-left">
              <Label htmlFor="password" className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                <Lock className="w-4 h-4 text-foreground" />
                <span>Senha</span>
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn(
                  "bg-input-bg border-input-border rounded-md h-11",
                  "focus:outline-none focus:border-primary"
                )}
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-left">
                <p className="text-sm text-destructive font-medium">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className={cn(
                "w-full bg-primary hover:bg-primary-hover rounded-md h-11",
                "text-primary-foreground font-medium text-base",
                "transition-all duration-200 transform",
                "hover:scale-[1.02] active:scale-[0.98]",
                "shadow-lg hover:shadow-xl"
              )}
              disabled={isLoading || !username || !password}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>Entrando...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <LogIn className="w-5 h-5" />
                  <span>Entrar</span>
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <footer className="absolute bottom-48 left-0 w-full text-white text-center py-4">
        <p className="text-sm">
          &copy; 2025 Novo Mix Supermercados. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
};