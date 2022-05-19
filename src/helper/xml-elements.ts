import { Color } from '../types/modify-types';
import { XmlHelper } from './xml-helper';
import { vd } from './general-helper';
import * as fs from 'fs';
import { DOMParser } from 'xmldom';

export type XmlElementParams = {
  color?: Color;
};

export default class XmlElements {
  element: XMLDocument | Element;
  document: XMLDocument;
  params: XmlElementParams;

  constructor(element: XMLDocument | Element, params?: XmlElementParams) {
    this.element = element;
    this.document = element.ownerDocument;
    this.params = params;
  }

  text(): this {
    const r = this.document.createElement('a:r');
    r.appendChild(this.textRangeProps());
    r.appendChild(this.textContent());

    const previousSibling = this.element.getElementsByTagName('a:pPr')[0];
    XmlHelper.insertAfter(r, previousSibling);

    return this;
  }

  textRangeProps() {
    const rPr = this.document.createElement('a:rPr');
    const endParaRPr = this.element.getElementsByTagName('a:endParaRPr')[0];
    rPr.setAttribute('lang', endParaRPr.getAttribute('lang'));
    rPr.setAttribute('sz', endParaRPr.getAttribute('sz'));

    rPr.appendChild(this.line());
    rPr.appendChild(this.effectLst());
    rPr.appendChild(this.lineTexture());
    rPr.appendChild(this.fillTexture());

    return rPr;
  }

  textContent(): Element {
    const t = this.document.createElement('a:t');
    t.textContent = ' ';
    return t;
  }

  effectLst(): Element {
    return this.document.createElement('a:effectLst');
  }

  lineTexture(): Element {
    return this.document.createElement('a:uLnTx');
  }

  fillTexture(): Element {
    return this.document.createElement('a:uFillTx');
  }

  line(): Element {
    const ln = this.document.createElement('a:ln');
    const noFill = this.document.createElement('a:noFill');
    ln.appendChild(noFill);
    return ln;
  }

  solidFill(): Element {
    const solidFill = this.document.createElement('a:solidFill');
    const colorType = this.colorType();
    solidFill.appendChild(colorType);
    return solidFill;
  }

  colorType(): Element {
    const tag = 'a:' + (this.params?.color?.type || 'srgbClr');
    const colorType = this.document.createElement(tag);
    this.colorValue(colorType);
    return colorType;
  }

  colorValue(colorType: Element) {
    colorType.setAttribute('val', this.params?.color?.value || 'cccccc');
  }

  dataPoint(): this {
    const dPt = this.document.createElement('c:dPt');
    dPt.appendChild(this.idx());
    dPt.appendChild(this.spPr());

    const nextSibling = this.element.getElementsByTagName('c:cat')[0];
    if (nextSibling) {
      nextSibling.parentNode.insertBefore(dPt, nextSibling);
    }

    return this;
  }

  spPr(): Element {
    const spPr = this.document.createElement('c:spPr');
    spPr.appendChild(this.solidFill());
    spPr.appendChild(this.line());
    spPr.appendChild(this.effectLst());

    return spPr;
  }

  idx(): Element {
    const idx = this.document.createElement('c:idx');
    idx.setAttribute('val', String(0));
    return idx;
  }

  cellBorder(tag: 'lnL' | 'lnR' | 'lnT' | 'lnB'): this {
    const border = this.document.createElement(tag);

    border.appendChild(this.solidFill());
    border.appendChild(this.prstDash());
    border.appendChild(this.round());
    border.appendChild(this.lineEnd('headEnd'));
    border.appendChild(this.lineEnd('tailEnd'));

    return this;
  }

  prstDash() {
    const prstDash = this.document.createElement('a:prstDash');
    prstDash.setAttribute('val', 'solid');
    return prstDash;
  }

  round() {
    const round = this.document.createElement('a:round');
    return round;
  }

  lineEnd(type: 'headEnd' | 'tailEnd') {
    const lineEnd = this.document.createElement(type);
    lineEnd.setAttribute('type', 'none');
    lineEnd.setAttribute('w', 'med');
    lineEnd.setAttribute('len', 'med');
    return lineEnd;
  }

  shapeProperties() {
    const spPr = this.spPr();
    this.element.appendChild(spPr);
  }

  dataPointLabel() {
    const xml = fs.readFileSync(__dirname + '/xml/dLbl.xml');
    const doc = new DOMParser().parseFromString(xml.toString());
    const ele = doc.getElementsByTagName('c:dLbl')[0];
    const firstChild = this.element.firstChild;
    this.element.insertBefore(ele.cloneNode(true), firstChild);
  }
}
