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
  ExportacionExcel, // Recibimos el botón aquí
  ImportExcelBd,
  ExportApprenticebyFile
}) {
  return (
    <>
      {ExportApprenticebyFile && (
        <div className="flex justify-center w-full mb-4">
          {ExportApprenticebyFile}
        </div>
      )}

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
        ExportacionExcel={ExportacionExcel}
        ImportExcelBd={ImportExcelBd}
      />
    </>

  );
}

export default ContecPage;
