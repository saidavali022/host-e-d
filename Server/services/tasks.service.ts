import prisma from "../utils/prisma";

export const getTasks = async () => {
  try {
    const tasks = await prisma.task.findMany({
      // where: {
      //   employee_id: req.params.empId,
      // },
      orderBy: [
        {
          status: "asc",
        },
        {
          created_at: "desc",
        },
      ],
      include: {
        employee: {
          select: {
            username: true,
            passportSizePhoto: true,
          },
        },
        creator: {
          select: {
            username: true,
            passportSizePhoto: true,
          },
        },
      },
    });
    return tasks;
  } catch (error: any) {
    console.error("Error Message - ", error.message);
    console.error(error);
    throw new Error("");
  }
};
