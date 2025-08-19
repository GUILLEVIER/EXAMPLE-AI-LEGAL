import axios from 'axios';
import {
  DocumentoSubido,
  CampoDisponible,
  PlantillaDocumento,
  DocumentoGenerado,
  CrearPlantillaData,
  GenerarDocumentoData,
  SubirDocumentoResponse,
  TipoPlantillaDocumento,
  PlantillaCompartida,
} from '../types';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token JWT a cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers = config.headers || {};
      // @ts-ignore
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

// Documentos subidos
export const subirDocumento = async (archivo: File): Promise<SubirDocumentoResponse> => {
  const formData = new FormData();
  console.log("archivo: ", archivo);
  formData.append('archivo', archivo);
  
  const response = await api.post('/documents/v1/documentos-subidos/subir_documento/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data;
};

export const getDocumentosSubidos = async (): Promise<DocumentoSubido[]> => {
  const response = await api.get('/documents/v1/documentos-subidos/');
  return response.data.data;
};

// Campos disponibles
export const getCamposDisponibles = async (): Promise<CampoDisponible[]> => {
  const response = await api.get('/documents/v1/campos-disponibles/');
  return response.data.data.results;
};

export const crearCampoDisponible = async (campo: Omit<CampoDisponible, 'id'>): Promise<CampoDisponible> => {
  const response = await api.post('/documents/v1/campos-disponibles/', campo);
  return response.data.data.results;
};

// Plantillas
export const getPlantillas = async (): Promise<PlantillaDocumento[]> => {
  const response = await api.get('/documents/v1/plantillas-documentos/');
  return response.data.data;
};

export const crearPlantilla = async (plantillaData: CrearPlantillaData): Promise<{ id: number; mensaje: string }> => {
  const response = await api.post('/documents/v1/plantillas-documentos/crear_plantilla/', plantillaData);
  return response.data.data.results;
};

export const duplicarPlantilla = async (plantillaData: CrearPlantillaData): Promise<PlantillaDocumento> => {
  const response = await api.post('/documents/v1/plantillas-documentos/crear_plantilla/', plantillaData);
  return response.data.data.results;
};

export const getPlantilla = async (id: number): Promise<PlantillaDocumento> => {
  const response = await api.get(`/documents/v1/plantillas-documentos/${id}/`);
  return response.data.data;
};

export const generarDocumento = async (plantillaId: number, datos: Record<string, any>, nombre?: string): Promise<{
  id: number;
  html_resultante: string;
  mensaje:  string;
}> => {
  const payload: any = { plantilla_id: plantillaId, datos };
  if (nombre) payload.nombre = nombre;
  console.log("payload: ", payload);
  const response = await api.post(`/documents/v1/plantillas-documentos/${plantillaId}/generar_documento/`, payload);
  return response.data.data;
};

// Tribunales
export async function obtenerTribunales(): Promise<any[]> {
  const response = await api.get('/companies/v1/tribunales/');
  return Array.isArray(response?.data?.data?.results) ? response.data.data.results : [];
}

// Documentos generados
export const getDocumentosGenerados = async (): Promise<DocumentoGenerado[]> => {
  const response = await api.get('/documents/v1/documentos-generados/');
  console.log("getDocumentosGenerados: ", response.data.data.results)
  return response.data.data.results;
};

export const getDocumentoGenerado = async (id: number): Promise<DocumentoGenerado> => {
  const response = await api.get(`/documents/v1/documentos-generados/${id}/`);
  return response.data.data;
};

// Favoritos
export const agregarFavorito = async (plantillaId: number): Promise<{ message: string }> => {
  const response = await api.post('/documents/v1/plantillas-favoritas/agregar_favorito/', { plantilla_id: plantillaId });
  return response.data.data;
};

export const quitarFavorito = async (plantillaId: number): Promise<{ message: string }> => {
  const response = await api.delete('/documents/v1/plantillas-favoritas/quitar_favorito/', { data: { plantilla_id: plantillaId } });
  return response.data.data;
};

export const getMisFavoritos = async (): Promise<PlantillaDocumento[]> => {
  const response = await api.get('/documents/v1/plantillas-favoritas/mis_favoritos/');
  return response.data.data;
};

// Tipos de plantilla
export const getTiposPlantilla = async (): Promise<TipoPlantillaDocumento[]> => {
  const response = await api.get('/documents/v1/tipos-plantilla/');
  return response.data.data.results;
};

export const crearTipoPlantilla = async (tipo: Omit<TipoPlantillaDocumento, 'id'>): Promise<TipoPlantillaDocumento> => {
  const response = await api.post('/documents/v1/tipos-plantilla/', tipo);
  return response.data.data.results;
}; 

// Compartir plantilla con usuario
export const compartirPlantilla = async (
  plantillaId: number,
  usuarioId?: number,
  permisos: 'lectura' | 'edicion' = 'lectura',
  usuarioIds?: number[]
) => {
  const data: any = { plantilla_id: plantillaId, permisos };
  if (usuarioIds && usuarioIds.length > 0) {
    data.usuario_ids = usuarioIds;
  } else if (usuarioId) {
    data.usuario_id = usuarioId;
  }
  return api.post('/documents/v1/plantillas-compartidas/compartir/', data);
};

// Revocar acceso a una plantilla compartida
export const revocarCompartida = async (compartidaId: number): Promise<{ message: string }> => {
  const response = await api.delete(`/documents/v1/plantillas-compartidas/${compartidaId}/revocar/`);
  return response.data.data;
};

// Listar plantillas compartidas conmigo
export const getPlantillasCompartidasConmigo = async (): Promise<PlantillaCompartida[]> => {
  const response = await api.get('/documents/v1/plantillas-compartidas/compartidas_conmigo/');
  return response.data.data;
}; 

// Eliminar plantilla
export const eliminarPlantilla = async (id: number) => {
  console.log(id)
  return api.delete(`/documents/v1/plantillas-documentos/${id}/`);
};

// Eliminar Documento Generado
export const eliminarDocumentoGenerado = async (id: number) => {
  console.log(id)
  return api.delete(`/documents/v1/documentos-generados/${id}/`);
};

// Actualizar plantilla (PATCH)
export const actualizarPlantilla = async (id: number, data: any) => {
  return api.patch(`/documents/v1/plantillas-documentos/${id}/`, data);
}; 

export interface UsuarioSimple {
  id: number;
  username: string;
  email: string;
}

export const getUsuarios = async (): Promise<UsuarioSimple[]> => {
  const response = await api.get('/documents/v1/usuarios/');
  console.log("usuarios: ", response.data)
  return response.data.data;
}; 

export interface UsuarioCompartido {
  id: number;
  usuario: number;
  usuario_username: string;
  usuario_email: string;
  permisos: 'lectura' | 'edicion';
  fecha_compartida: string;
}

export const getUsuariosCompartidos = async (plantillaId: number): Promise<UsuarioCompartido[]> => {
  const response = await api.get(`/documents/v1/plantillas-compartidas/usuarios_compartidos/?plantilla_id=${plantillaId}`);
  console.log("getUsuariosCompartidos: ", response.data)
  return response.data.data;
}; 