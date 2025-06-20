"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteButton from "./Delete";
import ModalDialogUpdate from "./UpdateModalDialog";
import ModalDialog from "./ModalDialog";
import RowInfoModal from "./RowInfoModal";
import StatusToggleButton from "./ButtonActiveupdate";
import ModalInfoApprentice from "@/app/dashboard/apprentice/ApprenticeInfoModal";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  Edit,
  Trash2,
  Info,
  User,
  MoreVertical,
  CheckCircle,
} from "lucide-react";
import AuthorizePermissionModal from "@/app/dashboard/responsible/AuthorizePermissionModal";
import { ApprovalStatusModal } from "@/app/dashboard/permissionGeneral/ApprovalStatusModal";
import LoadingPage from "./LoadingPage";
import { useAuthUser } from "@/app/user/login/useCurrentUser";

export default function DataTable({
  Data,
  idKey,
  deleteUrl,
  idField,
  setData,
  updateComponets,
  titlesData,
  tableCell,
  TitlePage,
  translations,
  RegisterComponets,
  isDisabled = () => false,
  ignorar,
  currentStatus,
  fieldName,
  updateEndpoint,
  queryKey,
  inf,
  ExportacionExcel,
  ImportExcelBd
}) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpenInfoModal, setIsOpenInfoModal] = useState(false);
  const [isOpenApprenticeModal, setIsOpenApprenticeModal] = useState(false);
  const [selectedRowInfo, setSelectedRowInfo] = useState(null);
  const [selectedApprenticeId, setSelectedApprenticeId] = useState(null);
  const itemsPerPage = 10;

  const filteredData = Data.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
  const [selectedUpdateId, setSelectedUpdateId] = useState(null);
  // const [isOpenAuthorizationModal, setIsOpenAuthorizationModal] =
  useState(false); // Estado para el modal de autorización
  const [responsibleId, setResponsibleId] = useState(null); // 👈 Agrega esta línea
  const [selectedPermissionId, setSelectedPermissionId] = useState(null);

  const [responsibleName, setResponsibleName] = useState("");
  const handleViewStatus = (id) => {
    setSelectedPermissionId(id);
    setOpen(true);
  };
  //este es para ver estado de aprobacion
  const [open, setOpen] = useState(false);
  const { tip, isLoading: loadingUser, error: errorUser } = useAuthUser();
  if (errorUser || loadingUser) return <LoadingPage />;

  return (
    <>
      {tip === "Administrador" && (
        <Card className="w-full max-w-screen-xl mx-auto p-4 my-7">
          <CardHeader>
            <CardTitle className="text-center text-xl font-semibold">
              Lista de {TitlePage}
            </CardTitle>
            <div className="mb-4 flex justify-end">
              <Input
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="sm:max-w-xs"
              />
            </div>
            {ExportacionExcel && (
              <div className="mb-4 flex justify-end">{ExportacionExcel}</div>
            )}
            {ImportExcelBd && (
              <div className="mb-4 flex justify-end">{ImportExcelBd}</div>
            )}

            {RegisterComponets && (
              <ModalDialog
                className="w-full max-w-mda sm:max-w-xl sm:rounded-lg"
                RegisterComponets={RegisterComponets}
                TitlePage={TitlePage}
              />
            )}
          </CardHeader>

          <CardContent className="overflow-x-auto">
            <Table className="w-full min-w-[1000px]">
              <TableHeader>
                <TableRow>
                  {titlesData.map((title, index) => (
                    <TableHead key={index}>{title}</TableHead>
                  ))}
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length > 0 ? (
                  currentItems.map((row, index) => {
                    const disabled = isDisabled(row);

                    return (
                      <TableRow
                        key={index}
                        className={`hover:bg-gray-100 transition-colors ${disabled ? "opacity-50 pointer-events-none" : ""
                          }`}
                      >
                        {tableCell.map((cell, index) => (
                          <TableCell key={index}>
                            {typeof cell === "function" ? (
                              cell(row) // Ejecutar la función pasando el 'row' como argumento
                            ) : cell === "porcentaje" ? (
                              <div className="flex flex-col items-center">
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                                  <div
                                    className={`h-full rounded-full ${row[cell] >= 100
                                      ? "bg-green-600"
                                      : row[cell] >= 50
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                      }`}
                                    style={{ width: `${row[cell]}%` }}
                                  />
                                </div>
                                <span className="text-sm font-semibold">
                                  {Math.round(row[cell])}%
                                </span>
                              </div>
                            ) : (
                              row[cell] // Renderizar valores normales si no es función ni porcentaje
                            )}
                          </TableCell>
                        ))}
                        <TableCell className="text-center !pointer-events-auto">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              {/* {idKey === "responsible_Id" && row[idKey] != null && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setResponsibleId(row[idKey]);
                                    setIsOpenAuthorizationModal(true);
                                    setResponsibleName(row.nom_Responsible);
                                  }}
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Autorizar
                                </DropdownMenuItem>
                              )} */}
                              {/* Otros elementos del menú */}
                              {updateComponets && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedUpdateId(row[idKey]);
                                    setIsOpenUpdateModal(true);
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" /> Editar
                                </DropdownMenuItem>
                              )}

                              {inf && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedApprenticeId(row[inf]);
                                    setIsOpenApprenticeModal(true);
                                  }}
                                >
                                  <User className="mr-2 h-4 w-4" /> Ver aprendiz
                                </DropdownMenuItem>
                              )}

                              {translations && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedRowInfo(row);
                                    setIsOpenInfoModal(true);
                                  }}
                                >
                                  <Info className="mr-2 h-4 w-4" /> Mas Información
                                </DropdownMenuItem>
                              )}
                              {idKey === "permissionId" && (
                                <DropdownMenuItem
                                  variant="outline"
                                  className="mt-2"
                                  onClick={() => handleViewStatus(row[idKey])}
                                >
                                  Ver estado de aprobación
                                </DropdownMenuItem>
                              )}
                              {fieldName && updateEndpoint && currentStatus && (
                                <DropdownMenuItem asChild>
                                  <StatusToggleButton
                                    id={row[idKey]}
                                    currentStatus={row[currentStatus]}
                                    fieldName={fieldName}
                                    updateEndpoint={updateEndpoint}
                                    queryKey={queryKey}
                                  />
                                </DropdownMenuItem>
                              )}
                              {deleteUrl && (
                                <DropdownMenuItem asChild>
                                  <DeleteButton
                                    id={row[idKey]}
                                    deleteUrl={deleteUrl}
                                    setData={setData}
                                  />
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500">
                      No se encontraron datos.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <div className="mt-4 flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <span>
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Siguiente
              </Button>
            </div>
          </CardContent>

          {/* Modales fuera del .map() */}
          {
            inf && selectedApprenticeId && (
              <ModalInfoApprentice
                isOpen={isOpenApprenticeModal}
                onClose={() => {
                  setIsOpenApprenticeModal(false);
                  setSelectedApprenticeId(null);
                }}
                apprenticeId={selectedApprenticeId}
              />
            )
          }
          {/* { // infomacion completa el modal  */}
          {
            translations && selectedRowInfo && (
              <RowInfoModal
                isOpen={isOpenInfoModal}
                onClose={() => {
                  setIsOpenInfoModal(false);
                  setSelectedRowInfo(null);
                }}
                selectedRow={selectedRowInfo}
                TitlePage={TitlePage}
                translations={translations}
                ignorar={ignorar}
              />
            )
          }
          {
            updateComponets && isOpenUpdateModal && selectedUpdateId && (
              <ModalDialogUpdate
                TitlePage={TitlePage}
                UpdateComponent={updateComponets}
                id={selectedUpdateId}
                isOpen={isOpenUpdateModal} // <- esta es la que faltaba
                onClose={() => {
                  setIsOpenUpdateModal(false);
                  setSelectedUpdateId(null);
                }}
              />
            )
          }
          {/* 
          <AuthorizePermissionModal
            isOpen={isOpenAuthorizationModal}
            onClose={() => setIsOpenAuthorizationModal(false)}
            responsibleId={responsibleId}
            responsibleName={responsibleName} // 👈 Agrega esta línea
          /> */}
          {selectedPermissionId && (
            <ApprovalStatusModal
              permisoId={selectedPermissionId}
              open={open}
              onClose={() => setOpen(false)}
            />
          )}
        </Card >
      )}
    </>
  );
}
