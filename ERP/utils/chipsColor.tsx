import {
  fDate,
  fTime,
  fToNow,
  fformatRelative,
  fTimeDistanceInMinutes,
  fdifferenceInMinutes,
} from "@utils/formatTime";
import Label from "@components/Label";

export function leaveColorChip(leave_status: string) {
  if (leave_status == "accepted") return "primary";
  if (leave_status == "rejected") return "error";
  if (leave_status == "pending") return "warning";
}

export function colorStatusPriority(status: string) {
  if (status === "high") return "error";
  if (status === "medium") return "warning";
  if (status === "low") return "primary";
}

export function colorStatusInvert(status: string) {
  if (status === "high") return "primary";
  if (status === "medium") return "warning";
  if (status === "low") return "error";
}

interface IBreak {
  break_start: string;
  break_end: string;
}

export function renderBreakPills(breaks: IBreak[]) {
  const breaks_time = breaks.map((b: IBreak) => {
    if (b.break_end == null) {
      return "-";
    }
    return fTimeDistanceInMinutes(b.break_start, b.break_end);
  });
  let total_break_time = 0;
  return breaks_time.map((b) => {
    total_break_time += parseInt(b);
    if (total_break_time > 60) {
      return (
        <Label variant="ghost" color="error">
          {b} Min
        </Label>
      );
    }
    return <Label variant="ghost"> {b} Min </Label>;
  });
}

function getSum(total: number, num: number) {
  return total + Math.floor(num);
}

export function getTotalBreakTime(b: IBreak[]) {
  let breaks_minutes = b.map((b: IBreak) => {
    if (b.break_end == null) {
      return fdifferenceInMinutes(b.break_start, b.break_start);
    }
    return fdifferenceInMinutes(b.break_start, b.break_end);
  });
  const total_break_time = breaks_minutes.reduce(getSum, 0);
  return Math.abs(total_break_time);
}
