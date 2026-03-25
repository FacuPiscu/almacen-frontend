
import { Routes, Route, Navigate } from 'react-router-dom';

import MainLayout from './presentation/layouts/MainLayout';
import AuthLayout from './presentation/layouts/AuthLayout';
// Pages
import Login from './presentation/pages/Login';
import Dashboard from './presentation/pages/Dashboard';
import Warehouses from './presentation/pages/Warehouses';
import WarehouseDetail from './presentation/pages/WarehouseDetail';

// Componente principal de enrutamiento
const App = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/warehouses" element={<Warehouses />} />
        <Route path="/warehouses/:id" element={<WarehouseDetail />} />
      </Route>

      {/* Redirección predeterminada para el sistema */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
