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
  setData,
  updateUrl,
  createUrl,
  initialData,
  onRegister,
  fieldLabels,
  updateComponets,
  campo1,
  tableCell,
  translations,
  isDisabled,
  ignorar
}

) {
  return(
    <>
      {/* <ModalDialog RegisterComponets={registerComponets} TitlePage={titlesPage} /> */}
      <DataTable
          Data={Data}
          idKey={idKey} 
          idField={idKey}
          setData={setData}
          updateComponets={updateComponets}
          titlesData={titlesData} 
          tableCell={tableCell}
          TitlePage={titlesPage}
          translations={translations}
          createUrl={createUrl}
          initialData={initialData}
          onRegister={onRegister}
          fieldLabels={fieldLabels}
          RegisterComponets={registerComponets}
          isDisabled={isDisabled}
          ignorar={ignorar}
      />
    </>
  )
}
export default ContecPage;
