"use client";

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
  fieldLabels
}

) {
  return(
    <>
      <ModalDialog RegisterComponets={registerComponets} TitlePage={titlesPage} />
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
      />
    </>
  )
}
export default ContecPage;
