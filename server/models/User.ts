import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  age?: number;
  bio?: string;
  profile_image_url?: string;
  location?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserData {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  age?: number;
  bio?: string;
  location?: string;
}

export class UserModel {  static async create(userData: CreateUserData): Promise<User> {
    const { email, password, first_name, last_name, age, bio, location } = userData;
    
    // Generate nanoid for user
    const id = nanoid();
    
    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const result = await sql`
      INSERT INTO users (id, email, password_hash, first_name, last_name, age, bio, location)
      VALUES (${id}, ${email}, ${password_hash}, ${first_name || null}, ${last_name || null}, ${age || null}, ${bio || null}, ${location || null})
      RETURNING id, email, first_name, last_name, age, bio, profile_image_url, location, created_at, updated_at
    `;

    return result.rows[0] as User;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const result = await sql`
      SELECT id, email, first_name, last_name, age, bio, profile_image_url, location, created_at, updated_at
      FROM users 
      WHERE email = ${email}
    `;

    return result.rows.length > 0 ? (result.rows[0] as User) : null;
  }

  static async findByEmailWithPassword(email: string): Promise<(User & { password_hash: string }) | null> {
    const result = await sql`
      SELECT id, email, password_hash, first_name, last_name, age, bio, profile_image_url, location, created_at, updated_at
      FROM users 
      WHERE email = ${email}
    `;

    return result.rows.length > 0 ? (result.rows[0] as User & { password_hash: string }) : null;
  }
  static async findById(id: string): Promise<User | null> {
    const result = await sql`
      SELECT id, email, first_name, last_name, age, bio, profile_image_url, location, created_at, updated_at
      FROM users 
      WHERE id = ${id}
    `;

    return result.rows.length > 0 ? (result.rows[0] as User) : null;
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }  static async updateProfile(id: string, updates: Partial<CreateUserData & { profile_image_url?: string }>): Promise<User | null> {
    const { first_name, last_name, age, bio, location, profile_image_url } = updates;
    
    const result = await sql`
      UPDATE users 
      SET 
        first_name = CASE WHEN ${first_name !== undefined} THEN ${first_name} ELSE first_name END,
        last_name = CASE WHEN ${last_name !== undefined} THEN ${last_name} ELSE last_name END,
        age = CASE WHEN ${age !== undefined} THEN ${age} ELSE age END,
        bio = CASE WHEN ${bio !== undefined} THEN ${bio} ELSE bio END,
        location = CASE WHEN ${location !== undefined} THEN ${location} ELSE location END,
        profile_image_url = CASE WHEN ${profile_image_url !== undefined} THEN ${profile_image_url} ELSE profile_image_url END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id, email, first_name, last_name, age, bio, profile_image_url, location, created_at, updated_at
    `;

    return result.rows.length > 0 ? (result.rows[0] as User) : null;
  }
}
