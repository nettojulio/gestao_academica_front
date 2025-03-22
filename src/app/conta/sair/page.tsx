"use client";
import { useEffect } from "react";
import { useAuth } from "@/components/AuthProvider/AuthProvider";
import withAuthorization from "@/components/AuthProvider/withAuthorization";

 function PageProfile() {
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  useEffect(() => {
    // Executa logout sem redirecionar aqui
    localStorage.removeItem("sgu_authenticated_user");
    setIsAuthenticated(false);
  }, [setIsAuthenticated]);
  if(!isAuthenticated){
    window.location.href = "/login";
  }
  return <p>Saindo...</p>;
}

export default withAuthorization(PageProfile);