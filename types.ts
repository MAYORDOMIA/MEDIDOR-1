
import React from 'react';

export type OpeningTypeId = 
  | 'sliding_2' 
  | 'sliding_3' 
  | 'sliding_4' 
  | 'desplazable'
  | 'oscilobatiente' 
  | 'pano_fijo' 
  | 'puerta_pivot_izq'
  | 'puerta_pivot_der'
  | 'ventana_rebatir_1_izq' 
  | 'ventana_rebatir_1_der' 
  | 'ventana_rebatir_2_izq'
  | 'ventana_rebatir_2_der'
  | 'puerta_rebatir_1_izq' 
  | 'puerta_rebatir_1_der'
  | 'puerta_rebatir_1_media_izq' 
  | 'puerta_rebatir_1_media_der'
  | 'puerta_rebatir_1_ciega_izq'
  | 'puerta_rebatir_1_ciega_der'
  | 'puerta_rebatir_2_izq'
  | 'puerta_rebatir_2_der'
  | 'puerta_rebatir_2_media_izq'
  | 'puerta_rebatir_2_media_der'
  | 'puerta_rebatir_2_ciega_izq'
  | 'puerta_rebatir_2_ciega_der'
  | 'ventiluz'
  | 'banderola'
  | 'espejo_redondo'
  | 'espejo_recto'
  | 'mampara_fija'
  | 'mampara_abrir_izq'
  | 'mampara_abrir_der'
  | 'mampara_corrediza'
  | 'vidriera_fija'
  | 'puerta_vidrio_zocalon_izq'
  | 'puerta_vidrio_zocalon_der';

export interface OpeningType {
  id: OpeningTypeId;
  name: string;
  icon: React.ReactNode;
}

export interface MeasurementModule {
  typeId: OpeningTypeId;
  x: number;
  y: number;
}

export interface TapajuntasConfig {
  top: boolean;
  bottom: boolean;
  left: boolean;
  right: boolean;
}

export interface Measurement {
  id: string;
  code: string;
  modules: MeasurementModule[]; 
  width: number;
  height: number;
  location: string;
  color: string;
  glass: string;
  tapajuntas: TapajuntasConfig;
  notes: string;
  createdAt: number;
  rowRatios?: number[]; 
  colRatios?: number[]; 
}

export interface Project {
  id: string;
  name: string;
  client: string;
  address: string;
  color?: string;
  line?: string;
  glass?: string;
  measurements: Measurement[];
  createdAt: number;
}
