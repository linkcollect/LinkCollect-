import { PrismaClient } from '@prisma/client';
import {
  AuthenticatedRequest,
  IResponse,
  INextFunction,
} from '../interface/Request';

const prisma = new PrismaClient();

export const collectionLimit = async (
  req: AuthenticatedRequest,
  res: IResponse,
  next: INextFunction
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { collections: true },
    });

    if(!user) {
      return res.status(404).json({
        success: false,
        data: {},
        err: 'Validation Error {User not found}',
        message: 'User not found',
      });
    }

    console.log('isPremium', user.username, user.isPremium);
    if (user.collections.length > 30 && !user.isPremium) {
      console.log('30 limit exceeded');
      return res.status(404).json({
        success: false,
        data: {},
        err: 'Validation Error {Collection Limit Exceeded}',
        message: 'Collection limit exceeded',
      });
    }
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      err: 'Error checking collection limit',
      data: {},
    });
  }
};

export const LinkLimit = async (
  req: AuthenticatedRequest,
  res: IResponse,
  next: INextFunction
) => {
  try {
    const collection = await prisma.collection.findUnique({
      where: { id: req.params.id },
      include: { timelines: true, user: true },
    });

    if(!collection) {
      return res.status(404).json({
        success: false,
        data: {},
        err: 'Validation Error {collection not found}',
        message: 'collection not found',
      });
    }

    const user = collection.user;
    
    console.log(user.isPremium);
    if (collection.timelines.length > 100 && !user.isPremium) {
      console.log('100 limit exceeded');
      return res.status(404).json({
        success: false,
        data: {},
        err: 'Validation Error {Link Quota Exceeded}',
        message: 'Link limit exceeded',
      });
    }
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      err: 'Error checking link limit',
      data: {},
    });
  }
};
