// controllers/auth.ts
import { AuthService } from '../services/authService';
import { loginSchema, registerSchema } from '../utils/authSchema';
import { z } from 'zod';

/**
 * Clase que maneja la lógica de autenticación.
 */
export class AuthController {
  private authService: AuthService;

  /**
   * Constructor de AuthController.
   * Inicializa una instancia de AuthService.
   */
  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Maneja el registro de un nuevo usuario.
   * @param {Request} req La solicitud HTTP entrante.
   * @returns {Promise<Response>} La respuesta HTTP con el resultado del registro.
   */
  async registerUser(req: Request): Promise<Response> {
    try {
      const data = await req.json();

      // Validar y convertir los datos con Zod
      const validatedData = registerSchema.parse(data);

      const user = await this.authService.registerUser(validatedData);
      return Response.json({ message: 'User created successfully', user }, { status: 201 });
    } catch (error) {
      console.error('Error registering user:', error);
      if (error instanceof Error) {
        if (error.message === 'Email already exists') {
          return Response.json({ error: error.message }, { status: 400 });
        }
        if (error instanceof z.ZodError) {
          return Response.json({ error: error.issues }, { status: 400 });
        }
      }
      return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
  }

   /**
   * Maneja el inicio de sesión de un usuario.
   * @param {Request} req La solicitud HTTP entrante.
   * @returns {Promise<Response>} La respuesta HTTP con el resultado del inicio de sesión.
   */
  async loginUser(req: Request): Promise<Response> {
    try {
      const data = await req.json();
      const validatedData = loginSchema.parse(data);
      
      const { userData, cookie } = await this.authService.loginUser(validatedData);
      
      return new Response(
        JSON.stringify({ 
          message: 'Login successful', 
          user: userData 
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': cookie
          }
        }
      );
    } catch (error) {
      console.error('Error logging in user:', error);
      if (error instanceof Error) {
        if (error.message === 'User not found' || error.message === 'Invalid credentials') {
          return Response.json({ error: error.message }, { status: 401 });
        }
        if (error instanceof z.ZodError) {
          return Response.json({ error: error.issues }, { status: 400 });
        }
      }
      return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
}