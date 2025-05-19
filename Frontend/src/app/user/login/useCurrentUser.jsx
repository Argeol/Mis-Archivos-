"use client";

import { useState, useEffect } from "react";

export function useAuthUser() {
  const [user, setUser] = useState(null);
  const [tip, setTip] = useState(null);

  // Cargar info al montar
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedTip = localStorage.getItem("tip");

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedTip) setTip(storedTip);
  }, []);

  const login = ({ user, tip }) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("tip", tip);
    setUser(user);
    setTip(tip);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("tip");
    setUser(null);
    setTip(null);
  };

  return { user, tip, login, logout };
}
