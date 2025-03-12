"use client";

import { useState } from "react";
import PrivateNav from "@/components/navs/PrivateNav";
import RegisterApprentice from "./registerApprentice";
import { Button } from "@/components/ui/button";

export default function Apprentice() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <PrivateNav>
      <Button onClick={() => setIsOpen(true)}>Registrar Aprendiz</Button>
      <RegisterApprentice open={isOpen} onClose={() => setIsOpen(false)}  />
    </PrivateNav>
  );
}
