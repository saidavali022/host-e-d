export interface ITableHead {
  order: "asc" | "desc";
  orderBy: string;
  rowCount: number;
  headLabel: string[];
  numSelected: number;
  onRequestSort: Function;
  onSelectAllClick: Function;
}

export interface IBreak {
  break_start: string;
  break_end: string;
}
