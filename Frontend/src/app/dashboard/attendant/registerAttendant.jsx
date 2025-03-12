"use client";

import axiosInstance from "@/lib/axiosInstance";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import CakeIcon from "@mui/icons-material/Cake";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
// import { formatDate } from "date-fns";

function RegisterAttendant() {
  const [formData, setFormData] = useState({
    attendant_Name: "",
    attendant_Surname: "",
    attendant_Phone: "",
    attendant_Address: "",
    attendant_Email: "",
  });
  async function handlerSubmit(e) {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("api/Attendant/CreateAttendant",formData);
      if (response.status === 200) {
        alert(response.data.message);
      }
    } catch (error) {
      console.error(error);
      // alert(error.response.data.message);
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="flex items-center justify-center min-h-screen -mt-14">
      <form
        onSubmit={handlerSubmit}
        className="shadow-2xl bg-white p-8 rounded-lg w-full max-w-4xl"
      >
        <h3 className="text-xl font-serif text-center mb-6">Registrar Acudiente</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Nombre"
            id="attendant_Name"
            name="attendant_Name"
            value={formData.attendant_Name}
            onChange={handleChange}
            placeholder="Nombres"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TextFieldsIcon />
                </InputAdornment>
              ),
            }}
            variant="outlined"
          />
          <TextField
            label="Apellidos"
            id="attendant_Surname"
            name="attendant_Surname"
            value={formData.attendant_Surname}
            onChange={handleChange}
            placeholder="Apellidos"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TextFieldsIcon />
                </InputAdornment>
              ),
            }}
            variant="outlined"
          />
          <TextField
            label="Teléfono"
            id="attendant_Phone"
            name="attendant_Phone"
            value={formData.attendant_Phone}
            onChange={handleChange}
            placeholder="Número telefónico"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon />
                </InputAdornment>
              ),
            }}
            variant="outlined"
          />
          <TextField
            label="Dirección"
            id="attendant_Address"
            name="attendant_Address"
            value={formData.attendant_Address}
            onChange={handleChange}
            placeholder="Dirección"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnIcon />
                </InputAdornment>
              ),
            }}
            variant="outlined"
          />
          <TextField
            label="Email"
            id="attendant_Email"
            name="attendant_Email"
            type="email"
            value={formData.attendant_Email}
            onChange={handleChange}
            placeholder="Correo Electrónico"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
            variant="outlined"
          />
          <TextField
            label="Fecha de Nacimiento"
            id="attendant_Age"
            name="attendant_Age"
            type="date"
            value={formData.attendant_Age}
            onChange={handleChange}
            placeholder="Fecha de Nacimiento"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CakeIcon />
                </InputAdornment>
              ),
            }}
            variant="outlined"
          />
        </div>
        <button
          className="w-full mt-6 bg-black text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-sky-600"
          type="submit"
        >
          Registrar
        </button>
      </form>
    </div>
    </main>
  );
}
export default RegisterAttendant;
