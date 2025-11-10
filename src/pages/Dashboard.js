import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { themeBalham } from 'ag-grid-community';
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

const uniqueUsernames = [
  "SilverFalcon", "BlueTiger", "GoldenEagle", "CrimsonWolf",
  "IronLion", "ShadowFox", "NeonRabbit", "CobaltBear",
  "EmeraldHawk", "FrostPanther", "ScarletLeopard", "MysticOtter"
];

const countries = [
  "United States", "Canada", "Germany", "Australia",
  "India", "Brazil", "Japan", "South Africa",
  "United Kingdom", "France", "Mexico", "New Zealand"
];

// Function to get unique username by index or randomly
const getUsername = (index) => {
  if (index < uniqueUsernames.length) {
    return uniqueUsernames[index];
  }
  return uniqueUsernames[Math.floor(Math.random() * uniqueUsernames.length)];
};

// Function to get random country name
const getCountry = () => {
  return countries[Math.floor(Math.random() * countries.length)];
};

const generateRows = (count) => {
  const rows = [];
  for (let i = 0; i < count; i++) {
    rows.push({
      id: i + 1,
      name: getUsername(i),
      age: 20 + (i % 30),
      country: getCountry(),
    });
  }
  return rows;
};

const Dashboard = () => {
  const myTheme = themeBalham.withParams({ accentColor: 'red' });
  const [rowData, setRowData] = useState(generateRows(25));

  const addMoreRows = () => {
    const newRows = generateRows(rowData.length + 5).slice(rowData.length);
    setRowData([...rowData, ...newRows]);
  };

  const [columnDefs] = useState([
    { field: "id", headerName: "ID", sortable: true, filter: true },
    { field: "name", headerName: "Name", sortable: true, filter: true },
    { field: "age", headerName: "Age", sortable: true, filter: true },
    { field: "country", headerName: "Country", sortable: true, filter: true },
  ]);

  return (
    <Paper elevation={4} style={{ padding: 20, marginTop: 20 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" component="h2">
          User Data Table
        </Typography>
        <Button variant="contained" color="primary" onClick={addMoreRows}>
          Add More Rows
        </Button>
      </Stack>

      <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={15}
          theme={myTheme}
        />
      </div>
    </Paper>

  );
};

export default Dashboard;
