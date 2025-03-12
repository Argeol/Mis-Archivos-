"use client";
import { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import CodeIcon from '@mui/icons-material/Code';
import LabelIcon from '@mui/icons-material/Label';

function RegisterDepartment() {
  const [departments, setDepartments] = useState({
    department_Id: "",
    departmentName: "",
  });
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        "/api/Department/CreateDepartment",
        departments
      );
      if (response.status === 200) alert(response.data.message);
    } catch (error) {
      alert(error.response.data.message);
    }
  }
  return (
    <>
      <div className="flex items-center justify-center min-h-screen ">
        <form
          onSubmit={handleSubmit}
          className="shadow-2xl bg-white p-8 rounded-lg w-full max-w-md"
        >
            <h3 className="text-xl font-serif text-center mb-6 ">
              Registrar Departamento
            </h3>
          <div>
            <TextField
              label="Codigo"
              id="department_Id"
              name="department_Id"
              value={FormData.department_Id}
              onChange={(e) =>
                SetForData({ ...FormData, department_Id: e.target.value })
              }
              placeholder="Codigo de Departamento"
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
              id="departmentName"
              name="departmentName"
              value={FormData.departmentName}
              onChange={(e) =>
                SetForData({ ...FormData, departmentName: e.target.value })
              }
              placeholder="Nombre de Departamento"
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
    </>
  );
}
export default RegisterDepartment;
