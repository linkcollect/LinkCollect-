import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  userId?: string;
}

const isOwner = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const isSameUser = false; // This variable is not used in your original code
    console.log(req.params.username, 'hello', req.body.username);

    const user = await prisma.user.findUnique({
      where: { username: req.params.username },
    });

    // isSameUser;

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      err: 'Error checking if the user is the owner',
      data: {},
    });
  }
};

export default isOwner;
