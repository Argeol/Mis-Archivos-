// "use client";

// import { useEffect, useRef } from "react";
// import { useUserInfo } from "./useUserInfo";
// import { useAuthUser } from "./useCurrentUser";
// import {
//   X,
//   ChevronRight,
//   Shield,
//   Mail,
//   Calendar,
//   UserIcon,
//   GraduationCap,
//   ShieldCheck,
//   UserCheck
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Separator } from "@/components/ui/separator";

// const UserInfoModal = ({ open, onClose }) => {
//   const modalRef = useRef(null);
//   const user = useAuthUser();
//   const { data, isLoading, error } = useUserInfo();
//   const userData = data?.data;
//   const translations = data?.translations;

//   // Manejar tecla Escape para cerrar el modal
//   useEffect(() => {
//     const handleEscapeKey = (e) => {
//       if (e.key === "Escape" && typeof onClose === "function") {
//         onClose();
//       }
//     };

//     document.addEventListener("keydown", handleEscapeKey);
//     return () => document.removeEventListener("keydown", handleEscapeKey);
//   }, [onClose]);

//   // No renderizar nada si el modal no está abierto
//   if (!open) return null;

//   // Función para cerrar el modal al hacer clic en el fondo
//   const handleBackdropClick = (e) => {
//     if (e.target === e.currentTarget) {
//       onClose();
//     }
//   };

//   // Función para obtener un icono basado en la clave
//   const getIconForKey = (key) => {
//     const iconMap = {
//       name: <UserIcon className="h-5 w-5 text-rose-500" />,
//       nombre: <UserIcon className="h-5 w-5 text-rose-500" />,
//       email: <Mail className="h-5 w-5 text-amber-500" />,
//       correo: <Mail className="h-5 w-5 text-amber-500" />,
//       date: <Calendar className="h-5 w-5 text-emerald-500" />,
//       fecha: <Calendar className="h-5 w-5 text-emerald-500" />,
//       // Puedes agregar más mapeos según tus datos
//     };

//     return iconMap[key] || <ChevronRight className="h-5 w-5 text-slate-400" />;
//   };

//   const renderContent = () => {
//     if (isLoading)
//       return (
//         <div className="space-y-6 py-4">
//           <div className="flex items-center space-x-3">
//             <Skeleton className="h-10 w-10 rounded-full" />
//             <div>
//               <Skeleton className="h-5 w-32" />
//               <Skeleton className="h-4 w-24 mt-1" />
//             </div>
//           </div>
//           <Separator />
//           {[1, 2, 3, 4].map((i) => (
//             <div key={i} className="space-y-2">
//               <Skeleton className="h-4 w-24" />
//               <Skeleton className="h-6 w-full" />
//             </div>
//           ))}
//         </div>
//       );

//     if (error)
//       return (
//         <div className="p-6 rounded-xl bg-red-50 border-l-4 border-blue-500 my-4">
//           <h3 className="text-blue-700 font-semibold text-lg">Error</h3>
//           <p className="text-blue-600 mt-1">
//             {error.message ||
//               "No se pudo cargar la información. Intente nuevamente más tarde."}
//           </p>
//         </div>
//       );

//     if (!userData || Object.keys(userData).length === 0)
//       return (
//         <div className="p-6 rounded-xl bg-slate-50 border-l-4 border-slate-300 my-4">
//           <h3 className="text-slate-700 font-semibold">Sin datos</h3>
//           <p className="text-slate-600 mt-1">
//             No hay información disponible para mostrar.
//           </p>
//         </div>
//       );

//     const getRoleIcon = (role) => {
//       switch (role) {
//         case "Aprendiz":
//           return <GraduationCap className="h-4.3 w-4.3 text-blue-500 mr-1" />;
//         case "Administrador":
//           return <ShieldCheck className="h-3.5 w-3.5 text-red-500 mr-1" />;
//         case "Responsable":
//           return <UserCheck className="h-3.5 w-3.5 text-green-500 mr-1" />;
//         default:
//           return <ShieldCheck className="h-3.5 w-3.5 text-slate-400 mr-1" />;
//       }
//     };

//     return (
//       <div className="space-y-6">
//         <div className="flex items-center space-x-3">
//         <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-200 to-[#068EED] flex items-center justify-center text-white font-serif text-xl shadow-sm">
//   {(user?.fullName[0] || "U").toUpperCase()}
// </div>
//           <div>
//             <h3 className="text-lg font-medium">{"Usuario"}</h3>
//             <div className="flex items-center mt-0.5">
//               {getRoleIcon(user?.role)}
//               <span className="text-sm text-slate-500">
//                 {user?.role || "Usuario"}
//               </span>
//             </div>
//           </div>
//         </div>

//         <Separator className="my-4" />

//         <div className="space-y-5">
//           {Object.entries(userData).map(([key, value]) => (
//             <div key={key} className="group">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   {getIconForKey(key)}
//                   <span className="text-sm font-medium text-slate-500">
//                     {translations?.[key] || key}
//                   </span>
//                 </div>
//               </div>
//               <p className="mt-1 text-slate-800 font-medium pl-7 break-words">
//                 {String(value) || "-"}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div
//       className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-all duration-300 ease-out"
//       onClick={handleBackdropClick}
//       role="dialog"
//       aria-modal="true"
//       aria-labelledby="modal-title"
//     >
//       <Card
//         ref={modalRef}
//         className="w-full max-w-md shadow-xl animate-in fade-in-0 slide-in-from-bottom-8 duration-500 max-h-[90vh] overflow-hidden rounded-xl border-0 ring-1 ring-black/5"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white border-b">
//           <h2
//             id="modal-title"
//             className="text-xl font-semibold flex items-center gap-2"
//           >
//             <span className="bg-gradient-to-r from-slate-600 to-[#088EED] bg-clip-text text-transparent">
//               Información de {user?.role || "Usuario"}
//             </span>
//           </h2>
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={onClose}
//             className="rounded-full h-8 w-8 hover:bg-slate-100 transition-colors"
//           >
//             <X className="h-4 w-4" />
//             <span className="sr-only">Cerrar</span>
//           </Button>
//         </div>

//         <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
//           {renderContent()}
//         </CardContent>

//         <div className="p-4 border-t bg-slate-50 flex justify-end">
//           <Button
//             onClick={onClose}
//             className="bg-gradient-to-r from-slate-600 to-blue-600 hover:from-slate-700 hover:to-blue-700 text-white px-6 shadow-md hover:shadow-lg transition-all"
//           >
//             Cerrar
//           </Button>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default UserInfoModal;
