import React, { useState, useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { themeBalham } from 'ag-grid-community';
import {
  Paper,
  Button,
  Typography,
  Stack,
  TextField,
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

const getUsername = (index) => {
  if (index < uniqueUsernames.length) {
    return uniqueUsernames[index];
  }
  return uniqueUsernames[Math.floor(Math.random() * uniqueUsernames.length)];
};

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
  const gridRef = useRef();

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

  const createChart = () => {
    if (!gridRef.current) return;

    // Remove existing charts in the container
    const chartContainer = document.querySelector('#myChartContainer');
    if (chartContainer) {
      chartContainer.innerHTML = '';
    }

    const params = {
      cellRange: {
        columns: ['country', 'age'],
      },
      chartType: 'groupedBar',
      chartContainer: chartContainer,
      aggFunc: 'avg',
      processChartOptions: (params) => {
        const opts = params.options;
        opts.title.text = 'Average Age by Country';
        opts.legendPosition = 'bottom';
        return opts;
      }
    };

    gridRef.current.api.createRangeChart(params);
  };


  return (
    <>
      <Typography variant="h4" gutterBottom>User Management Dashboard</Typography>
      <Stack direction="row" spacing={2} alignItems="center" marginBottom={2}>
        <TextField
          label="Filter by Name or Country"
          variant="outlined"
          size="small"
          value={filterText}
          onChange={onFilterChange}
        />
        <Button variant="contained" onClick={addMoreRows}>Add 5 More Users</Button>
        <Button variant="outlined" onClick={createChart}>Show Age by Country Chart</Button>
      </Stack>
      <div className="ag-theme-balham" style={{ height: 400, width: '100%' }}>
        <AgGridReact
          ref={gridRef}
          rowData={filteredRows}
          columnDefs={columnDefs}
          enableCharts={true}
          rowSelection="multiple"
          defaultColDef={{ flex: 1, minWidth: 100, filter: true, sortable: true }}
          animateRows={true}
          pagination={true}
          paginationPageSize={20}
          theme={myTheme}
        />

      </div>
      <Paper id="myChartContainer" style={{ marginTop: 20, height: 400, width: '100%', padding: 10 }} />
    </>
  );
};

export default Dashboard;
