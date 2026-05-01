import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { appConfig } from '../appConfig';

export const authMiddleware = async (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const [type, authValue] = authHeader.split(' ');
  if (type !== 'Bearer' || !authValue) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const verifiedPayload = jwt.verify(authValue, appConfig.server.jwtSecret);
    if (!verifiedPayload) {
      throw Error('Unauthorized');
    }

    const decoded: any = verifiedPayload;
    const user = await User.findByPk(decoded.id);

    if (!user) {
      throw Error('Unauthorized');
    }

    req.user = user;
    res.locals.jwtPayload = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};
