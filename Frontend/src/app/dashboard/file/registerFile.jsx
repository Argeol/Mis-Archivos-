"use client";

import axiosInstance from "@/lib/axiosInstance";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { FaIdCard, FaRegListAlt, FaCalendarAlt, FaUsers } from "react-icons/fa";

function RegisterFile() {
  const [formData, setForData] = useState({
    file_Id: "",
    apprentice_count: "",
    start_Date: "",
    end_Date: "",
    program_Id: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        "/Api/File/CreateFile",
        FormData
      );
      if (response.status === 200) {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }
  const handleChange = (e) => {
    setForData({ ...FormData, [e.target.name]: e.target.value });
  };
  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="flex items-center justify-center min-h-screen -mt-14">
        <form
          onSubmit={handleSubmit}
          className="shadow-2xl bg-white p-8 rounded-lg w-full max-w-4xl"
        >
          <h3 className="text-xl font-serif text-center mb-6">
            Formulario de Gestión de Ficha
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              label="Codigo Ficha"
              id="file_Id"
              name="file_Id"
              value={formData.file_Id}
              onChange={handleChange}
              placeholder="Ingrese el codigo "
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
              label="Cantidad de Aprendices"
              id="apprentice_count"
              name="apprentice_count"
              value={formData.apprentice_count}
              onChange={handleChange}
              placeholder="Ingrese la cantidad de aprendices"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaUsers />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
            />
            <TextField
              label="Programa"
              id="program_Id"
              name="program_Id"
              value={formData.program_Id}
              onChange={handleChange}
              placeholder="Ingrese el nombre del programa"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaRegListAlt />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
            />
            <TextField
              label="Fecha de Inicio"
              id="start_Date"
              name="start_Date"
              value={formData.start_Date}
              onChange={handleChange}
              type="date"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaCalendarAlt />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
            />
            <TextField
              label="Fecha de Fin"
              id="end_Date"
              name="end_Date"
              value={formData.end_Date}
              onChange={handleChange}
              type="date"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaCalendarAlt />
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
            Guardar Ficha
          </button>
        </form>
      </div>
    </main>
  );
}

export default RegisterFile;
