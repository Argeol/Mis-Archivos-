"use client";

import axiosInstance from "@/lib/axiosInstance";
import { useState } from "react";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import NoteIcon from "@mui/icons-material/Note";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

function RegistrarPermiso() {
  const [FormData, SetFormData] = useState({
    Apprentice_Id: "",
    Departure_Date: "",
    Entry_Date: "",
    Adress: "",
    Destinatation: "",
    Motive: "",
    Observation: "",
  });

  async function handlerSubmit(e) {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        "/Api/Permission/CreatePermission",
        FormData
      );
      if (response.status === 200) {
        alert(response.data.message);
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  }

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="flex items-center justify-center min-h-screen -mt-14">
        <form
          onSubmit={handlerSubmit}
          className="shadow-2xl bg-white p-8 rounded-lg  w-auto"
        >
          <h3 className="text-xl font-serif text-center mb-6">
            Diligencia Permiso
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              label="Documento de Aprendiz"
              id="Apprentice_Id"
              name="Apprentice_Id"
              value={FormData.Apprentice_Id}
              onChange={(e) =>
                SetFormData({ ...FormData, Apprentice_Id: e.target.value })
              }
              placeholder="Numero de Identificacion"
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
            />
            <TextField
              label="Fecha de Salida"
              type="date"
              id="Departure_Date"
              name="Departure_Date"
              value={FormData.Departure_Date}
              onChange={(e) =>
                SetFormData({ ...FormData, Departure_Date: e.target.value })
              }
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DirectionsRunIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              className="mb-4"
            />
            <TextField
              label="Fecha de Llegada"
              type="date"
              id="Entry_Date"
              name="Entry_Date"
              value={FormData.Entry_Date}
              onChange={(e) =>
                SetFormData({ ...FormData, Entry_Date: e.target.value })
              }
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MeetingRoomIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              className="mb-4"
            />
            <TextField
              label="Direccion"
              id="Adress"
              name="Adress"
              value={FormData.Adress}
              onChange={(e) =>
                SetFormData({ ...FormData, Adress: e.target.value })
              }
              placeholder="Direccion de Casa"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              className="mb-4"
            />
            <TextField
              label="Destino"
              id="Destinatation"
              name="Destinatation"
              value={FormData.Destinatation}
              onChange={(e) =>
                SetFormData({ ...FormData, Destinatation: e.target.value })
              }
              placeholder="Ha donde vas?"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TravelExploreIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              className="mb-4"
            />
            <TextField
              label="Motivo"
              id="Motive"
              name="Motive"
              value={FormData.Motive}
              onChange={(e) =>
                SetFormData({ ...FormData, Motive: e.target.value })
              }
              placeholder="Motivo de tu salida"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <NoteIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              className="mb-4"
            />
            <TextField
              label="Observacion"
              id="Observation"
              name="Observation"
              value={FormData.Observation}
              onChange={(e) =>
                SetFormData({ ...FormData, Observation: e.target.value })
              }
              placeholder="Observacion adicional de la salida"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LightbulbIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              className="mb-4"
            />
          </div>
          <button className="w-full mt-6 bg-black text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-sky-600">
            Solicitar Permiso
          </button>
        </form>
      </div>
    </main>
  );
}

export default RegistrarPermiso;
