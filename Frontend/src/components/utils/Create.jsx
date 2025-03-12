"use client";

import React, { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";



const CreateButton = ({ createUrl, initialData, onRegister, fieldLabels}) => {
    const [formData, setFormData] = useState(initialData || {});
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Función para formatear la fecha al formato YYYY-MM-DD
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
    };

    // Manejar cambios en los inputs
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "date" ? new Date(value).toISOString() : value, // Convierte fechas a ISO si es input date
        }));
    };

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await axiosInstance.post(createUrl, formData);
            if (response.status === 200) {
                alert("Registro creado con éxito");
                setFormData(initialData || {}); // Reinicia el formulario
                onRegister && onRegister(response.data); // Notifica al padre
                setIsOpen(false);
            }
        } catch (error) {
            alert("Hubo un error al registrar");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Button onClick={() => setIsOpen(true)}>Nuevo Registro</Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Registrar Nuevo</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {Object.keys(initialData).map((key) => (
                            <div key={key}>
                                <Label htmlFor={key}>{fieldLabels[key] || key}</Label>
                                <Input 
                                    id={key}
                                    name={key}
                                    type={key.includes("Date") ? "date" : "text"} // Usa date para fechas
                                    value={key.includes("Date") ? formatDate(formData[key]) : formData[key] || ""}
                                    onChange={handleChange}
                                    placeholder={`Ingrese ${fieldLabels[key] || key}`}
                                />
                            </div>
                        ))}
                        <div className="flex justify-end space-x-2">
                            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Enviando..." : "Registrar"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CreateButton;
