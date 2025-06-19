"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AlertModal from "@/components/alert/AlertModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Value } from "@radix-ui/react-select";
import { Files } from "lucide-react";
import { toast } from "sonner";

const genders = ["Masculino", "Femenino", "Otro"];
const addressTypes = ["Barrio", "Vereda", "Corregimiento", "Comuna"];
const apprenticeTypes = ["Interno", "Externo"];
const statusOptions = ["Active", "Inactive"];
const documentstypes = ["TI", "CC"];

export default function UpdateApprentice({ id }) {
  const queryClient = useQueryClient();
  const [alert, setAlert] = useState({
    type: "", // "success", "error", "warning", "info"
    message: "",
    open: false,
  });
  const [formData, setFormData] = useState({
    first_name_apprentice: "",
    last_name_apprentice: "",
    birth_date_apprentice: new Date().toISOString(),
    gender_apprentice: "",
    email_apprentice: "",
    address_apprentice: "",
    address_type_apprentice: "",
    phone_Apprentice: "",
    status_Apprentice: "Active",
    tip_Apprentice: "",
    nom_responsible: "",
    ape_responsible: "",
    tel_responsible: "",
    email_responsible: "",
    stratum_Apprentice: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["apprentice", id],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/api/Apprentice/GetApprenticeByIdAdmi/${id}`
      );
      return res.data || {};
    },
    enabled: !!id,
  });
  useEffect(() => {
    if (data) {
      setFormData((prev) => ({
        ...prev,
        first_name_apprentice: data.first_Name_Apprentice || "",
        last_name_apprentice: data.last_Name_Apprentice || "",
        birth_date_apprentice: data.birth_Date_Apprentice_Formatted
          ? new Date(data.birth_Date_Apprentice_Formatted).toISOString()
          : new Date().toISOString(),
        gender_apprentice: data.gender_Apprentice || "",
        email_apprentice: data.email_Apprentice || "",
        address_apprentice: data.address_Apprentice || "",
        address_type_apprentice: data.address_Type_Apprentice || "",
        phone_Apprentice: data.phone_Apprentice || "",
        status_Apprentice: data.status_Apprentice || "Active",
        tip_Apprentice: data.tip_Apprentice || "",
        nom_responsible: data.nom_responsible || "",
        ape_responsible: data.ape_responsible || "",
        tel_responsible: data.tel_responsible || "",
        email_responsible: data.email_responsible || "",
        stratum_Apprentice: data.stratum_apprentice || "",
      }));
    }
  }, [data]);

  const mutation = useMutation({
  mutationFn: async () => {
    if (!formData.first_name_apprentice || !formData.email_apprentice) {
      toast.error("Por favor completa todos los campos obligatorios.")
      return; // <- Importante para no continuar si faltan campos
    }

    await axiosInstance.put(`/api/Apprentice/UpdateApprentice/${id}`, formData);
  },
  onSuccess: () => {
    toast.info("Aprendiz actualizado correctamente.");
    queryClient.invalidateQueries(["apprentice", id]);
  },
  onError: () => {
    toast.error("Error al actualizar aprendiz.");
  },
});

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
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  if (isLoading) return <p>Cargando datos del aprendiz...</p>;
  return (
    <div className="p-4">
      <AlertModal
        isOpen={alert.open}
        onClose={() => setAlert((prev) => ({ ...prev, open: false }))}
        type={alert.type}
        message={alert.message}
        autoCloseInMs={3000}
      />
      <form onSubmit={handleSubmit} className="space-y-4 p-4 ">
        <Label>Nombre</Label>
        <Input
          name="first_name_apprentice"
          value={formData.first_name_apprentice}
          onChange={handleChange}
          required
        />
        <Label>Apellido</Label>
        <Input
          name="last_name_apprentice"
          value={formData.last_name_apprentice}
          onChange={handleChange}
          required
        />

        <Label>Tipo de Documento</Label>
        <Select
          value={formData.tip_document}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, tip_document: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder={data.tip_document} />
          </SelectTrigger>
          <SelectContent>
            {documentstypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Label>Email</Label>
        <Input
          name="email_apprentice"
          value={formData.email_apprentice}
          onChange={(e) => {
            const value = e.target.value;
            // Permitir escribir siempre
            setFormData({ ...formData, email_apprentice: value });
          }}
          // required
        />
        {/* Validación en tiempo real (opcional): */}
        {!/^[^\s@]+@[^\s@]+\.com$/.test(formData.email_apprentice || "") &&
          formData.email_apprentice && (
            <p style={{ color: "red" }}>
              Correo inválido: debe contener @ y terminar en .com
            </p>
          )}

        <Label>Fecha de nacimiento</Label>
        <Input
          type="date"
          name="birth_date_apprentice"
          value={formData.birth_date_apprentice.split("T")[0]}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              birth_date_apprentice: new Date(e.target.value).toISOString(),
            }))
          }
          // required
        />

        <Select
          value={formData.gender_apprentice}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, gender_apprentice: value }))
          }
        >
          <SelectTrigger>
            <SelectValue
              placeholder={data?.gender_Apprentice || "Selecciona género"}
            />
          </SelectTrigger>
          <SelectContent>
            {genders.map((gender) => (
              <SelectItem key={gender} value={gender}>
                {gender}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Label>Dirección</Label>
        <Input
          name="address_apprentice"
          value={formData.address_apprentice}
          onChange={handleChange}
        />

        <Label>Tipo de Dirección</Label>
        <Select
          value={formData.address_type_apprentice}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, address_type_apprentice: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder={data.address_Type_Apprentice} />
          </SelectTrigger>
          <SelectContent>
            {addressTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Label>Teléfono</Label>
        <Input
          name="phone_Apprentice"
          value={formData.phone_Apprentice}
          onChange={(e) => {
            const value = e.target.value;
            // Permitir solo números
            if (/^\d*$/.test(value)) {
              setFormData({ ...formData, phone_Apprentice: value });
            }
          }}
          // required
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

        <Label>Grupo SISBÉN</Label>
        <Select
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, stratum_Apprentice: value }))
          }
          value={formData.stratum_Apprentice}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={data.stratum_Apprentice} />
          </SelectTrigger>
          <SelectContent>
            {/* Grupo A */}
            <SelectItem value="A1">A1</SelectItem>
            <SelectItem value="A2">A2</SelectItem>
            <SelectItem value="A3">A3</SelectItem>
            <SelectItem value="A4">A4</SelectItem>
            <SelectItem value="A5">A5</SelectItem>

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

        <Label>Tipo de Aprendiz</Label>
        <Select
          value={formData.tip_Apprentice}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, tip_Apprentice: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder={data.tip_Apprentice} />
          </SelectTrigger>
          <SelectContent>
            {apprenticeTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Label>Nombre Responsable</Label>
        <Input
          name="nom_responsible"
          value={formData.nom_responsible}
          onChange={handleChange}
        />

        <Label>Apellido Responsable</Label>
        <Input
          name="ape_responsible"
          value={formData.ape_responsible}
          onChange={handleChange}
        />

        <Label>Teléfono Responsable</Label>
        <Input
          name="tel_responsible"
          value={formData.tel_responsible}
          onChange={(e) => {
            const value = e.target.value;
            // Permitir solo números
            if (/^\d*$/.test(value)) {
              setFormData({ ...formData, tel_responsible: value });
            }
          }}
          // required
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

        <Label>Email Responsable</Label>
        <Input
          name="email_responsible"
          value={formData.email_responsible}
          onChange={(e) => {
            const value = e.target.value;
            // Permitir escribir siempre
            setFormData({ ...formData, email_responsible: value });
          }}
          // required
        />
        {/* Validación en tiempo real (opcional): */}
        {!/^[^\s@]+@[^\s@]+\.com$/.test(formData.email_responsible || "") &&
          formData.email_responsible && (
            <p style={{ color: "red" }}>
              Correo inválido: debe contener @ y terminar en .com
            </p>
          )}

        <Label>Departamento</Label>
        <Select
          value={id_department?.toString() || ""}
          onValueChange={(value) => {
            setDepartmentId(parseInt(value));
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder={data.departmentName} />
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

        <p className="text-yellow-600 text-sm mt-1">
          Para poder editar el municipio, debe editar el departamento, incluso
          si es el mismo.
        </p>

        <Label>Municipio</Label>
        <Select
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, id_municipality: Number(value) }))
          }
          value={
            formData.id_municipality ? formData.id_municipality.toString() : ""
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={data.municipalityName} />
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

        <Label>Ficha</Label>
        <Select
          value={formData.file_Id?.toString() || ""}
          onValueChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              file_Id: parseInt(value),
            }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder={data.file_Id || "Selecciona una ficha"} />
          </SelectTrigger>
          <SelectContent>
            {files.map((file) => (
              <SelectItem key={file.file_Id} value={file.file_Id.toString()}>
                {file.file_Id}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
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
      </form>
    </div>
  );
}
