import { prisma } from "../config/prisma";
import type { LoginUser, RegisterUser, UserData } from "../interfaces/userInterface";
import { comparePassword, generateToken, hashPassword } from "../utils/authentication";

export class AuthService {
  
  async registerUser(user: RegisterUser): Promise<UserData> {
    try {
      const userFound = await prisma.user.findFirst({
        where: {
          email: user.email
        }
      });

      if (userFound) {
        throw new Error('Email already exists');
      }

      const hashedPassword = await hashPassword(user.password);

      const newUser = await prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: hashedPassword,
          role: user.role || 'user'
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      });

      return newUser;
    } catch (error) {
      console.error('Error in auth service:', error);
      throw error;
    }
  }

  async loginUser(user: LoginUser): Promise<{ userData: UserData; cookie: string }> {
    try {
      const foundUser = await prisma.user.findFirst({
        where: {
          email: user.email
        }
      });

      if (!foundUser) {
        throw new Error('User not found');
      }

      const isPasswordValid = await comparePassword(user.password, foundUser.password);

      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      const token = generateToken(String(foundUser.id), foundUser.name, foundUser.email);
      const cookie = this.createAuthCookie(token);

      return {
        userData: {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role,
          token: token
        },
        cookie: cookie
      };
    } catch(err) {
      console.error('Error in auth service:', err);
      throw err;
    }
  }

  private createAuthCookie(token: string): string {
    const isProduction = Bun.env.NODE_ENV === 'production';
    const cookieParts = [
      `token=${token}`,
      `Path=/`,
      `HttpOnly`,
      `SameSite=Lax`,
      `Max-Age=${isProduction ? 86400 : 86400 }`,
      isProduction ? 'Secure' : '',
      isProduction ? 'Domain=yourdomain.com' : ''
    ];

    // Solo añadir SameParty en desarrollo
    if (!isProduction) {
      cookieParts.push('SameParty');
    }

    return cookieParts.filter(Boolean).join('; ');
  }
}