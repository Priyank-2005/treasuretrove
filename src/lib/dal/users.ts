'use server';

import prisma from '@/lib/db';

/**
 * Retrieve a user by ID. Password is excluded from the result.
 */
export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      joinedDate: true,
    },
  });

  return user;
}

/**
 * Retrieve a user by email. Includes the password hash for auth comparison.
 */
export async function getUserByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  return user;
}

/**
 * Create a new user with the CUSTOMER role.
 */
export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}) {
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      role: 'CUSTOMER',
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      joinedDate: true,
    },
  });

  return user;
}

/**
 * Update an existing user's profile. Password is excluded from the result.
 */
export async function updateUser(
  id: string,
  data: {
    name?: string;
    phone?: string;
    email?: string;
  }
) {
  const user = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      joinedDate: true,
    },
  });

  return user;
}

/**
 * Retrieve all users with the CUSTOMER role (for admin views).
 * Includes an order count per customer. Password is never returned.
 */
export async function getAllCustomers() {
  const customers = await prisma.user.findMany({
    where: { role: 'CUSTOMER' },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      joinedDate: true,
      _count: {
        select: { orders: true },
      },
    },
    orderBy: { joinedDate: 'desc' },
  });

  return customers;
}

/**
 * Retrieve a single customer with their addresses and orders (including order items).
 * Password is never returned.
 */
export async function getCustomerDetail(id: string) {
  const customer = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      joinedDate: true,
      addresses: true,
      orders: {
        include: {
          items: true,
        },
        orderBy: { date: 'desc' },
      },
    },
  });

  return customer;
}

/**
 * Return the total count of users with the CUSTOMER role.
 */
export async function getUserCount() {
  const count = await prisma.user.count({
    where: { role: 'CUSTOMER' },
  });

  return count;
}
