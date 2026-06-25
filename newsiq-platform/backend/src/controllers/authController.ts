import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { RegisterSchema, LoginSchema, ForgotPasswordSchema, ResetPasswordSchema } from '../validation/authSchema';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET ?? 'your-very-secret-key';

// Helper to generate JWT
function generateToken(userId: number) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = RegisterSchema.parse(req.body);
    const hashed = await bcrypt.hash(parsed.password, 10);
    const user = await prisma.user.create({
      data: {
        email: parsed.email,
        password: hashed,
        name: parsed.name,
      },
    });
    const token = generateToken(user.id);
    res.status(201).json({ token });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: err.errors });
    }
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = LoginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: parsed.email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const valid = await bcrypt.compare(parsed.password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    const token = generateToken(user.id);
    res.json({ token });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: err.errors });
    }
    next(err);
  }
}

// Mock storage for reset tokens (in-memory)
const resetTokens = new Map<string, number>(); // token -> userId

export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = ForgotPasswordSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: parsed.email } });
    if (!user) return res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
    const token = Math.random().toString(36).substring(2);
    resetTokens.set(token, user.id);
    // Mock email send – just log
    console.log(`Password reset token for ${parsed.email}: ${token}`);
    res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: err.errors });
    }
    next(err);
  }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = ResetPasswordSchema.parse(req.body);
    const userId = resetTokens.get(parsed.token);
    if (!userId) return res.status(400).json({ message: 'Invalid or expired token' });
    const hashed = await bcrypt.hash(parsed.newPassword, 10);
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
    resetTokens.delete(parsed.token);
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: err.errors });
    }
    next(err);
  }
}

export async function me(req: Request, res: Response) {
  // authenticateToken middleware attaches req.userId
  const userId = (req as any).user?.id;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, name: true } });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
}
