"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import axiosInstance from "@/lib/axiosInstance"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useAuthUser } from "@/app/user/login/useCurrentUser"
import LoadingPage from "@/components/utils/LoadingPage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function RegisterPermission({ onSuccess }) {
  const { user, tip, isLoading, error } = useAuthUser()
  const queryClient = useQueryClient()
  const [TipApprentice, setTipApprentice] = useState("")
  const [step, setStep] = useState(user?.tip === "Administrador" ? 1 : 2) // Step 1: Apprentice info, Step 2: Permission form
  const [apprenticeExists, setApprenticeExists] = useState(false)
  const [isValidatingApprentice, setIsValidatingApprentice] = useState(false)

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
    apprenticeId: "", // Nuevo campo para administradores
    responsablesSeleccionados: {},
  })

  const [responsables, setResponsables] = useState({
    instructor: [],
    cordinador: [],
    Bienestar: [],
    internado: [],
  })

  const getConsult = {
    instructor: "/api/Responsible/GetResponsiblesByRole/roleid=1",
    cordinador: "/api/Responsible/GetResponsiblesByRole/roleid=2",
    Bienestar: "/api/Responsible/GetResponsiblesByRole/roleid=3",
    internado: "/api/Responsible/GetResponsiblesByRole/roleid=4",
  }

  const ordenRoles = (() => {
    if (!user) return []
    const roles = ["instructor", "cordinador", "Bienestar"]
    if (user.tip_Apprentice === "interno" || TipApprentice === "interno") {
      roles.push("internado")
    }
    return roles
  })()

  const tips = ["Interno", "Externo"]
  const motivos = ["Actualizacion de Datos", "Cita Medica", "Firma de Contrato de Aprendizaje", "Calamidad Familiar", "Diligencias Personales", "No Tiene Formacion"]

  const fetchResponsables = async () => {
    const roles = Object.keys(getConsult)
    for (const rol of roles) {
      const res = await axiosInstance.get(getConsult[rol])
      setResponsables((prev) => ({ ...prev, [rol]: res.data }))
    }
  }

  useEffect(() => {
    fetchResponsables()
  }, [])

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
          departureDate: formData.departureDate,
          entryDate: formData.entryDate,
          adress: formData.adress,
          destination: formData.destination,
          motive: formData.motive,
          observation: formData.observation,
          status: 0,
        },
        responsablesSeleccionados: Object.values(formData.responsablesSeleccionados),
      }

      if (tip === "Administrador") {
        // El aprendiz ya fue validado en el paso 1
        payload.apprenticeId = formData.apprenticeId
        const res = await axiosInstance.post(
          `/api/permission/CrearPermisoAdmi?idApprentice=${formData.apprenticeId}`,
          payload,
        )
        return res.data
      }

      const res = await axiosInstance.post("/api/permission/CrearPermiso", payload)
      return res.data
    },
    onSuccess: (data) => {
      toast.success(`${data.message}`)
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
        apprenticeId: "",
        responsablesSeleccionados: {},
      })
      setStep(tip === "Administrador" ? 1 : 2)
      setApprenticeExists(false)
      setTipApprentice("")

      if (onSuccess) onSuccess()
      queryClient.invalidateQueries(["permissions"])
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

  const handleResponsableSelect = (rol, value) => {
    const parsed = Number.parseInt(value)
    setFormData((prev) => ({
      ...prev,
      responsablesSeleccionados: {
        ...prev.responsablesSeleccionados,
        [rol]: parsed,
      },
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const departureDate = `${formData.departureDateOnly}T${formData.departureTimeOnly}`
    const entryDate = `${formData.entryDateOnly}T${formData.entryTimeOnly}`
    const fechaSalida = new Date(departureDate)
    const fechaEntrada = new Date(entryDate)
    const ahora = new Date()

    if (isNaN(fechaSalida.getTime()) || isNaN(fechaEntrada.getTime())) {
      toast.error("Las fechas no son válidas.")
      return
    }

    if (fechaSalida < ahora) {
      toast.error("La fecha y hora de salida no puede ser anterior al momento actual.")
      return
    }

    if (fechaEntrada <= fechaSalida) {
      toast.error("La fecha y hora de entrada debe ser posterior a la de salida.")
      return
    }

    // Determinar roles requeridos según el tipo de aprendiz
    const rolesRequeridos = ["instructor", "cordinador", "Bienestar"]
    if (user.tip_Apprentice === "interno" || TipApprentice === "interno") {
      rolesRequeridos.push("internado")
    }

    const faltanRoles = rolesRequeridos.filter((rol) => !formData.responsablesSeleccionados[rol])

    if (faltanRoles.length > 0) {
      toast.error(
        `Debes seleccionar responsables para: ${faltanRoles
          .map((r) => r.charAt(0).toUpperCase() + r.slice(1))
          .join(", ")}`,
      )
      return
    }

    setFormData((prev) => ({
      ...prev,
      departureDate,
      entryDate,
    }))

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
          <p className="font-semibold text-sm">Validación de Aprendiz</p>
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
                className="border-blue-300 focus:border-blue-500"
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
                <SelectTrigger className="w-full">
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
                {TipApprentice === "interno"
                  ? "Los aprendices internos requieren 4 autorizaciones (Instructor, Coordinador, Bienestar e Internado)."
                  : TipApprentice === "externo"
                    ? "Los aprendices externos requieren 3 autorizaciones (Instructor, Coordinador y Bienestar)."
                    : "Seleccione el tipo de aprendiz para continuar."}
              </p>
            </div>

            <Button
              onClick={validateApprentice}
              disabled={isValidatingApprentice}
              className="mt-4 bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 rounded-md mx-auto w-full flex items-center justify-center gap-2"
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

  // Paso 2: Formulario de permiso
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-6 space-y-6 bg-white border border-black rounded-2xl shadow"
    >
      {/* Encabezado institucional */}
      <div className="text-center border-b border-black pb-4 space-y-1">
        <img src="/assets/img/logoSena.png" alt="Logo SENA" className="mx-auto h-14" />
        <h2 className="text-xl font-bold uppercase">Centro Agropecuario "La Granja" SENA Espinal</h2>
        <p className="font-semibold text-sm">Solicitud de Permiso para Aprendices</p>
        <p className="text-xs font-medium italic">NOTA: El aprendiz sale del centro bajo su responsabilidad.</p>
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
          <Input type="date" name="entryDateOnly" value={formData.entryDateOnly} onChange={handleChange} required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="entryTimeOnly">Hora de entrada</Label>
          <Input type="time" name="entryTimeOnly" value={formData.entryTimeOnly} onChange={handleChange} required />
        </div>
      </div>

      {/* Información general */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="adress">Dirección</Label>
          <Input type="text" name="adress" value={formData.adress} onChange={handleChange} required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="destination">Destino</Label>
          <Input type="text" name="destination" value={formData.destination} onChange={handleChange} required />
        </div>
      </div>

      {/* Motivo y observación */}
      <div className="space-y-1">
        <Label htmlFor="motive">Motivo del permiso</Label>
        <Select
          name="motive"
          onValueChange={(value) => setFormData((prev) => ({ ...prev, motive: value }))}
          value={formData.motive}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecciona un motivo" />
          </SelectTrigger>
          <SelectContent>
            {motivos.map((motivo) => (
              <SelectItem key={motivo} value={motivo}>
                {motivo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
            const lista = responsables[rol]
            const isEnabled = index === 0 || Object.keys(formData.responsablesSeleccionados).length >= index

            return (
              <div key={rol} className="space-y-1">
                <Label className="capitalize">{rol}</Label>
                <Select onValueChange={(value) => handleResponsableSelect(rol, value)} disabled={!isEnabled}>
                  <SelectTrigger className={`w-full ${!isEnabled ? "opacity-50 cursor-not-allowed" : ""}`}>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {lista.map((r) => (
                      <SelectItem key={r.responsible_Id} value={r.responsible_Id.toString()}>
                        {r.nom_Responsible} {r.ape_Responsible}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )
          })}
        </div>
      </div>

      {/* Botón de envío */}
      <div className="pt-4">
        <Button
          type="submit"
          disabled={mutation.isPending}
          className="mt-4 bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 rounded-md mx-auto w-full flex items-center justify-center gap-2"
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
            <>Registrar Permiso</>
          )}
        </Button>
      </div>

      {/* Nota final */}
      <p className="text-xs italic text-center border-t pt-2 text-gray-600">
        Las firmas se deben recolectar en orden: Instructor → Coordinador → Bienestar → Internado (si aplica).
      </p>
      <div className="mt-0 border-t pt-4 text-center text-sm text-gray-500">
        <p>© 2025 Centro Agropecuario "La Granja" - SENA Espinal</p>
        <p className="italic">Desarrollado por aprendices SENA - ADS0</p>
      </div>
    </form>
  )
}
