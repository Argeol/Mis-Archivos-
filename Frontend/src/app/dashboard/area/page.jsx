"use client"

import PrivateNav from "@/components/navs/PrivateNav";
import RegisterArea from "./registerArea";
import DataTableDemo from "@/components/datatable/page";

export default function Dashboard() {
    return(
    <>
        <PrivateNav>
            <RegisterArea/>  
            <DataTableDemo/>  
        </PrivateNav> 
    </>
    )
    
}