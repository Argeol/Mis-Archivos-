"use client";

import DataTable from "./Datatable";
import ModalDialog from "./ModalDialog";

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
  ignorar,
  currentStatus,
  fieldName,
  updateEndpoint,
  queryKey,
  inf,
  botonExtra, // Recibimos el botón aquí
}) {
  return (
    <>
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
        currentStatus={currentStatus}
        fieldName={currentStatus}
        updateEndpoint={updateEndpoint}
        queryKey={queryKey}
        inf={inf}
        botonExtra={botonExtra} // Pasamos el botón a DataTable
      />
    </>
  );
}

export default ContecPage;
