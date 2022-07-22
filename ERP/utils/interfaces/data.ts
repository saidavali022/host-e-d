export interface IUserData {
  name: string;
  first_name: string;
  last_name: string;
  dob: Date;
  doj: Date;
  avatar: string; //image path
}

export interface IAttandanceData {
  date: string;
  log_in: string;
  log_out: string;
  break_1: string;
  break_2: string;
}

export interface ITaskData {
  assigned_on: Date; //created at
  title: string;
  description: string;
  start_date: Date;
  end_date: Date;
  Status: "pending" | "completed" | "draft";
}

export interface IBreak {
  break_start: Date;
  break_end: Date;
}
