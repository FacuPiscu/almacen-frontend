import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import Login from './pages/Login';
import Almacenes from './pages/Almacenes';

// Configuramos Axios para que siempre apunte al Backend de Laravel
axios.defaults.baseURL = 'http://127.0.0.1:8000';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        window.location.href = '/login';
    };

    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-100">
                {/* BARRA DE NAVEGACIÓN */}
                <nav className="bg-white shadow-lg p-4 mb-6 flex justify-between items-center">
                    <Link to="/" className="font-bold text-blue-600 text-xl">🏛️ Almacenes Municipales</Link>
                    <div className="space-x-4 flex items-center">
                        <Link to="/almacenes" className="text-gray-700 hover:text-blue-600 font-medium">Almacenes</Link>
                        
                        {token ? (
                            <button 
                                onClick={handleLogout} 
                                className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition"
                            >
                                Salir
                            </button>
                        ) : (
                            <Link 
                                to="/login" 
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                Entrar
                            </Link>
                        )}
                    </div>
                </nav>

                {/* CONTENIDO PRINCIPAL */}
                <div className="container mx-auto px-4">
                    <Routes>
                        <Route path="/" element={
                            <div className="text-center mt-20">
                                <h1 className="text-4xl font-bold text-gray-800 mb-4">Bienvenido al Sistema</h1>
                                <p className="text-gray-600">Gestión de inventarios y almacenes para el municipio.</p>
                            </div>
                        } />
                        <Route path="/login" element={<Login />} />
                        <Route path="/almacenes" element={<Almacenes />} />
                        {/* Redirigir cualquier otra ruta al inicio */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;