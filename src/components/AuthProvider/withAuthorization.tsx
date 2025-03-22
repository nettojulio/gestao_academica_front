"use client";

import { default as AuthTokenService } from "@/app/authentication/auth.token";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, ComponentType } from "react";

const withAuthorization = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const WithAuthorizationComponent = (props: P) => {
    const router = useRouter();
    const currentPath = usePathname();
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
    const [checked, setChecked] = useState<boolean>(false);

    useEffect(() => {
      const isAuthenticated = AuthTokenService.isAuthenticated(false);

      
      const restrictedURIsForGestor = [
        // adicionar rotas proibidas para gestor

        "/perfil",
        "/questionario",
        "/pesquisa",
        "/participantes",
        "/questao",
        "/escala",
      ];
      const restrictedURIsForTecnico = [
        // adicionar rotas proibidas para tecnico 

        "/perfil",
        "/questionario",
        "/pesquisa",
        "/participantes",
        "/questao",
        "/escala",
      ];
      const restrictedURIsForUsuario = [
        // adicionar rotas proibidas para usuários 
        "/escala",
      ];

      const restrictedURIsForVisitante = ["/conta/token"];

      // ✅ Evitar erro de iteração sobre `undefined`
      const usuarioRole = AuthTokenService.getUsuarioRoles() || []; // Garante que é um array
      const isAdmin = AuthTokenService.isAdmin(false);
      const isGestor = AuthTokenService.isGestor(false);
      const isTecnico = AuthTokenService.isTecnico(false);
      const isAluno = AuthTokenService.isAluno(false);

      const isUriAllowed = (): boolean => {
        if (isAuthenticated && isAdmin) return true;
        if (!isAuthenticated && restrictedURIsForVisitante.includes(currentPath)) return false;
        if (isGestor && restrictedURIsForGestor.includes(currentPath)) return false;
        if (isTecnico && restrictedURIsForTecnico.includes(currentPath)) return false;
        if (isAluno && restrictedURIsForUsuario.includes(currentPath)) return false;
        return true;
      };

      if (!checked) {
        const allowed = isUriAllowed();
        setIsAuthorized(allowed);

        if (!isAuthenticated && !allowed) {
          console.log("Usuário não autenticado para acessar a URI: " + currentPath);
          router.push("/login");
        } else if (isAuthenticated && !allowed) {
          console.log("Usuário não autorizado para acessar a URI: " + currentPath);
          router.push("/");
        }

        setChecked(true);
      }
    }, [router, checked, currentPath]); // ✅ Adicionado `currentPath` para evitar reatividade incorreta

    return checked && isAuthorized ? <WrappedComponent {...props} /> : null;
  };

  WithAuthorizationComponent.displayName = `WithAuthorization(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return WithAuthorizationComponent;
};

export default withAuthorization;
