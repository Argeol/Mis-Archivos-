"use client";

import axiosInstance from "@/lib/axiosInstance";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import CodeIcon from "@mui/icons-material/Code";
import LabelIcon from "@mui/icons-material/Label";

function RegisterArea() {
  const [FormData, SetForData] = useState({
    Area_Id: "",
    Area_Name: "",
  });
  async function handlerSubmit(e) {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        "/api/Area/CreateArea",
        FormData
      );
      if (response.status === 200) {
        alert(response.data.message);
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  }
  
  const handleChange = (e) => {
    SetForData({ ...FormData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <main className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
        <div className="flex items-center justify-center min-h-screen -mt-10">
          <form
            onSubmit={handlerSubmit}
            className="shadow-2xl bg-white p-8 rounded-lg w-full max-w-md"
          >
            <h3 className="text-xl font-serif text-center mb-6 ">
              Registrar Area
            </h3>
            <div>
              <TextField
                label="Codigo"
                id="Area_Id"
                name="Area_Id"
                value={FormData.Area_Id}
                onChange={handleChange}
                placeholder="Codigo de Area"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CodeIcon />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                className="mb-4"
              />
              <TextField
                label="Nombre"
                id="Area_Name"
                name="Area_Name"
                value={FormData.Area_Name}
                onChange={handleChange}
                placeholder="Nombre de Area"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LabelIcon />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                className="mb-4"
              />
              <button className="w-full mt-6 bg-black text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-sky-600 ">
                Registra
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}

export default RegisterArea;
