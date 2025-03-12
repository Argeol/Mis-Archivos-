"use client";
import axiosInstance from "@/lib/axiosInstance";
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import TextFieldsIcon from '@mui/icons-material/TextFields';
import CategoryIcon from '@mui/icons-material/Category';
import LocationOnIcon from '@mui/icons-material/LocationOn';

function RegisterLocality() {
  const [formData, setFormData] = useState({
    Nom_Locality: "",
    Tip_Locality: "",
    Id_Department: "",
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
        "api/Locality/CreateLocality",
        formData
      );
      if (response.status === 200) {
        alert("Localidad creada con éxito");
      }
    } catch (error) {
      alert("Hubo un error <-");
    }
  }

  const handleChange = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Formulario enviado con datos:", formData);
    }
  };

  return (
    <>
      <main className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
        <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
          <form
            className="shadow-2xl bg-white p-8 rounded-lg w-full max-w-md"
            onSubmit={handleSubmit}
          >
            <h3 className="text-xl font-serif text-center mb-6">
              Registrar Localidad
            </h3>

            <TextField
              label="Nombre"
              id="Nom_Locality"
              name="Nom_Locality"
              value={formData.Nom_Locality}
              onChange={handleChange}
              placeholder="Nombre de Localidad"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TextFieldsIcon/>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              className="mb-4"
            />

            <TextField
              label="Tipo"
              id="Tip_Locality"
              name="Tip_Locality"
              value={formData.Tip_Locality}
              onChange={handleChange}
              placeholder="Tipo de Localidad"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CategoryIcon/>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              className="mb-4"
            />

            <TextField
              label="Departamento"
              id="Id_Department"
              name="Id_Department"
              value={formData.Id_Department}
              onChange={handleChange}
              placeholder="Código de Departamento"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon/>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              className="mb-4"
            />

            <button
              type="submit"
              className="w-full mt-6 bg-black text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-sky-600"
            >
              Registrar
            </button>
          </form>
        </div>
      </main>
    </>
  );
}

export default RegisterLocality;
