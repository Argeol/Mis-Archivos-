import React, { useState, useEffect } from 'react';
import { useUserInfo } from './useUserInfo';

const UserInfoModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user')); // O usa useAuthUser()
  const role = user?.role;

  const { data, isLoading, error } = useUserInfo(role, token);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div>
      <button onClick={openModal} className="bg-blue-600 text-white px-4 py-2 rounded">
        Ver información
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-xl font-semibold mb-4">Información del usuario</h2>

            {isLoading && <p>Cargando...</p>}
            {error && <p>Error: {error.message}</p>}
            {data && (
              <div className="space-y-2">
                <p><strong>Nombre:</strong> {data.nombre}</p>
                <p><strong>Email:</strong> {data.email}</p>
                {/* Agrega más campos según tu modelo */}
              </div>
            )}

            <button onClick={closeModal} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfoModal;
