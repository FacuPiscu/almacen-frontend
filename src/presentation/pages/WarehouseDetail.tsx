import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Pencil, Trash, Building2, PackagePlus, ArrowRightLeft, Camera, QrCode, ClipboardCheck } from 'lucide-react';
import { Warehouse, Zone } from '../../core/domain/types';
import { warehouseRepository } from '../../infrastructure/repositories/MockWarehouseRepository';
import '../../styles/Pages.css';
import '../../styles/WarehouseDetail.css';

interface Item {
  id: string;
  categoryName: string;
  name: string;
  description: string;
  trackingCode: string;
}

const MOCK_ZONES: Zone[] = [
  { id: '1', warehouseId: '1', name: 'Pasillo A', capacity: 100 },
  { id: '2', warehouseId: '1', name: 'Estante B', capacity: 50 },
];

const MOCK_ITEMS: Item[] = [
  { id: '1', categoryName: 'Ferretería', name: 'Tornillo Mariposa', description: 'Tornillos de 5mm', trackingCode: 'TRN-001' },
  { id: '2', categoryName: 'Electrónica', name: 'Cable HDMI', description: 'Cable de 2 metros', trackingCode: 'CBL-022' },
];

const WarehouseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [zones, setZones] = useState<Zone[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'zones' | 'items' | 'categories' | 'operations'>('zones');
  
  // Modals state
  const [isReceptionModalOpen, setIsReceptionModalOpen] = useState(false);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (id) {
      warehouseRepository.getById(id).then((data) => {
        setWarehouse(data || null);
        setZones(MOCK_ZONES);
        setItems(MOCK_ITEMS);
        setLoading(false);
      });
    }
  }, [id]);

  const handleSimulateAction = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setter(false);
    }, 1500);
  };

  if (loading) return <div className="page-wrapper"><div className="loading-state">Cargando detalles del almacén...</div></div>;
  if (!warehouse) return <div className="page-wrapper"><div className="error-state">Almacén no encontrado</div></div>;

  return (
    <div className="page-wrapper animate-fade-in warehouse-detail">
      <div className="detail-header-nav">
        <button className="btn-link" onClick={() => navigate('/warehouses')}>
          &larr; Volver a Almacenes
        </button>
        <span className="separator">/</span>
        <span className="current-warehouse">{warehouse.name}</span>
      </div>

      <div className="card warehouse-hero">
        <div className="hero-info">
          <div className="hero-icon"><Building2 size={40} style={{ color: '#047857' }} /></div>
          <div>
            <h1 className="hero-title">{warehouse.name}</h1>
            <div className="hero-meta">
              <span className="badge badge-primary">{warehouse.location}</span>
              <span className="text-light">{warehouse.description}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="tabs-container">
        <button
          onClick={() => setActiveTab('zones')}
          className={`tab-btn ${activeTab === 'zones' ? 'active' : ''}`}
        >
          Infraestructura (Zonas)
        </button>
        <button
          onClick={() => setActiveTab('items')}
          className={`tab-btn ${activeTab === 'items' ? 'active' : ''}`}
        >
          Stock de Artículos
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
        >
          Categorías
        </button>
        <button
          onClick={() => setActiveTab('operations')}
          className={`tab-btn ${activeTab === 'operations' ? 'active' : ''}`}
        >
          Operaciones (Ingreso)
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'zones' && (
          <div className="zones-section animate-fade-in">
            <div className="section-header">
              <h2>Zonas y Ubicaciones</h2>
              <button className="btn btn-primary">+ Nueva Zona</button>
            </div>
            
            <div className="grid-container">
              {zones.length > 0 ? (
                zones.map((zone) => (
                  <div key={zone.id} className="card zone-card">
                    <div className="zone-header">
                      <div className="zone-icon-wrapper">
                        <MapPin className="icon-map-pin" />
                      </div>
                      <div className="zone-actions">
                        <button className="icon-btn edit-btn"><Pencil className="icon-sm" /></button>
                        <button className="icon-btn delete-btn"><Trash className="icon-sm text-danger" /></button>
                      </div>
                    </div>
                    <h3 className="zone-title">{zone.name}</h3>
                    <p className="zone-desc">Capacidad: {zone.capacity}</p>
                  </div>
                ))
              ) : (
                <div className="empty-state">No hay zonas configuradas en este almacén</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'items' && (
          <div className="items-section animate-fade-in">
            <div className="section-header">
              <h2>Inventario / Artículos</h2>
              <button className="btn btn-primary">+ Nuevo Artículo</button>
            </div>
            
            <div className="card table-container">
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Código / SKU</th>
                    <th>Nombre del Artículo</th>
                    <th>Categoría</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length > 0 ? (
                    items.map((item) => (
                      <tr key={item.id}>
                        <td className="tracking-code">{item.trackingCode}</td>
                        <td className="item-name">{item.name}</td>
                        <td><span className="badge category-badge">{item.categoryName}</span></td>
                        <td className="actions-cell">
                          <button className="icon-btn edit-btn"><Pencil className="icon-sm" /></button>
                          <button className="icon-btn delete-btn"><Trash className="icon-sm text-danger" /></button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="empty-state">No hay artículos registrados en este almacén</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="categories-section animate-fade-in">
            <div className="section-header">
              <h2>Categorías de Artículos</h2>
              <button className="btn btn-primary">+ Nueva Categoría</button>
            </div>
            
            <div className="card">
              <div className="empty-state">Las categorías específicas de este almacén se mostrarán aquí.</div>
            </div>
          </div>
        )}

        {activeTab === 'operations' && (
          <div className="operations-section animate-fade-in">
            <div className="section-header">
              <h2>Flujos de Ingreso Logístico</h2>
            </div>
            
            <div className="operations-grid">
              <div className="card operation-card">
                <div className="op-icon bg-blue-light text-blue">
                  <PackagePlus size={32} />
                </div>
                <div className="op-info">
                  <h3>Nueva Recepción</h3>
                  <p>Registra la llegada de nuevos bultos o embarques al almacén general.</p>
                </div>
                <button 
                  className="btn btn-large btn-blue"
                  onClick={() => setIsReceptionModalOpen(true)}
                >
                  Iniciar Recepción
                </button>
              </div>

              <div className="card operation-card">
                <div className="op-icon bg-green-light text-green">
                  <ArrowRightLeft size={32} />
                </div>
                <div className="op-info">
                  <h3>Almacenar Artículo</h3>
                  <p>Asigna un artículo previamente recibido a una zona específica del almacén.</p>
                </div>
                <button 
                  className="btn btn-large btn-green"
                  onClick={() => setIsStoreModalOpen(true)}
                >
                  Asignar a Zona
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Nueva Recepción */}
      {isReceptionModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in">
            <div className="modal-header">
              <h3>Registrar Nueva Recepción</h3>
              <button className="close-btn" onClick={() => !isProcessing && setIsReceptionModalOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Cantidad Recibida (Unidades/Bultos)</label>
                <input type="number" className="form-control" placeholder="Ej: 15" disabled={isProcessing} />
              </div>
              <div className="form-group">
                <label className="form-label">Estado Físico del Embarque</label>
                <select className="form-control" disabled={isProcessing}>
                  <option>Seleccione estado...</option>
                  <option>Óptimo (Sin daños visibles)</option>
                  <option>Regular (Empaque defectuoso pero contenido intacto)</option>
                  <option>Deficiente (Daños reportados)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Captura de Fotografía del Embarque</label>
                <div className="camera-placeholder">
                  <Camera size={48} className="text-light mb-2" />
                  <span>Tocar para usar la cámara</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary mr-2" 
                onClick={() => setIsReceptionModalOpen(false)}
                disabled={isProcessing}
              >
                Cancelar
              </button>
              <button 
                className="btn btn-primary bg-blue flex-center" 
                onClick={() => handleSimulateAction(setIsReceptionModalOpen)}
                disabled={isProcessing}
              >
                {isProcessing ? 'Procesando...' : <><ClipboardCheck size={18} className="mr-2" /> Confirmar Recepción</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Almacenar Artículo */}
      {isStoreModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in">
            <div className="modal-header">
              <h3>Almacenar Artículo en Zona</h3>
              <button className="close-btn" onClick={() => !isProcessing && setIsStoreModalOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Seleccionar Lote/Artículo Recibido</label>
                <select className="form-control" disabled={isProcessing}>
                  <option>Seleccione un artículo en espera...</option>
                  <option>Lote-001 - Tornillo Mariposa (15x)</option>
                  <option>Lote-002 - Cable HDMI (50x)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Asignar a Zona Destino</label>
                <select className="form-control" disabled={isProcessing}>
                  <option>Seleccione una zona de este almacén...</option>
                  {zones.map((z) => (
                    <option key={z.id} value={z.id}>{z.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="sku-generator">
                <button className="btn btn-outline" disabled={isProcessing}>
                  <QrCode size={20} className="mr-2" /> Generar Etiqueta / SKU
                </button>
                <p className="text-light text-small mt-2 text-center">
                  Al hacer clic se generará un código único para impresión rápida.
                </p>
              </div>

            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary mr-2" 
                onClick={() => setIsStoreModalOpen(false)}
                disabled={isProcessing}
              >
                Cancelar
              </button>
              <button 
                className="btn btn-primary bg-green flex-center" 
                onClick={() => handleSimulateAction(setIsStoreModalOpen)}
                disabled={isProcessing}
              >
                {isProcessing ? 'Procesando...' : <><ArrowRightLeft size={18} className="mr-2" /> Completar Almacenamiento</>}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default WarehouseDetail;
