"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { data } from "react-router-dom";

const genders = ["Masculino", "Femenino", "Otro"];
const addressTypes = ["Barrio", "Vereda", "Corregimiento", "Comuna"];
const tips = ["Interno", "Externo"];
const documentstypes = ["TI", "CC"];

export default function RegisterApprentice({ onSuccess }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    id_Apprentice: "",
    first_Name_Apprentice: "",
    last_Name_Apprentice: "",
    birth_Date_Apprentice: "",
    gender_Apprentice: "",
    email_Apprentice: "",
    address_Apprentice: "",
    address_Type_Apprentice: "",
    phone_Apprentice: "",
    status_Apprentice: "Activo",
    permission_Count_Apprentice: 0,
    tip_Apprentice: "",
    file_id: 0,
    Id_municipality: 0,
    nom_responsible: "",
    ape_responsible: "",
    tel_responsible: "",
    email_responsible: "",
    stratum_Apprentice: "",
  });
  const [step, setStep] = useState(1);
  const [program_Id, setProgramId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/Department");
      return res.data;
    },
  });

  const [id_department, setDepartmentId] = useState(null);

  const { data: files = [] } = useQuery({
    queryKey: ["files"],
    queryFn: async () => {
      const res = await axiosInstance.get("/Api/File/GetFiles");
      return res.data;
    },
  })


  const { data: municipalities = [] } = useQuery({
    queryKey: ["municipalities", id_department],
    queryFn: async () => {
      if (!id_department) return [];
      const res = await axiosInstance.get(
        `/api/Municipality/byDepartment/${id_department}`
      );
      return res.data;
    },
    enabled: !!id_department,
  });


  const { data: program = [] } = useQuery({
    queryKey: ["program"],
    queryFn: async () => {
      const res = await axiosInstance.get("/Api/Program/GetProgram");
      return res.data;
    },
  });


  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post("/api/Apprentice", formData);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(`${data.message}\n${data.detalle}`);
      setIsModalOpen(false);
      if (onSuccess) onSuccess(); // Ejecuta callback externo si existe
      queryClient.invalidateQueries(["apprentices"]);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Error desconocido.";

      toast(errorMessage); // Mostrar el mensaje de error
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDepartmentChange = (value) => {
    const departmentId = parseInt(value);
    setDepartmentId(departmentId);
    setFormData((prev) => ({ ...prev, Id_municipality: 0 }));
  };

  const handleprogramChange = (value) => {
    const program_Id = parseInt(value);
    setProgramId(program_Id);
    setFormData((prev) => ({ ...prev, file_Id: 0 }));
  };

  const validateStep = (currentStep) => {
    setErrorMessage("");
    if (currentStep === 1) {
      if (
        !formData.id_Apprentice ||
        formData.id_Apprentice.length < 10 ||
        !formData.first_Name_Apprentice.trim() ||
        !formData.last_Name_Apprentice.trim() ||
        !formData.birth_Date_Apprentice ||
        !formData.email_Apprentice.trim() ||
        !formData.phone_Apprentice.trim() ||
        !formData.gender_Apprentice
      ) {
        setErrorMessage("Por favor completa todos los campos obligatorios del paso 1 correctamente.");
        return false;
      }
    }
    if (currentStep === 2) {
      if (
        !formData.address_Type_Apprentice ||
        !formData.address_Apprentice.trim() ||
        !formData.tip_Apprentice ||
        !id_department ||
        !formData.Id_municipality === 0
      ) {
        setErrorMessage("Por favor completa todos los campos obligatorios del paso 2.");
        return false;
      }
    }
    if (currentStep === 3) {
      if (!formData.program_Id || !formData.file_Id) {
        setErrorMessage("Por favor selecciona Programa y Ficha en el paso 3.");
        return false;
      }
    }
    if (currentStep === 4) {
      if (
        !formData.nom_responsible.trim() ||
        !formData.ape_responsible.trim() ||
        !formData.tel_responsible.trim()
      ) {
        setErrorMessage("Por favor completa todos los campos obligatorios del paso 4.");
        return false;
      }
    }
    setErrorMessage("");
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Limpiar campos que pueden ir nulos
    if (formData.email_responsible?.trim() === "") {
      formData.email_responsible = null;
    }

    if (
      typeof formData.stratum_Apprentice !== "string" ||
      formData.stratum_Apprentice.trim() === ""
    ) {
      formData.stratum_Apprentice = null;
    }

    if (validateStep(step)) {
      mutation.mutate();
    }
  };


  return (
    <>
      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && step < 4) {
            e.preventDefault(); // evita enviar el form por accidente
            if (validateStep(step)) {
              setStep(step + 1);
            }
          }
        }}
        className="p-4 rounded-2xl bg-white space-y-6"
      >
        {/* Paso 1 · Datos personales */}
        {step === 1 && (
          <>
            <h2 className="text-lg font-semibold">Paso 1: Datos personales</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <Label>Tipo de Documento</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, tip_document: value }))
                  }
                  value={formData.tip_document}
                  placeholder="Selecciona tipo"
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentstypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Documento */}
              <div>
                <Label>Documento</Label>
                <Input
                  name="id_Apprentice"
                  value={formData.id_Apprentice}
                  placeholder="Documento"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      setFormData({ ...formData, id_Apprentice: value });
                    }
                  }}
                  min="0"
                  required
                />
                {formData.id_Apprentice.length > 0 &&
                  formData.id_Apprentice.length < 8 && (
                    <p className="text-yellow-600 text-sm mt-1">
                      Debe tener al menos 8 dígitos.
                    </p>
                  )}
                {formData.id_Apprentice.length > 10 && (
                  <p className="text-red-600 text-sm mt-1">
                    No puede tener más de 10 dígitos.
                  </p>
                )}
              </div>

              {/* Nombre */}
              <div>
                <Label>Nombre</Label>
                <Input
                  name="first_Name_Apprentice"
                  placeholder="Nombre"
                  onChange={handleChange}
                  value={formData.first_Name_Apprentice || ""}
                  required
                />
              </div>

              {/* Apellido */}
              <div>
                <Label>Apellido</Label>
                <Input
                  name="last_Name_Apprentice"
                  placeholder="Apellido"
                  onChange={handleChange}
                  value={formData.last_Name_Apprentice || ""}
                  required
                />
              </div>

              {/* Fecha de nacimiento */}
              <div>
                <Label>Fecha de Nacimiento</Label>
                <Input
                  name="birth_Date_Apprentice"
                  type="date"
                  value={formData.birth_Date_Apprentice || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Correo */}
              <div>
                <Label>Correo</Label>
                <Input
                  name="email_Apprentice"
                  type="email"
                  value={formData.email_Apprentice || ""}
                  placeholder="Correo"
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({ ...formData, email_Apprentice: value });
                  }}
                  required
                />
                {/* Validación en tiempo real */}
                {!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_Apprentice || "") &&
                  formData.email_Apprentice && (
                    <p style={{ color: "red" }}>
                      Correo inválido: debe tener el formato usuario@dominio.extensión
                    </p>
                  )}
              </div>

              {/* Teléfono */}
              <div>
                <Label>Teléfono</Label>
                <Input
                  name="phone_Apprentice"
                  value={formData.phone_Apprentice || ""}
                  placeholder="Teléfono"
                  onChange={(e) => {
                    const value = e.target.value;
                    // Permitir solo números
                    if (/^\d*$/.test(value)) {
                      setFormData({ ...formData, phone_Apprentice: value });
                    }
                  }}
                  required
                />
                {/* Validación del largo del teléfono */}
                {formData.phone_Apprentice.length > 0 &&
                  formData.phone_Apprentice.length < 10 && (
                    <p className="text-yellow-600 text-sm mt-1">
                      Debe tener al menos 10 dígitos.
                    </p>
                  )}
                {formData.phone_Apprentice.length > 10 && (
                  <p className="text-red-600 text-sm mt-1">
                    No puede tener más de 10 dígitos.
                  </p>
                )}
              </div>

              {/* Grupo SISBÉN */}
              <div>
                <Label>Grupo SISBÉN</Label>
                <Select
                  value={formData.stratum_Apprentice ?? ""}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      stratum_Apprentice: value,
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona tu grupo SISBÉN" />
                  </SelectTrigger>

                  <SelectContent>
                    {/* Grupo A */}
                    {["A1", "A2", "A3", "A4", "A5"].map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}

                    {/* Grupo B */}
                    {[...Array(7)].map((_, i) => (
                      <SelectItem key={`B${i + 1}`} value={`B${i + 1}`}>
                        B{i + 1}
                      </SelectItem>
                    ))}

                    {/* Grupo C */}
                    {[...Array(18)].map((_, i) => (
                      <SelectItem key={`C${i + 1}`} value={`C${i + 1}`}>
                        C{i + 1}
                      </SelectItem>
                    ))}

                    {/* Grupo D */}
                    {[...Array(21)].map((_, i) => (
                      <SelectItem key={`D${i + 1}`} value={`D${i + 1}`}>
                        D{i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Género */}
              <div>
                <Label>Género</Label>
                <Select
                  value={formData.gender_Apprentice}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, gender_Apprentice: value }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona género" />
                  </SelectTrigger>

                  <SelectContent>
                    {genders.map((gender) => (
                      <SelectItem key={gender} value={gender}>
                        {gender}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )}

        {/* Paso 2 · Datos personales */}
        {step === 2 && (
          <>
            <h2 className="text-lg font-semibold">Paso 2: Dirección y ubicación</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Departamento</Label>
                <Select
                  value={id_department?.toString() || ""}
                  onValueChange={(value) => {
                    setDepartmentId(parseInt(value));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar Departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem
                        key={dept.id_department}
                        value={dept.id_department.toString()}
                      >
                        {dept.name_department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Municipio</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, id_municipality: Number(value) }))
                  }
                  value={formData.id_municipality ? formData.id_municipality.toString() : ""}
                  placeholder="Selecciona municipio"
                  disabled={!id_department}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona Municipio" />
                  </SelectTrigger>
                  <SelectContent>
                    {municipalities.map((m) => (
                      <SelectItem
                        key={m.id_municipality}
                        value={m.id_municipality.toString()}
                      >
                        {m.municipality}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Tipo de dirección</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, address_Type_Apprentice: value }))
                  }
                  value={formData.address_Type_Apprentice}
                  placeholder="Selecciona tipo"
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {addressTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Dirección</Label>
                <Input
                  name="address_Apprentice"
                  placeholder="Dirección"
                  onChange={handleChange}
                  value={formData.address_Apprentice || ""}
                />
              </div>

              <div>
                <Label>Tipo de aprendiz</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, tip_Apprentice: value }))
                  }
                  value={formData.tip_Apprentice}
                  placeholder="Selecciona tipo"
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
              </div>
            </div>
          </>
        )}

        {/* Paso 3: Programa y ficha */}
        {step === 3 && (
          <>
            <h2 className="text-lg font-semibold">Paso 3: Programa y ficha</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Programa</Label>
                <Select
                  onValueChange={(value) => {
                    setFormData((prev) => ({ ...prev, program_Id: Number(value) }));
                  }}
                  value={formData.program_Id ? formData.program_Id.toString() : ""}
                  placeholder="Selecciona programa"
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona Programa" />
                  </SelectTrigger>
                  <SelectContent>
                    {program.map((p) => (
                      <SelectItem key={p.program_Id} value={p.program_Id.toString()}>
                        {p.program_Name} - {p.area_Name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Ficha</Label>
                <Select
                  value={formData.file_Id?.toString() || ""}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      file_Id: parseInt(value),
                    }))
                  }
                  disabled={!formData.program_Id} // Evita seleccionar ficha si aún no se eligió programa
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una ficha" />
                  </SelectTrigger>
                  <SelectContent>
                    {files
                      .filter((file) => file.program_Id === formData.program_Id)
                      .map((file) => (
                        <SelectItem key={file.file_Id} value={file.file_Id.toString()}>
                          {file.file_Id}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )}

        {/* Paso 4: Responsable */}
        {step === 4 && (
          <>
            <h2 className="text-lg font-semibold">Paso 4: Responsable</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Nombre responsable</Label>
                <Input
                  name="nom_responsible"
                  placeholder="Nombre responsable"
                  onChange={handleChange}
                  value={formData.nom_responsible || ""}
                />
              </div>
              <div>
                <Label>Apellido responsable</Label>
                <Input
                  name="ape_responsible"
                  placeholder="Apellido responsable"
                  onChange={handleChange}
                  value={formData.ape_responsible || ""}
                />
              </div>
              <div>
                <Label>Teléfono responsable</Label>
                <Input
                  name="tel_responsible"
                  value={formData.tel_responsible || ""}
                  placeholder="Teléfono responsable"
                  onChange={(e) => {
                    const value = e.target.value;
                    // Permitir solo números
                    if (/^\d*$/.test(value)) {
                      setFormData({ ...formData, tel_responsible: value });
                    }
                  }}
                  required
                />
                {/* Validación del largo del teléfono */}
                {formData.tel_responsible && formData.tel_responsible.length < 10 && (
                  <p className="text-yellow-600 text-sm mt-1">
                    Debe tener al menos 10 dígitos.
                  </p>
                )}
                {formData.tel_responsible && formData.tel_responsible.length > 10 && (
                  <p className="text-red-600 text-sm mt-1">
                    No puede tener más de 10 dígitos.
                  </p>
                )}
              </div>
              <div>
                <Label>Correo responsable</Label>
                <Input
                  name="email_responsible"
                  type="email"
                  placeholder="Correo responsable"
                  value={formData.email_responsible || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({ ...formData, email_responsible: value === "" ? null : value });
                  }}
                />
                {formData.email_responsible?.trim() !== "" &&
                  typeof formData.email_responsible === "string" &&
                  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_responsible) && (
                    <p style={{ color: "red" }}>
                      Correo inválido: debe tener el formato usuario@dominio.extensión
                    </p>
                  )}
              </div>
            </div>
          </>
        )}

        <div className="flex justify-between items-center mt-4">
          {step > 1 && (
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setErrorMessage("");
                setStep(step - 1);
              }}
            >
              Anterior
            </Button>
          )}

          {step < 4 && (
            <Button type="button" onClick={handleNextStep}>
              Siguiente
            </Button>
          )}

          {step === 4 && (
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="mt-[-1px] bg-blue-500 text-white text-sm px-4 py-1 hover:bg-blue-600 transition-colors duration-200 rounded-sm flex items-center justify-center gap-2"

            >
              {mutation.isPending ? (
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
                <>Registrar</>
              )}
            </Button>

          )}
        </div>

        {/* Mensaje de error de validación */}
        {errorMessage && (
          <p className="text-red-600 text-center mt-2 font-semibold">{errorMessage}</p>
        )}
      </form >
    </>
  );
}
