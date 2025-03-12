"use client";
import axiosInstance from "@/lib/axiosInstance";
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { FaIdCard, FaUser } from "react-icons/fa";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import MenuItem from "@mui/material/MenuItem";

function RegisterResposible() {
  const [formData, setFormData] = useState({
    Nom_Responsible: "",
    Ape_Responsible: "",
    Tel_Responsible: "",
    Tip_Responsible: "",
  });

  const [errors, setErrors] = useState({});

  //   const handleChange = (e) => {
  //     const { name, value } = e.target;
  //     setFormData({ ...formData, [name]: value });
  //   };

  //   const validate = () => {
  //     const newErrors = {};
  //     if (!formData.Nom_Locality) {
  //       newErrors.Nom_Locality = "El campo Nombre de la Localidad es requerido.";
  //     } else if (formData.Nom_Locality.length > 50) {
  //       newErrors.Nom_Locality =
  //         "El campo Nombre de la Localidad tiene un límite de 50 caracteres.";
  //     }

  //     if (!formData.Tip_Locality) {
  //       newErrors.Tip_Locality = "El campo Tipo de Localidad es requerido.";
  //     } else if (formData.Tip_Locality.length > 30) {
  //       newErrors.Tip_Locality =
  //         "El campo Tipo de Localidad tiene un límite de 30 caracteres.";
  //     }

  //     if (!formData.Id_Department) {
  //       newErrors.Id_Department = "El campo Departamento es requerido.";
  //     }

  //     setErrors(newErrors);
  //     return Object.keys(newErrors).length === 0;
  //   };
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        "api/Responsible/CreateResponsible",
        formData
      );
      if (response.status === 200) {
        alert("Responsable creado con éxito");
      }
    } catch (error) {
      alert("Hubo un error ");
    }
  }

  const handleChange = (e) => {
    setFormData({ ...FormData, [e.target.name]: e.target.value });
  };
  return (
    <>
      <main className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-2xl space-y-6">
          <h2 className="text-xl font-serif text-center text-gray-800">
            Registrar Responsable
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextField
                label="Nombre"
                id="Nom_Locality"
                name="Nom_Locality"
                value={formData.Nom_Locality}
                onChange={handleChange}
                placeholder="Nombre"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaUser />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />
              <TextField
                label="Apellido"
                id="Ape_Responsible"
                name="Ape_Responsible"
                value={formData.Ape_Responsible}
                onChange={handleChange}
                placeholder="Apellido Responsable"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaUser />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />
              <TextField
                label="Código de Departamento"
                id="Cod_Departamento"
                name="Cod_Departamento"
                value={formData.Cod_Departamento}
                onChange={handleChange}
                placeholder="Código de Departamento"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaIdCard />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />
              <TextField
                label="Tipo de Responsable"
                select
                id="Tip_Responsible"
                name="Tip_Responsible"
                value={formData.Tip_Responsible}
                onChange={handleChange}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PermIdentityIcon />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                className="mb-4"
                required
                SelectProps={{
                  displayEmpty: true,
                }}
                error={!!errors.Tip_Responsible}
                helperText={errors.Tip_Responsible}
              >
                <MenuItem value="" disabled>
                  <em className="text-gray-300">Seleccione una Opción</em>
                </MenuItem>
                <MenuItem value="interno">Instructor</MenuItem>
                <MenuItem value="externo">Coordiinador</MenuItem>
                <MenuItem value="externo">Encargado Internado</MenuItem>
                <MenuItem value="externo">Encargado Bienestar</MenuItem>
              </TextField>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full  bg-black text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-sky-600"
              >
                Enviar
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}

export default RegisterResposible;
