import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface JWTPayload {
  sub?: string;
  email?: string;
  [key: string]: unknown;
}

interface UsuarioData {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  perfil: string;
}

export const useAdminProtection = () => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verificarAcesso = async () => {
      try {
        // Obtém o token do localStorage
        const token = typeof window !== "undefined" ? localStorage.getItem("jwt_token") : null;

        if (!token) {
          console.warn("Token não encontrado. Redirecionando para login...");
          router.push("/login");
          setIsLoading(false);
          return;
        }

        // Decodifica o JWT para extrair o email
        const parts = token.split(".");
        if (parts.length !== 3) {
          console.error("Token inválido");
          localStorage.removeItem("jwt_token");
          router.push("/login");
          setIsLoading(false);
          return;
        }

        const payload = JSON.parse(atob(parts[1])) as JWTPayload;
        const emailDoToken = payload.sub || payload.email;

        if (!emailDoToken) {
          console.error("Email não encontrado no token");
          localStorage.removeItem("jwt_token");
          router.push("/login");
          setIsLoading(false);
          return;
        }

        console.log("Email extraído do token:", emailDoToken);

        // Busca dados do usuário no endpoint para obter o perfil
        const responseUsuario = await fetch(
          `http://localhost:8080/api/usuarios/email/${emailDoToken}`,
          {
            method: "GET",
            headers: {
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`
            }
          }
        );

        if (!responseUsuario.ok) {
          console.error("Erro ao buscar usuário no endpoint");
          localStorage.removeItem("jwt_token");
          router.push("/login");
          setIsLoading(false);
          return;
        }

        const usuarioData: UsuarioData = await responseUsuario.json();
        console.log("Dados do usuário:", usuarioData);
        console.log("Perfil do usuário:", usuarioData.perfil);

        // Verifica se tem perfil 'ADMIN'
        if (usuarioData.perfil !== "ADMIN") {
          console.warn("Usuário não possui perfil de ADMIN. Redirecionando para /loja...");
          router.push("/loja");
          setIsLoading(false);
          return;
        }

        // Se chegou aqui, está autorizado
        console.log("Usuário ADMIN autorizado");
        setIsAuthorized(true);
      } catch (error) {
        console.error("Erro ao verificar autorização:", error);
        localStorage.removeItem("jwt_token");
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    verificarAcesso();
  }, [router]);

  return { isAuthorized, isLoading };
};
