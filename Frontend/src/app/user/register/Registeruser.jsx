import React, { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { motion } from "framer-motion";
import TextField from "@mui/material/TextField";
import { MenuItem } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import LockIcon from "@mui/icons-material/Lock";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

async function SendData(body) {
  const response = await axiosInstance.post("/api/User/CreateUser", body);
  return response;
}

function Registeruser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [alertMessage, setAlertMessage] = useState(null); // Estado para manejar la alerta

  async function handlerSubmit(event) {
    event.preventDefault();

    if (!email || !password || !userType || !confirmPassword) {
      setAlertMessage({ type: "error", text: "Todos los campos son requeridos" });
      return;
    }

    if (password !== confirmPassword) {
      setAlertMessage({ type: "error", text: "La contraseña y la confirmación no coinciden." });
      return;
    }

    const body = {
      email,
      hashedPassword: password,
      userType,
    };

    try {
      const response = await SendData(body);
      setAlertMessage({ type: "success", text: response.data.message });
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 400) {
        setAlertMessage({
          type: "error",
          text: error.response.data.message || "Solicitud inválida",
        });
      } else {
        setAlertMessage({ type: "error", text: "Error al procesar la solicitud. Inténtalo más tarde." });
      }
    }
  }

  return (
    <>
      <main>
        <form
          className="register-form shadow-2xl p-6 max-w-sm mx-auto my-5"
          onSubmit={handlerSubmit}
        >
          <div className="flex items-center space-x-4 justify-center">
            <h1 className="font-serif text-xl">Registrar Usuario</h1>
            <motion.div
              animate={{ y: [0, -5, 0], opacity: [1, 0.7, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              <img
                className="w-24 m-0 ms-20"
                alt=""
                src="/assets/img/bienesoft.png"
              />
            </motion.div>
          </div>

          {alertMessage && (
            <Alert className={`mt-4 ${alertMessage.type === "success" ? "bg-green-100" : "bg-red-100"}`}>
              <AlertTitle>{alertMessage.type === "success" ? "Éxito" : "Error"}</AlertTitle>
              <AlertDescription>{alertMessage.text}</AlertDescription>
            </Alert>
          )}

          <TextField
            label="Tipo de Usuario"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            id="userType"
            name="userType"
            required
            select
            fullWidth
            variant="outlined"
            className="mt-4"
          >
            <MenuItem value="Administrador">Administrador</MenuItem>
            <MenuItem value="Usuario">Aprendiz</MenuItem>
            <MenuItem value="Responsable">Responsable</MenuItem>
          </TextField>

          <TextField
            label="Usuario"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
            id="email"
            name="email"
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PermIdentityIcon />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            className="mt-4"
          />

          <TextField
            label="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Escriba su contraseña"
            id="password"
            name="password"
            type="password"
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            className="mt-4"
          />

          <TextField
            label="Confirmar Contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repita su contraseña"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            className="mt-4"
          />

          <Button type="submit" className="mt-4 w-full bg-blue-500 text-white hover:bg-gray-400">
            Registrar
          </Button>

          <div className="links-container mt-4 text-center">
            <a className="link text-blue-500 hover:underline" href="/user/login">
              Ya tengo una cuenta
            </a>
          </div>
        </form>
      </main>
    </>
  );
}

export default Registeruser;
