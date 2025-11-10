import React, { useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { themeBalham } from 'ag-grid-community';
import {
  Paper,
  Button,
  Typography,
  Stack,
  TextField,
  AppBar,
  Toolbar,
  Container,
} from "@mui/material";


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
  const [filterText, setFilterText] = useState("");

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

  const onFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const filteredRows = useMemo(() => {
    if (!filterText) return rowData;
    return rowData.filter(row =>
      row.name.toLowerCase().includes(filterText.toLowerCase()) ||
      row.country.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [rowData, filterText]);


  return (
    <>
      <AppBar position="static" color="primary" enableColorOnDark>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              User Management Dashboard
          </Typography>
          <Button variant="contained" color="primary" onClick={addMoreRows}>
            Add 10 More Users
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md">
        <Paper elevation={6} sx={{ marginTop: 4, padding: 3 }}>
          <Stack spacing={2}>
            <TextField
              label="Search by Username or Country"
              variant="outlined"
              value={filterText}
              onChange={onFilterChange}
            />
            <div className="ag-theme-alpine" style={{ height: 600, width: "100%" }}>
              <AgGridReact
                rowData={filteredRows}
                columnDefs={columnDefs}
                pagination={true}
                paginationPageSize={10}
                domLayout="autoHeight"
                animateRows
                theme={myTheme}
              />
            </div>
          </Stack>
        </Paper>
      </Container>
    </>
  );

};

export default Dashboard;
