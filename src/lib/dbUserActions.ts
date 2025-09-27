'use server';

import { hash } from 'bcrypt';
import { prisma } from './prisma';

export async function getUser(email: string | null | undefined) {
  if (!email) return null;
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return user;
}

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
