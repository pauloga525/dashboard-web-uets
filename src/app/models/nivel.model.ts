/**
 * @file nivel.model.ts
 * @description Modelo de datos para los niveles académicos del sitio público.
 */

export interface NivelKeyFact {
  id: number;
  icon: string;
  title: string;
  value: string;
}

export interface NivelCurriculumHighlight {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export interface NivelSubject {
  id: number;
  name: string;
}

export interface NivelConfig {
  nivelId: string;

  // Hero
  heroImagenFondo: string;
  heroBadge: string;
  levelName: string;
  levelDescription: string;

  // Overview
  sectionTitle: string;
  sectionDescription: string;
  sectionExtra: string;
  keyFacts: NivelKeyFact[];

  // Curriculum
  curriculumHighlights: NivelCurriculumHighlight[];
  subjects: NivelSubject[];

  // Environment
  environmentTitle: string;
  environmentDescription: string;
  environmentImagen: string;

  // CTA
  ctaDescripcion: string;
}
