import prisma from "../utils/prisma";
import {
  addDays,
  format,
  set,
  addHours,
  differenceInMinutes,
  getMonth,
  getYear,
  isValid,
} from "date-fns";
import { attendance_available_status } from "@prisma/client";
import * as ShiftService from "../services/shifts.service";

interface IAvailableUser {
  employee_id: string;
  status: string;
}

export const getUserAttendance = async (userId: string, date: string) => {
  try {
    // const user: any = await prisma.users.findUnique({
    //   where: { employee_id: userId },
    //   select: {
    //     Doj: true,
    //   },
    // });

    let attendance_start_date = set(new Date(), {
      date: 1,
      hours: 0,
      minutes: 0,
      milliseconds: 0,
    });

    if (date != null && isValid(new Date(date))) {
      attendance_start_date = set(attendance_start_date, {
        month: getMonth(new Date(date)),
        year: getYear(new Date(date)),
      });
    }

    let attendance_end_date = set(attendance_start_date, {
      month: getMonth(attendance_start_date) + 1,
    });

    const emp_attendance = await prisma.attendance.findMany({
      where: {
        employee_id: userId,
        date_in: {
          gte: attendance_start_date,
          lte: attendance_end_date,
        },
      },
      include: {
        breaks: {
          select: {
            break_start: true,
            break_end: true,
          },
        },
      },
    });

    return emp_attendance;
  } catch (e) {
    console.error(e);
    throw Error("Error While Getting User Attendance");
  }
};

export const markUserAttendance = async (userId: string) => {
  try {
    //check if todays attendance is made else mark attendance
    const isUserPresentToday = await userTodayAttendance(userId);

    if (isUserPresentToday != null) {
      return { message: "Attendance Already Marked", status: 409 };
    }

    let shift_in = new Date();
    let shift_out = addHours(new Date(), 9);
    const userShift = await ShiftService.getUserShift(userId);

    if (userShift != null) {
      shift_in = userShift.shift_in;
      shift_out = userShift.shift_out;
    }
    const late_minutes = differenceInMinutes(shift_in, new Date());
    let login_penalty;
    const penalty = await prisma.policies_attedance.findFirst({
      where: {
        start_minutes: {
          gte: late_minutes,
        },
        end_minutes: {
          lte: late_minutes,
        },
      },
    });

    const markAttendance = await prisma.attendance.create({
      data: {
        employee_id: userId,
        shift_in,
        shift_out,
        date_in: new Date(),
        log_in: new Date(),
        status: attendance_available_status.available,
      },
    });
    return markAttendance;
  } catch (error) {
    console.error(error);
    throw Error("Error While Marking User Attendance");
  }
};

export const updateUserAvailibilityStatus = async (
  userId: string,
  attendanceId: any,
  presentAttendanceStatus: string,
  status: attendance_available_status
) => {
  try {
    let shift_time_in = new Date();
    let shift_time_out = new Date();

    if (status == "break") {
      //Break start
      const attendanceUpdate = await prisma.attendance.update({
        where: {
          id: parseInt(attendanceId),
        },
        data: {
          status,
          breaks: {
            create: {
              break_start: new Date(),
            },
          },
        },
      });

      return attendanceUpdate;
    }

    if (
      presentAttendanceStatus == "break" &&
      (status == "available" || status == "salah")
    ) {
      //Break End
      const userLastBreak = await prisma.breaks.findFirst({
        where: {
          attendanceId: attendanceId,
        },
        orderBy: { id: "desc" },
      });

      if (userLastBreak != null) {
        // if break exist and set break end
        const break_id = userLastBreak.id;
        const attendanceUpdate = await prisma.attendance.update({
          where: {
            id: attendanceId,
          },
          data: {
            status,
            breaks: {
              update: {
                where: {
                  id: break_id,
                },
                data: { break_end: new Date() },
              },
            },
          },
        });
        return attendanceUpdate;
      }
    }

    if (
      (presentAttendanceStatus == "available" && status == "salah") ||
      (presentAttendanceStatus == "salah" && status == "available")
    ) {
      const attendanceUpdate = await prisma.attendance.update({
        where: {
          id: parseInt(attendanceId),
        },
        data: {
          status,
        },
      });
      return attendanceUpdate;
    }
  } catch (error) {
    console.error(error);
    throw Error("Error While Updating User Availability Status");
  }
};

export const getUserAvailability = async (userId: string) => {
  //check if today present then get availability status from attendance
  try {
    const isUserPresentToday = await userTodayAttendance(userId);

    if (isUserPresentToday == null) {
      return { status: "unavailable" };
    }

    return { status: isUserPresentToday.status };
  } catch (error) {
    console.error(error);
    throw Error("Error While Getting Availability Status");
  }
};

export const getAvailableUsers = async () => {
  //check if today present then get availability status from attendance
  try {
    let presentUsers: IAvailableUser[] = [];
    const allUsers = await prisma.users.findMany({
      where: {
        NOT: {
          role: "admin",
        },
      },
      select: {
        employee_id: true,
        role: true,
      },
    });

    const result = await allUsers.map(async (user, index) => {
      const isUserPresentToday = await userTodayAttendance(user.employee_id);
      if (isUserPresentToday == null) {
        return;
      }

      const pUser = {
        id: isUserPresentToday.id,
        employee_id: isUserPresentToday.employee_id,
        status: isUserPresentToday.status,
        firstName: isUserPresentToday.user.firstName,
        lastName: isUserPresentToday.user.lastName,
        profile_img: isUserPresentToday.user.passportSizePhoto,
        log_in: isUserPresentToday.log_in,
        shift_in: isUserPresentToday.shift_in,
      };
      presentUsers.push(pUser);
    });
    await Promise.all(result);

    return { users: presentUsers };
  } catch (error) {
    console.error(error);
    throw Error("Error While Getting Availability Status");
  }
};
export const userTodayAttendance = async (userId: string) => {
  let shift_in = new Date();
  let shift_out = addHours(new Date(), 9);
  try {
    const userShift = await ShiftService.getUserShift(userId);

    if (userShift != null) {
      shift_in = userShift.shift_in;
      shift_out = userShift.shift_out;
    }

    const date_in = new Date(format(new Date(), "yyyy-MM-dd"));
    const an_hour_before_shift_log_in = set(shift_in, {
      hours: shift_in.getHours() - 1,
    });

    const checkTodaysAttendance = await prisma.attendance.findFirst({
      where: {
        employee_id: userId,
        date_in,
        log_in: {
          gte: an_hour_before_shift_log_in,
        },
      },
      orderBy: {
        created_at: "desc",
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            passportSizePhoto: true,
            username: true,
          },
        },
      },
    });
    return checkTodaysAttendance;
  } catch (error) {
    console.error(error);
    throw Error("Error While Checking User Attendance for Today");
  }
};

export const markUserLogOff = async (userId: string) => {
  try {
    const userAvailability = await getUserAvailability(userId);
    if (userAvailability.status != "available") {
      throw new Error("Change Status to Available before logOff");
    }
    const userAttendance = await userTodayAttendance(userId);

    const userLogOff = await prisma.attendance.update({
      where: {
        id: userAttendance?.id,
      },
      data: {
        log_out: new Date(),
      },
    });
    return userAttendance;
  } catch (error) {
    throw new Error("Error While ");
  }
};
