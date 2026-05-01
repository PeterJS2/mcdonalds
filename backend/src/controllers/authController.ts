import { Request, Response } from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import { appConfig } from '../appConfig';

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      appConfig.server.jwtSecret,
      { expiresIn: '24h' }
    );

    res.json({ user: { id: user.id, username: user.username, role: user.role }, token });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
    const { username } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'If user exists, a reset link would be sent.' });
};

export const resetPassword = async (req: Request, res: Response) => {
    const { username, newPassword } = req.body;
    try {
        const user = await User.findOne({ where: { username } });
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        user.password = newPassword; // Sequelize hook will handle hash if configured
        await user.save();
        res.json({ message: 'Password reset successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
