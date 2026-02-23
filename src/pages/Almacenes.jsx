import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Almacenes = () => {
    const [almacenes, setAlmacenes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const tokenActual = localStorage.getItem('token');
        
        // Si no hay token, redirigimos al login de inmediato
        if (!tokenActual) {
            setLoading(false);
            navigate('/login');
            return;
        }

        axios.get('http://127.0.0.1:8000/api/almacenes', {
            headers: { Authorization: `Bearer ${tokenActual}` }
        })
        .then(response => {
            // Manejamos si Laravel devuelve { data: [...] } o solo el array
            const data = response.data.data || response.data;
            setAlmacenes(Array.isArray(data) ? data : []);
        })
        .catch(error => {
            console.error("Error al cargar almacenes:", error);
            // Si el token expiró o no tiene permisos, limpiamos y sacamos al usuario
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        })
        .finally(() => setLoading(false));
    }, [navigate]);

    if (loading) return (
        <div className="flex justify-center items-center h-64 text-gray-500 font-medium">
            Cargando almacenes...
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto mt-10 p-4">
            <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100">
                <div className="bg-blue-600 p-5 flex justify-between items-center">
                    <h2 className="text-white text-xl font-bold tracking-tight">Gestión de Almacenes Municipales</h2>
                    <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-50 transition">
                        + Nuevo Almacén
                    </button>
                </div>
                
                <div className="p-4">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                                    <th className="p-4 border-b">ID</th>
                                    <th className="p-4 border-b">Nombre del Almacén</th>
                                    <th className="p-4 border-b">Tipo</th>
                                    <th className="p-4 border-b text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {almacenes.length > 0 ? (
                                    almacenes.map(almacen => (
                                        <tr key={almacen.id} className="hover:bg-blue-50/30 transition-colors">
                                            <td className="p-4 text-gray-500 text-sm">{almacen.id}</td>
                                            <td className="p-4 font-semibold text-gray-800">{almacen.nombre}</td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    almacen.tipo === 'propio' 
                                                    ? 'bg-green-100 text-green-700' 
                                                    : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                    {almacen.tipo}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                <button className="text-blue-600 hover:text-blue-800 font-medium text-sm mr-4 transition">
                                                    Editar
                                                </button>
                                                <button className="text-red-500 hover:text-red-700 font-medium text-sm transition">
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="p-16 text-center text-gray-400 italic">
                                            No se encontraron almacenes registrados en el sistema.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Almacenes;