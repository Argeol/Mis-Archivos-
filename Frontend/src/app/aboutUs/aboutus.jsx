"use client";

import * as React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Footer from "@/components/navs/Footer";

const teamMembers = [
  {
    name: "Argeol Guio Pineda",
    role: "Analista y Desarrollador",
    image: "/assets/img/argeol.jpg",
    description:
      "Experto en bases de datos y arquitectura de servidores. Enfocado en la optimización y seguridad de aplicaciones.",
    correo: "guiopinedaargeol79@gmail.com",
  },
  {
    name: "Adolfo Sanchez Melo ",
    role: "Analista y Desarrollador",
    image: "/assets/img/adolfo.webp",
    description:
      "Organizador con habilidades de liderazgo. Mantiene al equipo enfocado y asegura la entrega puntual de los proyectos.",
    correo: "Sanchez.adolfo15@hotmail.com",
  },
  {
    name: "Fabian Dario Gomez Murcia",
    role: "Analista y Desarrollador",
    image: "/assets/img/murcia.webp",
    description:
      "Creativa y detallista. Encargada de crear experiencias visuales atractivas y funcionales para nuestros usuarios.",
    correo: "Murcia21.gmz@gmail.com",
  },
  {
    name: "Daniel Camilo Perdomo Bonilla ",
    role: "Analista y Desarrollador",
    image: "/assets/img/camilo.webp",
    description:
      "Apasionado por el diseño de interfaces y la experiencia de usuario. Especializada en React y CSS avanzado.",
    correo: "Danielperdomo782@gmail.com",
  },
];

export function AboutUs() {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex + 2 >= teamMembers.length ? 0 : prevIndex + 2
      );
    }, 5000); // Cambio automático cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  const displayedItems = (index) => {
    const firstIndex = index % teamMembers.length;
    const secondIndex = (index + 1) % teamMembers.length;
    return [teamMembers[firstIndex], teamMembers[secondIndex]];
  };

  return (
    <>
      <div className="m-8 p-8 rounded">
        <section className="-mt-14 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-5">Quiénes Somos</h2>
            <p className="tblue-6blue-6ext-center mb-12 max-w-2xl mx-auto">
              Somos un grupo de 4 aprendices del SENA, apasionados por la
              tecnología y comprometidos con el desarrollo de soluciones
              innovadoras. Nuestro proyecto busca aplicar los conocimientos
              adquiridos para crear impacto en el centro.
            </p>
            <Carousel className="relative w-full max-w-4xl mx-auto">
              <CarouselContent className="flex justify-around">
                {displayedItems(currentIndex).map((member, index) => (
                  <CarouselItem key={index} className="flex-1 mx-4">
                    <Card>
                      <CardContent className="flex flex-col items-center p-6">
                        <Image
                          src={member.image}
                          alt={member.name}
                          width={300}
                          height={300}
                          className="rounded-lg mb-4"
                        />
                        <h3 className="text-xl font-semibold mb-2">
                          {member.name}
                        </h3>
                        <p className="text-gray-600 font-medium mb-2">
                          {member.role}
                        </p>
                        <p className="text-center text-sm">
                          {member.description}
                        </p>
                        <a
                          href={`mailto:${member.correo}`}
                          className="text-center text-blue-6blue-600 text-sm underline hover:text-blue-800"
                        >
                          {member.correo}
                        </a>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <Card className="mt-12">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-4">Nuestro Proyecto</h3>
                <p className="mb-4">
                  Como aprendices del SENA, estamos desarrollando un proyecto
                  innovador que busca mejorar los permisos de salida en un
                  sistema de gestión de permisos para el Centro Agropecuario La
                  Granja. Este sistema tiene como objetivo gestionar tanto
                  permisos físicos como virtuales, utilizando una página web
                  que facilite esta tarea.
                  <br />
                  Nuestro enfoque combina las habilidades únicas de cada miembro
                  del equipo para crear una solución integral y efectiva.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Aplicamos metodologías ágiles para una gestión eficiente del
                    proyecto.
                  </li>
                  <li>
                    Utilizamos tecnologías de vanguardia para asegurar un
                    producto final de alta calidad.
                  </li>
                  <li>
                    Nos enfocamos en crear soluciones que tengan un impacto
                    positivo en nuestra comunidad.
                  </li>
                  <li>
                    Buscamos constantemente oportunidades de aprendizaje y
                    crecimiento durante el desarrollo del proyecto.
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </>
  );
}
