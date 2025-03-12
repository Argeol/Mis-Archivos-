"use client"

import PrivateNav from "@/components/navs/PrivateNav";
import RegisterResposible from "./registerResposible";

export default function Dashboard() {
    return(
    <>
        <PrivateNav>
             <RegisterResposible/>
        </PrivateNav>  
    </>
    )
}