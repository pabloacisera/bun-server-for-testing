import bcript from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function hashPassword(password: string) {
  const salt = await bcript.genSalt(10);
  const hashedPassword = await bcript.hash(password, salt);
  return hashedPassword;
}

export async function comparePassword(password: string, hashedPassword:string) {
  return await bcript.compare(password, hashedPassword);
}

export function generateToken(id: string, name: string, email: string): string {
  // Verificación de variables de entorno
  const secret = Bun.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  // Conversión segura del tiempo de expiración
  const expiresIn = Bun.env.JWT_EXPIRES || '1d';

  // Generación del token
  return jwt.sign(
    { id, name, email },
    secret,
    { expiresIn } as jwt.SignOptions // Type assertion para expiresIn
  );
}