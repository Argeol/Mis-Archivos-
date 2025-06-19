"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "@/lib/axiosInstance"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RegisterPermissionFS() {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    destino: "",
    fec_Salida: "",
    fec_Entrada: "",
    dia_Salida: "",
    alojamiento: "",
    sen_Empresa: "",
    direccion: "",
  })

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post("/api/PermissionFS/Create", {
        permission: formData,
      })
      return res.data
    },
    onSuccess: () => {
      alert("Permiso FS registrado exitosamente")
      setFormData({
        destino: "",
        fec_Salida: "",
        fec_Entrada: "",
        dia_Salida: "",
        alojamiento: "",
        sen_Empresa: "",
        direccion: "",
      })
      queryClient.invalidateQueries(["permissionsfs"])
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Error al registrar el permiso FS."
      alert(errorMessage)
    },
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectDiaSalida = (value) => {
    setFormData((prev) => ({
      ...prev,
      dia_Salida: value,
    }))
  }

  const handleSelectSenEmpresa = (value) => {
    setFormData((prev) => ({
      ...prev,
      sen_Empresa: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.fec_Salida || !formData.fec_Entrada) {
      alert("Las fechas de salida y entrada son obligatorias.")
      return
    }

    const fechaSalida = new Date(formData.fec_Salida)
    const fechaEntrada = new Date(formData.fec_Entrada)
    const ahora = new Date()

    if (fechaSalida < ahora) {
      alert("La fecha de salida no puede ser anterior al momento actual.")
      return
    }

    if (fechaEntrada <= fechaSalida) {
      alert("La fecha de entrada debe ser posterior a la de salida.")
      return
    }

    mutation.mutate()
  }

  const diasSalida = ["Miércoles", "Domingo", "Fin de semana"]
  const opcionesSenaEmpresa = [
    { value: "Si", label: "Sí" },
    { value: "No", label: "No" },
  ]

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-6 space-y-6 bg-white border border-black rounded-2xl shadow"
    >
      {/* Encabezado institucional */}
      <div className="text-center border-b border-black pb-4 space-y-1">
        <img src="/assets/img/logoSena.png" alt="Logo SENA" className="mx-auto h-14" />
        <h2 className="text-xl font-bold uppercase">Centro Agropecuario "La Granja" SENA Espinal</h2>
        <p className="font-semibold text-sm">Solicitud de Permiso de Formación SENA (INTERNOS)</p>
      </div>


      {/* Fechas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fec_Salida" className="font-semibold">
            Fecha de salida *
          </Label>
          <Input
            id="fec_Salida"
            name="fec_Salida"
            type="date"
            value={formData.fec_Salida}
            onChange={handleChange}
            className="border-[#218EED]/40 focus:border-[#218EED]"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fec_Entrada" className="font-semibold">
            Fecha de entrada *
          </Label>
          <Input
            id="fec_Entrada"
            name="fec_Entrada"
            type="date"
            value={formData.fec_Entrada}
            onChange={handleChange}
            className="border-[#218EED]/40 focus:border-[#218EED]"
            required
          />
        </div>
      </div>

      {/* Información del destino */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="destino" className="font-semibold">
            Destino *
          </Label>
          <Input
            id="destino"
            name="destino"
            placeholder="Ingrese el destino"
            value={formData.destino}
            onChange={handleChange}
            className="border-[#218EED]/40 focus:border-[#218EED]"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="direccion" className="font-semibold">
            Dirección
          </Label>
          <Input
            id="direccion"
            name="direccion"
            placeholder="Dirección del destino"
            value={formData.direccion}
            onChange={handleChange}
            className="border-[#218EED]/40 focus:border-[#218EED]"
          />
        </div>
      </div>

      {/* Alojamiento */}
      <div className="space-y-2">
        <Label htmlFor="alojamiento" className="font-semibold">
          Alojamiento o Cabaña
        </Label>
        <Input
          id="alojamiento"
          name="alojamiento"
          placeholder="Espeficique su Alojamiento o Cabaña"
          value={formData.alojamiento}
          onChange={handleChange}
          className="border-[#218EED]/40 focus:border-[#218EED]"
        />
      </div>

      {/* Configuraciones específicas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="font-semibold">Día de salida *</Label>
          <Select onValueChange={handleSelectDiaSalida} value={formData.dia_Salida}>
            <SelectTrigger className="border-[#218EED]/40 focus:border-[#218EED]">
              <SelectValue placeholder="Seleccionar día" />
            </SelectTrigger>
            <SelectContent>
              {diasSalida.map((dia) => (
                <SelectItem key={dia} value={dia}>
                  {dia}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="font-semibold">¿Pertenece a  SenaEmpresa? *</Label>
          <Select onValueChange={handleSelectSenEmpresa} value={formData.sen_Empresa}>
            <SelectTrigger className="border-[#218EED]/40 focus:border-[#218EED]">
              <SelectValue placeholder="Seleccionar opción" />
            </SelectTrigger>
            <SelectContent>
              {opcionesSenaEmpresa.map((opcion) => (
                <SelectItem key={opcion.value} value={opcion.value}>
                  {opcion.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Botón de envío */}
      <div className="pt-4">
        <Button
          type="submit"
          disabled={mutation.isPending}
          className="mt-4 bg-[#218EED] text-white hover:bg-[#1A7BD6] transition-colors duration-200 rounded-md mx-auto w-full flex items-center justify-center gap-2"
        >
          {mutation.isPending ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              Registrando...
            </>
          ) : (
            <>Registrar Permiso FS</>
          )}
        </Button>
      </div>

      {/* Footer institucional */}
      <div className="mt-0 border-t pt-4 text-center text-sm text-gray-500">
        <p>© 2025 Centro Agropecuario "La Granja" - SENA Espinal</p>
        <p className="italic">Desarrollado por aprendices SENA - ADS0</p>
      </div>
    </form>
  )
}
