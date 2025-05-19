"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosInstance";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useAuthUser } from "@/app/user/login/useCurrentUser";

export default function RegisterPermission({ onSuccess }) {
  const { user, isLoading, error } = useAuthUser();
  
  const queryClient = useQueryClient();
  // const { user, isLoading, error } = useAuthUser();

  const [formData, setFormData] = useState({
    departureDate: "",
    entryDate: "",
    adress: "",
    destination: "",
    motive: "",
    observation: "",
    responsablesSeleccionados: [],
  });

  const [responsables, setResponsables] = useState({
    instructor: [],
    cordinador: [],
    liderBienestar: [],
    internado: [],
  });

  const getConsult = {
    instructor: "/api/Responsible/GetResponsiblesByRole/roleid=1",
    cordinador: "/api/Responsible/GetResponsiblesByRole/roleid=2",
    liderBienestar: "/api/Responsible/GetResponsiblesByRole/roleid=3",
    internado: "/api/Responsible/GetResponsiblesByRole/roleid=4",
  };

 const ordenRoles = ["instructor", "cordinador", "liderBienestar"];

if (user?.tip_Apprentice === "interno") {
  ordenRoles.push("internado");
}
  const fetchResponsables = async () => {
    const roles = Object.keys(getConsult);
    for (const rol of roles) {
      const res = await axiosInstance.get(getConsult[rol]);
      setResponsables((prev) => ({ ...prev, [rol]: res.data }));
    }
  };

  useEffect(() => {
    fetchResponsables();
  }, []);

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        permission: {
          departureDate: formData.departureDate,
          entryDate: formData.entryDate,
          adress: formData.adress,
          destination: formData.destination,
          motive: formData.motive,
          observation: formData.observation,
          status: 0,
        },
        responsablesSeleccionados: formData.responsablesSeleccionados,
      };

      const res = await axiosInstance.post(
        "/api/permission/CrearPermiso",
        payload
      );

      return res.data;
    },
    onSuccess: (data) => {
      toast.success(`${data.message}`);
      setFormData({
        departureDate: "",
        entryDate: "",
        adress: "",
        destination: "",
        motive: "",
        observation: "",
        responsablesSeleccionados: [],
      });

      if (onSuccess) onSuccess();
      queryClient.invalidateQueries(["permissions"]);
    },
    onError: (error) => {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message;
      toast.error(msg);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleResponsableSelect = (value) => {
    const parsed = parseInt(value);
    if (!formData.responsablesSeleccionados.includes(parsed)) {
      setFormData((prev) => ({
        ...prev,
        responsablesSeleccionados: [...prev.responsablesSeleccionados, parsed],
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate();
  };
    if (isLoading) return <div>Cargando usuario...</div>;
    if (error) return <div>Error al cargar usuario: {error.message}</div>;
    if (!user) return <div>No se encontró información del usuario</div>;
    console.log(user);
    console.log("Tipo de aprendiz:", user?.tip_Apprentice);

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 "
    >

      <div className="space-y-2">
        <Label htmlFor="departureDate">Fecha de salida</Label>
        <Input
          type="datetime-local"
          name="departureDate"
          value={formData.departureDate}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="entryDate">Fecha de entrada</Label>
        <Input
          type="datetime-local"
          name="entryDate"
          value={formData.entryDate}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="adress">Dirección</Label>
        <Input
          type="text"
          name="adress"
          value={formData.adress}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="destination">Destino</Label>
        <Input
          type="text"
          name="destination"
          value={formData.destination}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="motive">Motivo</Label>
        <Input
          type="text"
          name="motive"
          value={formData.motive}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="observation">Observación</Label>
        <Input
          type="text"
          name="observation"
          value={formData.observation}
          onChange={handleChange}
        />
      </div>

      {ordenRoles.map((rol, index) => {
        const lista = responsables[rol];
        const isEnabled =
          index === 0 || formData.responsablesSeleccionados.length >= index;

        return (
          <div key={rol} className="space-y-2">
            <Label className="capitalize">{rol}</Label>
            <Select
              onValueChange={handleResponsableSelect}
              disabled={!isEnabled}
            >
              <SelectTrigger
                className={isEnabled ? "" : "opacity-50 cursor-not-allowed"}
              >
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {lista.map((r) => (
                  <SelectItem
                    key={r.responsible_Id}
                    value={r.responsible_Id.toString()}
                  >
                    {r.nom_Responsible} {r.ape_Responsible}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      })}

      <Button type="submit" className="w-full">
        Registrar Permiso
      </Button>
    </form>
  );
}
