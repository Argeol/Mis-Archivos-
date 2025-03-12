import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function UpdateAttendantForm({ attendantToUpdate, updateAttendant }) {
  const [attendantName, setAttendantName] = useState("");
  const [attendantSurname, setAttendantSurname] = useState("");
  const [attendantPhone, setAttendantPhone] = useState("");
  const [attendantAddress, setAttendantAddress] = useState("");
  const [attendantEmail, setAttendantEmail] = useState("");
  const [attendantAge, setAttendantAge] = useState("");

  // Cargar los datos del acudiente si existe un acudiente a actualizar
  useEffect(() => {
    if (attendantToUpdate) {
      setAttendantName(attendantToUpdate.attendant_Name || "");
      setAttendantSurname(attendantToUpdate.attendant_Surname || "");
      setAttendantPhone(attendantToUpdate.attendant_Phone || "");
      setAttendantAddress(attendantToUpdate.attendant_Address || "");
      setAttendantEmail(attendantToUpdate.attendant_Email || "");
        }
  }, [attendantToUpdate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!attendantName.trim() || !attendantSurname.trim() || !attendantPhone.trim()) {
      alert("Por favor, complete todos los campos obligatorios.");
      return;
    }
  
    if (!attendantToUpdate) {
      alert("No se pudo actualizar el acudiente. Información no encontrada.");
      return;
    }
  
    const updatedAttendant = {
      attendant_Name: attendantName,
      attendant_Surname: attendantSurname,
      attendant_Phone: attendantPhone,
      attendant_Address: attendantAddress,
      attendant_Email: attendantEmail,
    };
        // Verificamos que attendantToUpdate tenga el id antes de llamar la función
    updateAttendant(updatedAttendant, attendantToUpdate.attendant_Id); // Llama a la función de actualización
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader>
        <h2 className="text-lg font-semibold text-center">
          {attendantToUpdate ? "Actualizar Acudiente" : "Guardar Acudiente"}
        </h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="attendantName" className="block text-sm font-medium text-gray-700">
              Nombre del Acudiente:
            </label>
            <Input
              id="attendantName"
              type="text"
              value={attendantName}
              onChange={(e) => setAttendantName(e.target.value)}
              placeholder="Ingrese el nombre del acudiente"
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="attendantSurname" className="block text-sm font-medium text-gray-700">
              Apellido del Acudiente:
            </label>
            <Input
              id="attendantSurname"
              type="text"
              value={attendantSurname}
              onChange={(e) => setAttendantSurname(e.target.value)}
              placeholder="Ingrese el apellido del acudiente"
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="attendantPhone" className="block text-sm font-medium text-gray-700">
              Teléfono del Acudiente:
            </label>
            <Input
              id="attendantPhone"
              type="text"
              value={attendantPhone}
              onChange={(e) => setAttendantPhone(e.target.value)}
              placeholder="Ingrese el teléfono del acudiente"
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="attendantAddress" className="block text-sm font-medium text-gray-700">
              Dirección del Acudiente:
            </label>
            <Input
              id="attendantAddress"
              type="text"
              value={attendantAddress}
              onChange={(e) => setAttendantAddress(e.target.value)}
              placeholder="Ingrese la dirección del acudiente"
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="attendantEmail" className="block text-sm font-medium text-gray-700">
              Correo electrónico:
            </label>
            <Input
              id="attendantEmail"
              type="email"
              value={attendantEmail}
              onChange={(e) => setAttendantEmail(e.target.value)}
              placeholder="Ingrese el correo electrónico del acudiente"
              className="mt-1"
            />
          </div>
        {/*   <div>
            <label htmlFor="attendantAge" className="block text-sm font-medium text-gray-700">
              Edad del Acudiente:
            </label>
            <Input
              id="attendantAge"
              type="number"
              value={attendantAge}
              onChange={(e) => setAttendantAge(e.target.value)}
              placeholder="Ingrese la edad del acudiente"
              className="mt-1"
            />
          </div> */}
          <Button type="submit" className="w-full">
            {attendantToUpdate ? "Actualizar Acudiente" : "Guardar Acudiente"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
