'use server';

import { hash } from 'bcryptjs';
import { prisma } from './prisma';

/**
 * Check if user email exists in the database.
 * @param credentials an object with the following properties: email.
 * Returns true if found, otherwise false.
 */
export async function checkUser(credentials: { email: string }) {
  const user = await prisma.user.findUnique({
    where: { email: credentials.email },
  });
  return user !== null;
}

/**
 * Creates a new user in the database.
 * @param credentials an object with the following properties: email, password.
 */
export async function createUser(credentials: { email: string; password: string }) {
  const password = await hash(credentials.password, 10);
  await prisma.user.create({
    data: {
      email: credentials.email,
      password,
    },
  });
}

/**
 * Reads all users from the database.
 * @returns All users in the database.
 */
export async function readUsers() {
  const users = await prisma.user.findMany();
  return users;
}

/**
 * Reads a user by their ID.
 * @param id The ID of the user to read.
 * @returns The user object or null if not found.
 */
export async function readUser(id: string | null | undefined) {
  if (!id) return null;
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return user;
}

/**
 * Reads a user by their email.
 * @param email The email of the user to read.
 * @returns The user object or null if not found.
 */
export async function readUserByEmail(email: string | null | undefined) {
  if (!email) return null;
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return user;
}

/**
 * Deletes a user from the database.
 * @param credentials an object with the following properties: email.
 */
export async function deleteUser(credentials: { email: string }) {
  if (await checkUser({ email: credentials.email })) {
    await prisma.user.delete({
      where: { email: credentials.email },
    });
  }
}

/**
 * Changes the password of an existing user in the database.
 * @param credentials an object with the following properties: email, password.
 */
export async function changePassword(credentials: { email: string; password: string }) {
  const password = await hash(credentials.password, 10);
  await prisma.user.update({
    where: { email: credentials.email },
    data: {
      password,
    },
  });
}
