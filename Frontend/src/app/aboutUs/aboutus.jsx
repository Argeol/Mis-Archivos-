"use client";

import * as React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/navs/Footer";

const teamMembers = [
  {
    name: "Argeol Guio Pineda",
    role: "Analista y Desarrollador",
    image: "/assets/img/argeol.jpeg",
    description:
      "Experto en bases de datos y arquitectura de servidores. Enfocado en la optimización y seguridad de aplicaciones.",
    correo: "guiopinedaargeol79@gmail.com",
  },
  {
    name: "Adolfo Sanchez Melo ",
    role: "Analista y Desarrollador",
    image: "/assets/img/adolfo.webp",
    description:
      "Organizador con habilidades de liderazgo. Mantiene al equipo dando mayor sostenibilidad.",
    correo: "Sanchez.adolfo15@hotmail.com",
  },
  {
    name: "Fabian Dario Gomez Murcia",
    role: "Analista y Desarrollador",
    image: "/assets/img/murcia.webp",
    description:
      "Creativo y detallista. Encargado de crear experiencias visuales atractivas y funcionales para nuestros usuarios.",
    correo: "Murcia21.gmz@gmail.com",
  },
  {
    name: "Daniel Camilo Perdomo Gonzalez ",
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
      setCurrentIndex((prev) => (prev === 0 ? 2 : 0));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentGroup = teamMembers.slice(currentIndex, currentIndex + 2);

  return (
    <>
      <div className="bg-white min-h-screen pt-10">
        <section className="container mx-auto px-4 py-8">
          <h2 className="text-5xl font-bold text-center text-black mb-6">
            Nuestro Equipo
          </h2>
          <p className="text-center text-gray-700 mb-12 max-w-3xl mx-auto text-lg leading-relaxed">
            Somos un equipo de aprendices del SENA apasionados por la innovación
            tecnológica. Combinamos nuestras habilidades para desarrollar
            soluciones útiles, funcionales y de alto impacto, enfocándonos en la
            mejora continua y el aprendizaje colaborativo.
          </p>

          <div className="flex flex-wrap justify-center gap-8 transition-all duration-1000">
            {currentGroup.map((member, index) => (
              <Card
                key={index}
                className="max-w-md w-full bg-white shadow-xl hover:shadow-2xl rounded-xl transition duration-500"
              >
                <CardContent className="flex flex-col items-center text-center p-6">
                  <div className="relative w-40 h-40 mb-4">
                    <Image
                      src={member.image}
                      alt={member.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full ring-4 ring-blue-200 shadow-md hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-black">
                    {member.name}
                  </h3>
                  <p className="text-blue-700 font-medium mt-1">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm mt-2 mb-2">
                    {member.description}
                  </p>
                  <a
                    href={`mailto:${member.correo}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {member.correo}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-gray-50 rounded-xl shadow-md mt-16 p-8">
            <h3 className="text-3xl font-bold text-black mb-4">
              Sobre el Proyecto
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Estamos desarrollando un sistema de gestión de permisos de salida
              para el Centro Agropecuario La Granja. Nuestra plataforma está
              pensada para simplificar el proceso mediante una interfaz web que
              combina eficiencia, seguridad y facilidad de uso.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Planificación ágil con enfoque colaborativo.</li>
              <li>Uso de tecnologías modernas: React, Nest.js, TailwindCSS.</li>
              <li>Enfoque en impacto real y escalabilidad.</li>
              <li>Equipo comprometido con el aprendizaje continuo.</li>
            </ul>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
