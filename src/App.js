import './App.css';
import Container from '@mui/material/Container';
// import Typography from '@mui/material/Typography';
import Dashboard from "./pages/Dashboard";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import CssBaseline from '@mui/material/CssBaseline';
import { IntegratedChartsModule, RowGroupingModule, PivotModule, TreeDataModule } from 'ag-grid-enterprise';
import { AgChartsEnterpriseModule } from 'ag-charts-enterprise';

function App() {
  ModuleRegistry.registerModules([AllCommunityModule, RowGroupingModule, PivotModule, TreeDataModule, IntegratedChartsModule.with(AgChartsEnterpriseModule)]);

  return (
    <>
      <CssBaseline />
      <Container maxWidth="md" style={{ marginTop: '2rem' }}>
        {/* <Typography variant="h4" component="h1" gutterBottom>
          AG Grid React Dashboard
        </Typography> */}
        <Dashboard />
      </Container>
    </>
  );

}

export default App;
