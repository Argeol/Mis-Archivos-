"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"
import axiosInstance from "@/lib/axiosInstance"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useAuthUser } from "@/app/user/login/useCurrentUser"
import LoadingPage from "@/components/utils/LoadingPage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function RegisterPermissionFS({ onSuccess }) {
  const { user, tip, isLoading, error } = useAuthUser()
  const queryClient = useQueryClient()
  const [TipApprentice, setTipApprentice] = useState("")
  const [step, setStep] = useState(tip === "Administrador" ? 1 : 2)
  const [apprenticeExists, setApprenticeExists] = useState(false)
  const [isValidatingApprentice, setIsValidatingApprentice] = useState(false)

  const [formData, setFormData] = useState({
    destino: "",
    fec_Salida: "",
    fec_Entrada: "",
    dia_Salida: "",
    alojamiento: "",
    sen_Empresa: "",
    direccion: "",
    apprenticeId: "", // Nuevo campo para administradores
  })

  const tips = ["Interno", "Externo"]
  const diasSalida = ["Miércoles", "Domingo", "Fin de semana"]
  const opcionesSenaEmpresa = [
    { value: "Si", label: "Sí" },
    { value: "No", label: "No" },
  ]

  const validateApprentice = async () => {
    if (!formData.apprenticeId.trim() || !TipApprentice) {
      toast.error("Debes ingresar la cédula y seleccionar el tipo de aprendiz.")
      return
    }

    setIsValidatingApprentice(true)
    try {
      const response = await axiosInstance.get(`api/Apprentice/existApprentice/${formData.apprenticeId}`)

      if (response.data.existe) {
        setApprenticeExists(true)
        setStep(2)
        toast.success("Aprendiz verificado correctamente.")
      } else {
        toast.error("El aprendiz no existe en el sistema.")
        setApprenticeExists(false)
      }
    } catch (error) {
      toast.error("Error al verificar el aprendiz: " + error.message)
    } finally {
      setIsValidatingApprentice(false)
    }
  }

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        permission: {
          destino: formData.destino,
          fec_Salida: formData.fec_Salida,
          fec_Entrada: formData.fec_Entrada,
          dia_Salida: formData.dia_Salida,
          alojamiento: formData.alojamiento,
          sen_Empresa: formData.sen_Empresa,
          direccion: formData.direccion,
        },
      }

      if (tip === "Administrador") {
        // El aprendiz ya fue validado en el paso 1
        payload.apprenticeId = formData.apprenticeId
        const res = await axiosInstance.post("/api/PermissionFS/CreateByAdmin", payload)
        return res.data
      }

      const res = await axiosInstance.post("/api/PermissionFS/Create", payload)
      return res.data
    },
    onSuccess: (data) => {
      toast.success(`${data.message || "Permiso FS registrado exitosamente"}`)
      setFormData({
        destino: "",
        fec_Salida: "",
        fec_Entrada: "",
        dia_Salida: "",
        alojamiento: "",
        sen_Empresa: "",
        direccion: "",
        apprenticeId: "",
      })
      setStep(tip === "Administrador" ? 1 : 2)
      setApprenticeExists(false)
      setTipApprentice("")

      if (onSuccess) onSuccess()
      queryClient.invalidateQueries(["permissionsfs"])
    },
    onError: (error) => {
      const msg = error.response?.data?.message || error.response?.data?.error || error.message
      toast.error(msg)
    },
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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
      toast.error("Las fechas de salida y entrada son obligatorias.")
      return
    }

    const fechaSalida = new Date(formData.fec_Salida)
    const fechaEntrada = new Date(formData.fec_Entrada)

    // Crear una nueva fecha para hoy sin modificar las originales
    const hoy = new Date()
    const fechaHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
    const fechaSalidaSoloFecha = new Date(fechaSalida.getFullYear(), fechaSalida.getMonth(), fechaSalida.getDate())
    const fechaEntradaSoloFecha = new Date(fechaEntrada.getFullYear(), fechaEntrada.getMonth(), fechaEntrada.getDate())

    if (isNaN(fechaSalida.getTime()) || isNaN(fechaEntrada.getTime())) {
      toast.error("Las fechas no son válidas.")
      return
    }

    if (fechaSalidaSoloFecha < fechaHoy) {
      toast.error("La fecha de salida no puede ser anterior a la fecha actual.")
      return
    }

    if (fechaEntradaSoloFecha <= fechaSalidaSoloFecha) {
      toast.error("La fecha de entrada debe ser posterior a la de salida.")
      return
    }

    mutation.mutate()
  }

  if (isLoading) return <LoadingPage />
  if (error) return <div>Error al cargar usuario: {error.message}</div>
  if (!user) return <div>No se encontró información del usuario</div>

  // Paso 1: Validación de aprendiz para administradores
  if (tip === "Administrador" && step === 1) {
    return (
      <Card className="max-w-md mx-auto p-6 bg-white border border-black rounded-2xl shadow">
        <CardHeader className="text-center border-b border-black pb-4">
          <img src="/assets/img/logoSena.png" alt="Logo SENA" className="mx-auto h-14" />
          <CardTitle className="text-xl font-bold uppercase">Centro Agropecuario "La Granja" SENA Espinal</CardTitle>
          <p className="font-semibold text-sm">Validación de Aprendiz - Permiso FS</p>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apprenticeId" className="font-semibold">
                Cédula del Aprendiz *
              </Label>
              <Input
                type="text"
                name="apprenticeId"
                value={formData.apprenticeId}
                onChange={handleChange}
                placeholder="Ingrese la cédula del aprendiz"
                className="border-[#218EED]/40 focus:border-[#218EED]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipApprentice" className="font-semibold">
                Tipo de Aprendiz *
              </Label>
              <Select
                onValueChange={(value) => setTipApprentice(value.toLowerCase())}
                value={TipApprentice ? TipApprentice.charAt(0).toUpperCase() + TipApprentice.slice(1) : ""}
              >
                <SelectTrigger className="w-full border-[#218EED]/40 focus:border-[#218EED]">
                  <SelectValue placeholder="Selecciona tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tips.map((tip) => (
                    <SelectItem key={tip} value={tip}>
                      {tip}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-600 mt-1">
                Seleccione el tipo de aprendiz para continuar con el registro del permiso FS.
              </p>
            </div>

            <Button
              onClick={validateApprentice}
              disabled={isValidatingApprentice}
              className="mt-4 bg-[#218EED] text-white hover:bg-[#1A7BD6] transition-colors duration-200 rounded-md mx-auto w-full flex items-center justify-center gap-2"
            >
              {isValidatingApprentice ? (
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
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  Verificando...
                </>
              ) : (
                <>Continuar</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Paso 2: Formulario de permiso FS
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

      {/* Información del aprendiz (solo para administradores) */}
      {tip === "Administrador" && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">
                Aprendiz: <span className="font-normal">{formData.apprenticeId}</span>
              </p>
              <p className="font-semibold">
                Tipo: <span className="font-normal capitalize">{TipApprentice}</span>
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setStep(1)
                setApprenticeExists(false)
              }}
              className="text-sm"
            >
              Cambiar aprendiz
            </Button>
          </div>
        </div>
      )}

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
          placeholder="Especifique su Alojamiento o Cabaña"
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
          <Label className="font-semibold">¿Pertenece a SenaEmpresa? *</Label>
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
