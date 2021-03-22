import JSZip from 'jszip';
import { ElementType } from '../enums/element-type';

export type ModificationCallback = (document: Document) => void;
export type GetRelationshipsCallback = (element: Element, rels: Target[]) => void;
export type ShapeCallback = (XMLDocument: XMLDocument, arg1?: Document, arg2?: Workbook) => void;

export type Frame = {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
}

export type AutomizerParams = {
  templateDir?: string;
  outputDir?: string;
}
export type AutomizerSummary = {
  status: string;
  duration: number;
  file: string;
  templates: number;
  slides: number;
  charts: number;
  images: number;
}
export type Target = {
  file: string;
  number?: number;
  rId?: string;
}
export type ImportElement = {
  presName: string;
  slideNumber: number;
  selector: string;
  mode: string;
  callback?: ShapeCallback | ShapeCallback[];
}
export type ImportedElement = {
  mode: string;
  name?: string;
  sourceArchive: JSZip;
  sourceSlideNumber: number;
  callback?: ImportElement['callback'];
  target?: AnalyzedElementType['target'];
  type?: AnalyzedElementType['type'];
  sourceElement?: AnalyzedElementType['element'];
}
export type AnalyzedElementType = {
  type: ElementType;
  target?: Target;
  element?: XMLDocument;
}
export type TargetByRelIdMapParam = {
  relRootTag: string;
  relAttribute: string;
  prefix: string;
  expression?: RegExp;
}
export type Workbook = {
  archive: JSZip;
  sheet: XMLDocument;
  sharedStrings: XMLDocument;
  table: XMLDocument;
}
export type ChartSeries = {
  label: string;
}
export type ChartCategory = {
  label: string;
  values: number[];
}
export type ChartData = {
  series: ChartSeries[];
  categories: ChartCategory[];
}