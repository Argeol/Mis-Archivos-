import React from "react";
import PublicNav from "@/components/navs/PublicNav";
import Footer from "@/components/navs/Footer";

const Documento = () => {
    return (
        <>
            <PublicNav />
            <div className="flex flex-col min-h-screen">
                {/* Título y enunciado */}
                <div className="text-center p-4">
                    <h1 className="text-xl font-serif tracking-tighter sm:text-2xl md:text-3xl lg:text-4xl">
                        Manual Técnico
                    </h1>
                    <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 ">
                        Este es nuestro manual técnico, donde redacta cómo se está llevando a 
                        cabo la elaboración de nuestro proyecto Bienesoft
                    </p>
                </div>

                {/* Contenedor del documento */}
                <div className="bg-gray-300 p-1 rounded-md shadow-md max-w-2xl mx-auto mt-4 mb-10">
                    <div className="overflow-hidden shadow-lg rounded-md">
                        <iframe
                            src="assets/docs/ManualT.pdf"
                            title="Documentación"
                            className=" h-[600px] w-[600px] border-none"
                        />
                    </div>
                </div>
            </div>

            {/* Footer separado */}
            <div className="mt-auto">
                <Footer />
            </div>
        </>
    );
};

export default Documento;
