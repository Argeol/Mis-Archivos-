"use client";
import axiosInstance from "@/lib/axiosInstance";
import React, { useState } from "react";

const ReasonForm = () => {
  const [formData, setFormData] = useState({
    Tip_Reason: "",
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
        "api/Reason/CreateReason",
        formData
      );
      if (response.status === 200) {
        alert("Motivo creado con éxito");
      }
    } catch (error) {
      alert("Hubo un error <-");
    }
  }

  //   const handleSubmit = (e) => {
  //     e.preventDefault();
  //     if (validate()) {
  //       console.log("Formulario enviado con datos:", formData);
  //     }
  //   };

  return (
    <>
      <form
        className="max-w-md mx-auto  mt-40 bg-white shadow-md rounded-lg"
        onSubmit={handleSubmit}
      >
       
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="Tip_Reason"
          >
            Tipo de Motivo:
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            name="Tip_Reason"
            id="Tip_Reason"
            value={formData.Tip_Reason}
            onChange={(e) =>
              setFormData({ ...formData, Tip_Reason: e.target.value })
            }
          />
          {errors.Tip_Reason && (
            <span className="text-red-500 text-sm">{errors.Tip_Reason}</span>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-200"
        >
          Enviar
        </button>
      </form>
    </>
  );
};

export default ReasonForm;

