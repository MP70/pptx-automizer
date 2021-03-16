import JSZip from "jszip";
import { ElementType } from "./enums";

export type AutomizerParams = {
	templateDir?: string
	outputDir?: string
}

export type AutomizerSummary = {
	status: string
	file: string
	templates: number
	slides: number
	charts: number
	images: number
}

export interface ICounter {
  set(): void | PromiseLike<void>
	get(): number
	name: string
	count: number
  _increment(): number;
}

export interface ISlide {
  append(): Promise<void>
  setTarget(targetTemplate: RootPresTemplate): void
  addElement(presName: string, slideNumber: number, selector: Function | string): void
	sourceArchive: JSZip
	sourceNumber: number
	modifications: Function[]
	modify: Function
}

export interface IPresentationProps {
	rootTemplate: RootPresTemplate
	templates: PresTemplate[]
	template(name: string): PresTemplate
	params: AutomizerParams
}

export interface ITemplate {
	location: string
	file: Promise<Buffer>
	archive: Promise<JSZip>
}

export interface RootPresTemplate extends ITemplate {
	slides: ISlide[]
	counter: ICounter[]
  count(name: string): number
  incrementCounter(name: string): number
  appendSlide(slide: ISlide): Promise<void>
}

export interface PresTemplate extends ITemplate {
	name: string
}

export interface IShape {
	sourceArchive: JSZip
	targetArchive: JSZip
}

export interface IChart extends IShape {
  append: Function
	sourceNumber: number
	targetNumber: number
}

export interface IImage extends IShape {
  append: Function
	sourceFile: string
	targetFile: string
	contentTypeMap: any
}
  
export type Target = {
	file: string
	number: number
	rId?: string
}

export type ImportedElement = {
	sourceArchive: JSZip
	sourceSlideNumber: number
	target: Target
	type: ElementType
	callback: any
}

export type AnalyzedElementType = {
	type: ElementType
	target?: Target
}
