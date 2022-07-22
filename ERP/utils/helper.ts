import { differenceInMinutes } from "date-fns";

interface IBreak {
  break_start: string;
  break_end: string;
}

export function allBreaks(bb: IBreak[]) {
  const breaks: Array<number> = bb.map((b) =>
    differenceInMinutes(new Date(b.break_end), new Date(b.break_start))
  );
  let break_time: number = 0;
  let cellData: string = "";
  let maps = breaks.forEach((time) => {
    break_time += time;
    console.log("b", break_time);
    if (break_time > 60) {
      cellData += time + " e";
    } else {
      cellData += time + " ";
    }
  });
  return "x";
}
