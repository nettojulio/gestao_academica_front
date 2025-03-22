"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const HomePage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    if(localStorage.getItem("tutorial") == "true"){
      router.push('/home');
    }else{
      router.push('/login');

    }
  }, []);

  return null;
};

export default HomePage;
