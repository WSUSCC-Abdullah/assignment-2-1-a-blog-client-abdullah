import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const createClient = () => {
  // Prevent Prisma from running in browser environment
  if (typeof window !== 'undefined') {
    throw new Error('PrismaClient cannot be used in the browser');
  }

  if (global.prisma) {
    return global.prisma;
  }

  const URL = process.env.DATABASE_URL || "file:D:/Admin/GitHub/major assignment/assignment-2-1-a-blog-client-abdullah/packages/db/dev.db";

  const prisma = new PrismaClient({
    datasourceUrl: URL,
  });

  console.log("Connected to database");

  global.prisma = prisma;
  return prisma;
};

export const client = {
  get db() {
    return createClient();
  },
};
