export interface DocumentoSubido {
  id: number;
  usuario: number;
  nombre_original: string;
  tipo: 'pdf' | 'imagen' | 'texto';
  archivo_url: string;
  fecha_subida: string;
}

export interface CampoDisponible {
  id: number;
  nombre: string;
  tipo_dato: 'texto' | 'fecha' | 'numero';
}

export interface TipoPlantillaDocumento {
  id: number;
  nombre: string;
}

export interface CategoriaPlantillaDocumento {
  id: number;
  nombre: string;
}

export interface MateriaPlantillaDocumento {
  id: number;
  nombre: string;
}

export interface CampoPlantilla {
  id: number;
  campo: number;
  nombre_variable: string;
  campo_nombre: string;
  campo_tipo: string;
}

export interface PlantillaDocumento {
  id: number;
  nombre: string;
  descripcion: string;
  html_con_campos: string;
  usuario: number;
  tipo?: TipoPlantillaDocumento;
  categoria?: CategoriaPlantillaDocumento;
  materia?: MateriaPlantillaDocumento;
  tipo_info?: {
    id: number;
    nombre: string;
  };
    categoria_info?: {
        id: number;
        nombre: string;
    };
    materia_info?: {
        id: number;
        nombre: string;
    };
  fecha_creacion: string;
  campos_asociados: CampoPlantilla[];
  es_favorito?: boolean;
  fecha_agregado_favorito?: string;
}

export interface DocumentoGenerado {
  id: number;
  plantilla: number;
  usuario: number;
  datos_rellenados: Record<string, any>;
  html_resultante: string;
  fecha_generacion: string;
  plantilla_nombre: string;
  usuario_username: string;
}

export interface CrearPlantillaData {
  nombre: string;
  descripcion?: string;
  html_con_campos: string;
  tipo_id?: number;
  materia_id?: number;
  categoria_id?: number;
  campos?: Array<{
    campo_id: number;
    nombre_variable: string;
  }>;
}

export interface GenerarDocumentoData {
  plantilla_id: number;
  datos: Record<string, any>;
}

export interface SubirDocumentoResponse {
  id: number;
  html: string;
  tipo: string;
  nombre_original: string;
}

export interface PlantillaCompartida {
  id: number;
  plantilla: number;
  plantilla_nombre: string;
  usuario: number;
  usuario_username: string;
  permisos: 'lectura' | 'edicion';
  fecha_compartida: string;
}