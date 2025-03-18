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
import UpdateButton from "./Update";
import CreateButton from "./Create";
import ModalDialog from "./ModalDialog";

export default function DataTable({
  Data,
  titlesData,
  idKey,
  handleDelete,
  handleSave,
  deleteUrl,
  idField,
  setData,
  updateUrl,
  createUrl,
  initialData,
  onRegister,
  fieldLabels,
  RegisterComponets,
  TitlePage,
}) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [formData, setFormData] = useState({});
  const itemsPerPage = 10;

  const filteredData = Data.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleOpen = (row) => {
    setSelectedRow(row);
    setFormData(row);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedRow(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => {
    handleSave(selectedRow[idKey], formData);
    handleClose();
  };

  return (
    <Card className="w-full max-w-5xl mx-auto p-4">
      <CardHeader>
        <CardTitle className="text-center text-xl font-semibold">
          Tabla de Datos
        </CardTitle>
        <div className="flex justify-end">
       
         <ModalDialog RegisterComponets={RegisterComponets} TitlePage={TitlePage}/>
          
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <Input
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:max-w-xs"
          />
        </div>

        <Table className="w-full">
          <TableHeader>
            <TableRow>
              {titlesData.map((title, index) => (
                <TableHead key={index} className="text-left">
                  {title}
                </TableHead>
              ))}
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((row, index) => (
                <TableRow
                  key={index}
                  className="hover:bg-gray-100 transition-colors"
                >
                  {Object.keys(row).map((key, i) => (
                    <TableCell key={i} className="px-4 py-2">
                    {row[key] !== null && typeof row[key] === "object"
                      ? JSON.stringify(row[key]) // Convierte cualquier objeto a texto
                      : String(row[key])} 
                  </TableCell>
                  ))}
                  <TableCell className="px-4 py-2 text-center space-x-2">
                    <UpdateButton
                      id={row[idKey]}
                      updateUrl={updateUrl}
                      setData={setData}
                      idField={idField}
                      initialData={row}
                      fieldLabels={fieldLabels}
                    />
                    <DeleteButton
                      id={row[idKey]}
                      deleteUrl={deleteUrl}
                      idField={idField}
                      setData={setData}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={titlesData.length + 1}
                  className="text-center text-gray-500"
                >
                  No se encontraron datos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="mt-4 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <span className="text-gray-700">
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
        
    </Card>
  );
}
