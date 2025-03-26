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
  fieldLabels,
  updateComponets,
  campo1,
  tableCell,
  translations
}

) {
  return(
    <>
      {/* <ModalDialog RegisterComponets={registerComponets} TitlePage={titlesPage} /> */}
      <DataTable
          Data={Data}
          idKey={idKey} 
          deleteUrl={deleteUrl}
          idField={idKey}
          setData={setData}
          updateComponets={updateComponets}
          titlesData={titlesData} 
          tableCell={tableCell}
          TitlePage={titlesPage}
          translations={translations}
          // createUrl={createUrl}
          // initialData={initialData}
          // onRegister={onRegister}
          // fieldLabels={fieldLabels}
          RegisterComponets={registerComponets}
      />
    </>
  )
}
export default ContecPage;
