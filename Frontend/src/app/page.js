 "use client";

import PublicNav from "@/components/navs/PublicNav";
import Footer from "@/components/navs/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Users, Calendar, FileText } from "lucide-react";


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicNav />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-white to-gray-100 flex items-center justify-center">
          <div className="container px-4 md:px-6 ">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-serif tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Gestión de Permisos de Aprendices
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 ">
                  Simplifica, agiliza el proceso de solicitud y aprobación de permisos en el centro Agropecuario la "La Granja".
                </p>
              </div>
              <div className="space-x-4">
                <Button size="lg" className="animate-gradient text-white bg-blue-500" ><a href="/user/login">Iniciar</a></Button>
                <Button size="lg" variant="outline"><a href="/user/register">Registrarse</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 md:py-24 lg:py-32 flex justify-center p-20">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              Características principales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={Users}
                title="Gestión centralizada"
                description="Administra todos los permisos de aprendices desde una única plataforma intuitiva."
              />
              <FeatureCard
                icon={Calendar}
                title="Calendario integrado"
                description="Visualiza y planifica los permisos de aprendices en un calendario fácil de usar."
              />
              <FeatureCard
                icon={FileText}
                title="Flujos de aprobación"
                description="Configura flujos de aprobación personalizados según las políticas de tu institución."
              />
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-12 md:py-24 lg:py-32 bg-gray-100 flex justify-center p-20">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4 ms-2">
                  ¿Por qué elegir Bienesoft?
                </h2> 
                <p className="text-gray-500 md:text-lg mb-4 ms-2">
                  Bienesoft ofrece una solución completa y fácil de usar para la gestión de permisos de aprendices,
                  mejorando la eficiencia y reduciendo errores en el proceso.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="ms-2 mr-2 h-5 w-5 text-green-500" />
                    <span>Interfaz intuitiva y fácil de usar</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="ms-2 mr-2 h-5 w-5 text-green-500" />
                    <span>Notificaciones automáticas</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="ms-2 mr-2 h-5 w-5 text-green-500" />
                    <span>Reportes detallados y análisis</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="ms-2 mr-2 h-5 w-5 text-green-500" />
                    <span>Soporte técnico dedicado</span>
                  </li>
                </ul>
              </div>
              <div className="aspect-video bg-gray-200 rounded-lg mr-2">
                <img src="/assets/img/portada.webp"></img>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Icon className="mr-2 h-6 w-6 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>{description}</p>
      </CardContent>
    </Card>
  );
}
