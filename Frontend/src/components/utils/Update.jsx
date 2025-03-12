import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const UpdateButton = ({ id, updateUrl, setData, idField, initialData, fieldLabels }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState(initialData || {});

    useEffect(() => {
        if (isOpen) {
            setFormData(initialData || {}); // Cargar los datos cuando se abre el modal
        }
    }, [isOpen, initialData]);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        try {
            const response = await axiosInstance.put(`${updateUrl}?id=${id}`, formData);
            if (response.status === 200) {
                setData((prevData) =>
                    prevData.map((item) =>
                        item[idField] === id ? { ...item, ...formData } : item
                    )
                );
                alert("Datos actualizados con éxito.");
                handleClose();
            } else {
                throw new Error(`Error al actualizar: ${response.status}`);
            }
        } catch (error) {
            console.error("Error al actualizar:", error);
            alert("Ocurrió un error al actualizar.");
        }
    };

    return (
        <>
            <Button variant="outline" onClick={handleOpen} className="text-blue-500 hover:bg-blue-50">
                Actualizar
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Actualizar Datos</DialogTitle>
                    </DialogHeader>
                    <form>
                        {Object.keys(formData || {}).map((key) => (
                            <div key={key} className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    {fieldLabels?.[key] || key}
                                </label>
                                <Input
                                    name={key}
                                    value={formData?.[key] || ""}
                                    onChange={handleChange}
                                    placeholder={`Ingrese ${fieldLabels?.[key] || key}`}
                                />
                            </div>
                        ))}
                        <div className="flex justify-end space-x-2">
                            <Button onClick={handleClose} variant="outline">
                                Cancelar
                            </Button>
                            <Button onClick={handleUpdate} className="bg-blue-500 text-white">
                                Guardar
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default UpdateButton;
