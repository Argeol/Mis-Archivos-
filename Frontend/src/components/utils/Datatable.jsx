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
import { MoreVertical } from "lucide-react";

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

  return (
    <Card className="w-full max-w-5xl mx-auto p-4">
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
        {RegisterComponets && (
          <ModalDialog
            RegisterComponets={RegisterComponets}
            TitlePage={TitlePage}
          />
        )}
      </CardHeader>

      <CardContent>
        <Table className="w-full">
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
                    className={`hover:bg-gray-100 transition-colors ${
                      disabled ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    {tableCell.map((cell, index) => (
                      <TableCell key={index}>{row[cell]}</TableCell>
                    ))}
                    <TableCell className="text-center space-x-2 !pointer-events-auto relative">
                      <ModalDialogUpdate
                        TitlePage={TitlePage}
                        UpdateComponent={updateComponets}
                        id={row[idKey]}
                        disabled={disabled}
                      />

                      {inf && (
                        <Button
                          onClick={() => {
                            setSelectedApprenticeId(row[inf]);
                            setIsOpenApprenticeModal(true);
                          }}
                        >
                          Ver aprendiz
                        </Button>
                      )}

                      {translations && (
                        <Button
                          onClick={() => {
                            setSelectedRowInfo(row);
                            setIsOpenInfoModal(true);
                          }}
                        >
                          Información de {TitlePage}
                        </Button>
                      )}

                      {fieldName && updateEndpoint && currentStatus && (
                        <StatusToggleButton
                          id={row[idKey]}
                          currentStatus={row[currentStatus]}
                          fieldName={fieldName}
                          updateEndpoint={updateEndpoint}
                          queryKey={queryKey}
                        />
                      )}
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
      {inf && selectedApprenticeId && (
        <ModalInfoApprentice
          isOpen={isOpenApprenticeModal}
          onClose={() => {
            setIsOpenApprenticeModal(false);
            setSelectedApprenticeId(null);
          }}
          apprenticeId={selectedApprenticeId}
        />
      )}

      {translations && selectedRowInfo && (
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
      )}
    </Card>
  );
}
