"use client";

import { useState } from 'react';
import { FaIdCard, FaClipboardCheck, FaUserShield } from 'react-icons/fa';

function RegisterResponse  () {
  const [formData, setFormData] = useState({
    id: '',
    permiso: '',
    responsable: '',
  });

  const [errors, setErrors] = useState({
    id: false,
    permiso: false,
    responsable: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Validación en tiempo real
    setErrors({ ...errors, [e.target.name]: !value.trim() });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(errors).includes(true)) {
      alert('Por favor, corrija los errores');
      return;
    }
    console.log('Formulario enviado:', formData);
    alert('Formulario de Autorización guardado con éxito');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-2xl space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">Formulario de Gestión de Autorización</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ID */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="id" className="text-lg font-medium text-gray-700">ID</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <FaIdCard className="text-gray-500" />
              <input
                type="text"
                id="id"
                name="id"
                value={formData.id}
                onChange={handleChange}
                className="w-full pl-2 text-gray-700 focus:outline-none"
                placeholder="Ingrese el ID"
                required
              />
            </div>
            {errors.id && <p className="text-red-500 text-sm">Este campo es obligatorio.</p>}
          </div>

          {/* Permiso */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="permiso" className="text-lg font-medium text-gray-700">Permiso</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <FaClipboardCheck className="text-gray-500" />
              <textarea
                id="permiso"
                name="permiso"
                value={formData.permiso}
                onChange={handleChange}
                className="w-full pl-2 text-gray-700 focus:outline-none"
                placeholder="Ingrese los detalles del permiso"
                rows="4"
                required
              />
            </div>
            {errors.permiso && <p className="text-red-500 text-sm">Este campo es obligatorio.</p>}
          </div>

          {/* Responsable */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="responsable" className="text-lg font-medium text-gray-700">Responsable</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <FaUserShield className="text-gray-500" />
              <input
                type="text"
                id="responsable"
                name="responsable"
                value={formData.responsable}
                onChange={handleChange}
                className="w-full pl-2 text-gray-700 focus:outline-none"
                placeholder="Ingrese el nombre del responsable"
                required
              />
            </div>
            {errors.responsable && <p className="text-red-500 text-sm">Este campo es obligatorio.</p>}
          </div>

          {/* Botón de Enviar */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full sm:w-1/2 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Guardar Autorización
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterResponse;
