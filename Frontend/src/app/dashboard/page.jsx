"use client";

import PrivateNav from "@/components/navs/PrivateNav";
import Unidades from "./unidades/page";

export default function Dashboard() {
  const titleAcudiente = "Acudiente";
  return (
    <>
    <div className="flex flex-col flex-1">
      <PrivateNav title={titleAcudiente}>
        {/* <div className="flex-1 p-6">
          <Unidades />
        </div> */}
      </PrivateNav>
        </div>
    </>
  );
  // function AreaChildren() {
  //   return (
  //     <>
  //     <Unidades />
  //     </>
  //   );
  // }
}
