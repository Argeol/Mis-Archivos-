"use client";

import UpdateFile from "@/app/dashboard/file/UpdateComponet";
import DataTable from "./Datatable";
import ModalDialog from "./ModalDialog";

// 

function ContecPage({
  titlesPage,
  titlesData,
  registerComponets,
  idKey,
  Data,
  deleteUrl,
  setData,
  updateUrl,
  createUrl,
  initialData,
  onRegister,
  fieldLabels,
  updateComponets
}

) {
  return(
    <>
      <ModalDialog RegisterComponets={registerComponets} TitlePage={titlesPage} updateComponet={updateComponets}/>
      <DataTable
          titlesData={titlesData} 
          idKey={idKey} 
          Data={Data}
          deleteUrl={deleteUrl}
          idField={idKey}
          setData={setData}
          updateUrl={updateUrl}
          createUrl={createUrl}
          initialData={initialData}
          onRegister={onRegister}
          fieldLabels={fieldLabels}
          RegisterComponets={registerComponets}
          TitlePage={titlesPage}
          updateComponet={updateComponets}
      />
    </>
  )
}
export default ContecPage;
