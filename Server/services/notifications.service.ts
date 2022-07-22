import prisma from "../utils/prisma";
export const get = async (req: any, res: any) => {
  try {
    return await prisma.employee_notification.findMany({});
  } catch (error) {
    throw new Error("Error While getting all users notifications");
  }
};

export const getById = async (req: any, res: any) => {
  try {
    return await prisma.employee_notification.findMany({
      where: {
        receiver_employee_id: req.params.empId,
      },
    });
  } catch (error) {
    throw new Error("Error While getting user notification");
  }
};

export const postData = async (req: any, res: any) => {
  return await prisma.employee_notification.create({
    data: {
      receiver_employee_id: req.body.receiver_employee_id,
      sender_employee_id: req.body.receiver_employee_id,
      message: req.body.message,
    },
  });
};
