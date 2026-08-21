'use server';

import prisma from '@/lib/db';

/**
 * Returns all addresses belonging to a user, ordered with the default address first.
 */
export async function getAddressesByUserId(userId: string) {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' },
    });
    return addresses;
  } catch (error) {
    console.error('Error fetching addresses for user:', error);
    throw new Error('Failed to fetch addresses');
  }
}

/**
 * Returns a single address by its ID.
 */
export async function getAddressById(id: string) {
  try {
    const address = await prisma.address.findUnique({
      where: { id },
    });
    return address;
  } catch (error) {
    console.error('Error fetching address:', error);
    throw new Error('Failed to fetch address');
  }
}

/**
 * Creates a new address. If `isDefault` is true, all other addresses for this
 * user are unset as default first (inside a transaction).
 */
export async function createAddress(data: {
  userId: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}) {
  try {
    const { userId, isDefault, ...rest } = data;

    if (isDefault) {
      return await prisma.$transaction(async (tx) => {
        await tx.address.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        });

        return tx.address.create({
          data: { userId, isDefault: true, ...rest },
        });
      });
    }

    return await prisma.address.create({
      data: { userId, isDefault: isDefault ?? false, ...rest },
    });
  } catch (error) {
    console.error('Error creating address:', error);
    throw new Error('Failed to create address');
  }
}

/**
 * Updates an existing address. If `isDefault` is being set to true, all other
 * addresses for the same user are unset as default first (inside a transaction).
 */
export async function updateAddress(
  id: string,
  data: Partial<{
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
  }>
) {
  try {
    if (data.isDefault) {
      return await prisma.$transaction(async (tx) => {
        // Look up the address to get its userId
        const existing = await tx.address.findUnique({ where: { id } });
        if (!existing) throw new Error('Address not found');

        await tx.address.updateMany({
          where: { userId: existing.userId, isDefault: true },
          data: { isDefault: false },
        });

        return tx.address.update({
          where: { id },
          data,
        });
      });
    }

    return await prisma.address.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error('Error updating address:', error);
    throw new Error('Failed to update address');
  }
}

/**
 * Deletes an address by its ID.
 */
export async function deleteAddress(id: string) {
  try {
    const deleted = await prisma.address.delete({
      where: { id },
    });
    return deleted;
  } catch (error) {
    console.error('Error deleting address:', error);
    throw new Error('Failed to delete address');
  }
}

/**
 * Sets a specific address as the default for a user, unsetting all others.
 * Runs inside a transaction to ensure atomicity.
 */
export async function setDefaultAddress(userId: string, addressId: string) {
  try {
    return await prisma.$transaction(async (tx) => {
      await tx.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });

      return tx.address.update({
        where: { id: addressId },
        data: { isDefault: true },
      });
    });
  } catch (error) {
    console.error('Error setting default address:', error);
    throw new Error('Failed to set default address');
  }
}
