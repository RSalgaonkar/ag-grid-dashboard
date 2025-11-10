import React, { useEffect, useState, useMemo, useRef } from 'react';
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
  const [showChart, setShowChart] = useState(false);
  const gridRef = useRef();
  const chartContainerRef = useRef(null);
  const [chartType, setChartType] = useState('groupedBar');
  const [debouncedFilterText, setDebouncedFilterText] = useState("");
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    if (showChart && gridRef.current && chartContainerRef.current) {
      chartContainerRef.current.innerHTML = '';

      gridRef.current.api.createRangeChart({
        cellRange: { columns: ['country', 'age'] },
        chartType: chartType,
        chartContainer: chartContainerRef.current,
        aggFunc: 'avg',
        processChartOptions: (params) => {
          params.options.title.text = 'Average Age by Country';
          params.options.legendPosition = 'bottom';
          return params.options;
        }
      });
    }
  }, [showChart, chartType]);

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
  const value = e.target.value;
  setFilterText(value);

  if (debounceTimerRef.current) {
    clearTimeout(debounceTimerRef.current);
  }

  debounceTimerRef.current = setTimeout(() => {
    setDebouncedFilterText(value);
  }, 300); // debounce delay 300ms
};


  const filteredRows = useMemo(() => {
    if (!debouncedFilterText) return rowData;
    return rowData.filter(row =>
      row.name.toLowerCase().includes(debouncedFilterText.toLowerCase()) ||
      row.country.toLowerCase().includes(debouncedFilterText.toLowerCase())
    );
  }, [rowData, debouncedFilterText]);

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
        <TextField
          select
          label="Chart Type"
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
          SelectProps={{
            native: true,
          }}
        >
          <option value="groupedBar">Grouped Bar Chart</option>
          <option value="pie">Pie Chart</option>
          <option value="line">Line Chart</option>
          <option value="stackedBar">Stacked Bar Chart</option>
        </TextField>

        <Button variant="contained" onClick={addMoreRows}>Add 5 More Users</Button>
        <Button  variant="outlined" onClick={() => setShowChart(true)}>Show Age by Country Chart</Button>

      </Stack>
      <div className="ag-theme-balham" style={{ height: 400, width: '100%' }}>
        <AgGridReact
          ref={gridRef}
          rowData={filteredRows}
          columnDefs={columnDefs}
          enableCharts={true}
          // rowSelection="multiple"
          defaultColDef={{ flex: 1, minWidth: 100, filter: true, sortable: true }}
          animateRows={true}
          pagination={true}
          paginationPageSize={20}
          theme={myTheme}
        />

      </div>
      {showChart && <Paper ref={chartContainerRef} style={{ height: 400, marginTop: 20, width: '100%' }} />}
    </>
  );
};

export default Dashboard;
