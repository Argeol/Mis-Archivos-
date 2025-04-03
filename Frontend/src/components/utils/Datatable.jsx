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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DeleteButton from "./Delete";
import ModalDialogUpdate from "./UpdateModalDialog";
import ModalDialog from "./ModalDialog";

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
  areas,
}) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
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

  const handleOpen = (row) => {
    setSelectedRow(row);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedRow(null);
  };

  return (
    <Card className="w-full max-w-5xl mx-auto p-4">
      <CardHeader>
        <CardTitle className="text-center text-xl font-semibold">
          Lista de Aprendices
        </CardTitle>
        <div className="mb-4 flex justify-end">
          <Input
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:max-w-xs"
          />
        </div>
        <ModalDialog
          RegisterComponets={RegisterComponets}
          TitlePage={TitlePage}
        />
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
                    className={`hover:bg-gray-100 transition-colors ${disabled ? "opacity-50 pointer-events-none" : ""
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
                        program_Name={row.program_Name}
                        areas={areas} // ✅ Ahora sí se pasa correctamente
                        disabled={disabled}
                      />
                      <Button
                        onClick={() => handleOpen(row)}
                        className="!bg-black !text-white !hover:bg-gray-900 !opacity-100 !pointer-events-auto"
                      >
                        Informacion de {TitlePage}
                      </Button>
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

      {/* Modal de Más Info */}
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Información Completa del {TitlePage}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {selectedRow &&
              Object.entries(selectedRow).map(([key, value]) => (
                <p key={key}>
                  <strong>{translations[key] || key}:</strong>{" "}
                  {value?.toString()}
                </p>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
