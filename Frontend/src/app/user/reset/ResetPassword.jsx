import { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import AtIcon from "@mui/icons-material/AlternateEmail";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [issubmitting, setsubmitting] = useState(false);

  async function handlerSubmit(event) {
    event.preventDefault();
    setMessage(null);
    setsubmitting(true);

    try {
      const response = await axiosInstance.post("/api/User/ResetPassUser", {
        email,
      });

      if (response.status === 200) {
        alert(response.data.message);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Ocurrió un error");
    } finally {
      setsubmitting(false);
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        className="shadow-lg p-6 bg-white rounded-lg max-w-sm mx-auto"
        onSubmit={handlerSubmit}
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Recuperación de Cuenta
        </h2>
        <p className="mb-4">
          Ingrese su correo electrónico para recuperar su cuenta
        </p>
        <TextField
          label="Email"
          placeholder="Correo electrónico"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AtIcon />
              </InputAdornment>
            ),
          }}
          variant="outlined"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mt-4"
        />
        <Button
          type="submit"
          className="btn btn-blue-500 hover:bg-gray-300 text-white rounded w-full bg-blue-500 mt-4"
          disabled={issubmitting}
        >
          {issubmitting ? "Enviando..." : "Restablecer contraseña"}
        </Button>
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
        <div className="link-container mt-4 text-center">
          <a className="text-blue-700 hover:underline" href="/user/login">
            Volver a inicio
          </a>
        </div>
      </form>
    </main>
  );
}

export default ResetPassword;
