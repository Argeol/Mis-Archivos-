// hooks/useAuthUser.ts
export const useAuthUser = () => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // decodifica el JWT
    return {
      email: payload.email,
      role: payload.role,
      fullName: payload.FullName,
      responsibleId: payload.Responsible_Id,
    };
  } catch (err) {
    console.error("Error decodificando token:", err);
    return null;
  }
};
