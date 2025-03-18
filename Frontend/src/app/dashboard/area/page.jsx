"use client"
import { useEffect, useState } from "react";
import PrivateNav from "@/components/navs/PrivateNav";
import ContecPage from "@/components/utils/ContectPage";
import axiosInstance from "@/lib/axiosInstance";


export default function AreaDashboard() {
    const [dataArea, setDataArea] = useState([]);
    useEffect(() => {
        const fetchDataArea = async () => {
            try {
                const response = await axiosInstance.get("api/Area/AllArea");
                if (response.status !== 200) {
                    throw new Error("Error al cargar las Areas");
                }
    
                // Remover "programs" de cada objeto
                const filteredData = response.data.map(({ programs, ...rest }) => rest);
                setDataArea(filteredData);
                
            } catch (error) {
                console.error("Error fetching Areas:", error);
            }
        };
    
        fetchDataArea();
    }, []);
    
    const fieldLabels = {
        Area_Id: "ID del Area",
        Area_Name: "Nombre del Area",
    };
    console.log(dataArea)
    return(
    <>
        <PrivateNav>
        <ContecPage
                    titlesPage="Areas"
                    titlesData={[
                        "ID", "Nombre"
                    ]}
                    idKey="Area_Id"
                    Data={dataArea}
                    deleteUrl="api/Area/DeleteArea"
                    setData={setDataArea}
                    initialData={{
                        Area_Id: "",
                        Area_Name: ""
                    }}
                    onRegister={(newData) => setDataArea((prev) => [...prev, newData])}
                    fieldLabels={fieldLabels}
                />
        </PrivateNav> 
    </>
    )
    
}