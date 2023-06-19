import React, { useEffect, useState } from "react";
import DynamicTable from "@atlaskit/dynamic-table";
import { head, rows, fetchProjectData } from "./Table";

const AdminPage = () => {
  useEffect(() => {
    fetchProjectData();
  }, []);

  return (
    <DynamicTable
      head={head}
      rows={rows}
      rowsPerPage={5}
      defaultPage={1}
      loadingSpinnerSize="large"
      isRankable
    />
  );
};

export default AdminPage;
