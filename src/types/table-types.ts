import {Color} from './modify-types';

export type TableRow = {
  label?: string;
  values: (string | number)[];
  styles?: TableRowStyle[];
};

export type TableRowStyle = {
  color: Color
}

export type TableData = {
  header?: TableRow | TableRow[];
  body?: TableRow[];
  footer?: TableRow | TableRow[];
};

export type ModifyTableParams = {
  adjustWidth: boolean;
  adjustHeight: boolean;
};
