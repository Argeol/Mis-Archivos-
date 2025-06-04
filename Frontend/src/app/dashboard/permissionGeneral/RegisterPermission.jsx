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
import LoadingPage from "@/components/utils/LoadingPage";

export default function RegisterPermission({ onSuccess }) {
  const { user, isLoading, error } = useAuthUser();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    departureDate: "",
    departureDateOnly: "",
    departureTimeOnly: "",
    entryDate: "",
    entryDateOnly: "",
    entryTimeOnly: "",
    adress: "",
    destination: "",
    motive: "",
    observation: "",
    responsablesSeleccionados: {},
  });

  const [responsables, setResponsables] = useState({
    instructor: [],
    cordinador: [],
    Bienestar: [],
    internado: [],
  });

  const getConsult = {
    instructor: "/api/Responsible/GetResponsiblesByRole/roleid=1",
    cordinador: "/api/Responsible/GetResponsiblesByRole/roleid=2",
    Bienestar: "/api/Responsible/GetResponsiblesByRole/roleid=3",
    internado: "/api/Responsible/GetResponsiblesByRole/roleid=4",
  };

  const ordenRoles = ["instructor", "cordinador", "Bienestar"];
  if (user?.tip_Apprentice === "interno") {
    ordenRoles.push("internado");
  }
  const motivos = ["Médico", "Personal", "Académico", "Familiar"];

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
        responsablesSeleccionados: Object.values(formData.responsablesSeleccionados),
      };

      const res = await axiosInstance.post("/api/permission/CrearPermiso", payload);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(`${data.message}`);
      setFormData({
        departureDate: "",
        departureDateOnly: "",
        departureTimeOnly: "",
        entryDate: "",
        entryDateOnly: "",
        entryTimeOnly: "",
        adress: "",
        destination: "",
        motive: "",
        observation: "",
        responsablesSeleccionados: {},
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

  const handleResponsableSelect = (rol, value) => {
    const parsed = parseInt(value);
    setFormData((prev) => ({
      ...prev,
      responsablesSeleccionados: {
        ...prev.responsablesSeleccionados,
        [rol]: parsed,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const departureDate = `${formData.departureDateOnly}T${formData.departureTimeOnly}`;
    const entryDate = `${formData.entryDateOnly}T${formData.entryTimeOnly}`;
    const fechaSalida = new Date(departureDate);
    const fechaEntrada = new Date(entryDate);
    const ahora = new Date();

    if (isNaN(fechaSalida.getTime()) || isNaN(fechaEntrada.getTime())) {
      toast.error("Las fechas no son válidas.");
      return;
    }

    if (fechaSalida < ahora) {
      toast.error("La fecha y hora de salida no puede ser anterior al momento actual.");
      return;
    }

    if (fechaEntrada <= fechaSalida) {
      toast.error("La fecha y hora de entrada debe ser posterior a la de salida.");
      return;
    }
    const rolesRequeridos = ["instructor", "cordinador", "Bienestar"];
    if (user?.tip_Apprentice === "interno") {
      rolesRequeridos.push("internado");
    }

    const faltanRoles = rolesRequeridos.filter(
      (rol) => !formData.responsablesSeleccionados[rol]
    );

    if (faltanRoles.length > 0) {
      toast.error(
        `Debes seleccionar responsables para: ${faltanRoles
          .map((r) => r.charAt(0).toUpperCase() + r.slice(1))
          .join(", ")}`
      );
      return;
    }

    setFormData((prev) => ({
      ...prev,
      departureDate,
      entryDate,
    }));

    mutation.mutate();
  };

  if (isLoading) return <LoadingPage />;
  if (error) return <div>Error al cargar usuario: {error.message}</div>;
  if (!user) return <div>No se encontró información del usuario</div>;

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-6 bg-white border border-black rounded-2xl shadow">

      {/* Encabezado institucional */}
      <div className="text-center border-b border-black pb-4 space-y-1">
        <img src="assets/img/logoSena.png" alt="Logo SENA" className="mx-auto h-14" />
        <h2 className="text-xl font-bold uppercase">Centro Agropecuario “La Granja” SENA Espinal</h2>
        <p className="font-semibold text-sm">Solicitud de Permiso para Aprendices</p>
        <p className="text-xs font-medium italic">
          NOTA: El aprendiz sale del centro bajo su responsabilidad.
        </p>
      </div>

      {/* Fechas y horas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="departureDateOnly">Fecha de salida</Label>
          <Input
            type="date"
            name="departureDateOnly"
            value={formData.departureDateOnly}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="departureTimeOnly">Hora de salida</Label>
          <Input
            type="time"
            name="departureTimeOnly"
            value={formData.departureTimeOnly}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="entryDateOnly">Fecha de entrada</Label>
          <Input
            type="date"
            name="entryDateOnly"
            value={formData.entryDateOnly}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="entryTimeOnly">Hora de entrada</Label>
          <Input
            type="time"
            name="entryTimeOnly"
            value={formData.entryTimeOnly}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Información general */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="adress">Dirección</Label>
          <Input
            type="text"
            name="adress"
            value={formData.adress}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="destination">Destino</Label>
          <Input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Motivo y observación */}
      <div className="space-y-1">
        <Label htmlFor="motive">Motivo del permiso</Label>
        <Input
          type="text"
          name="motive"
          value={formData.motive}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="observation">Observaciones</Label>
        <textarea
          name="observation"
          value={formData.observation}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          rows={3}
        />
      </div>

      {/* Aprobadores */}
      <div className="border border-black mt-4 p-4 space-y-3">
        <h3 className="text-sm font-semibold text-center">Responsables que deben aprobar</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ordenRoles.map((rol, index) => {
            const lista = responsables[rol];
            const isEnabled =
              index === 0 ||
              Object.keys(formData.responsablesSeleccionados).length >= index;

            return (
              <div key={rol} className="space-y-1">
                <Label className="capitalize">{rol}</Label>
                <Select
                  onValueChange={(value) => handleResponsableSelect(rol, value)}
                  disabled={!isEnabled}
                >
                  <SelectTrigger
                    className={`w-full ${!isEnabled ? "opacity-50 cursor-not-allowed" : ""}`}
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
        </div>
      </div>

      {/* Botón de envío */}
      <div className="pt-4">
       <Button
        type="submit"
        disabled={mutation.isLoading}
        className="mt-4 bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 rounded-md mx-auto block w-full flex items-center justify-center gap-2"
      >
        {mutation.isLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            Registrando...
          </>
        ) : (
          <>Registrar Permiso</>
        )}
      </Button>
      </div>

      {/* Nota final */}
      <p className="text-xs italic text-center border-t pt-2 text-gray-600">
        Las firmas se deben recolectar en orden: Instructor → Coordinador → Bienestar → Internado (si aplica).
      </p>
    </form>
  );
}
