import { prisma } from '../lib/prisma';

async function main() {
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ALTER COLUMN "subscriptionStatus" DROP DEFAULT`);
    console.log('1. Dropped old default');
  } catch (e: any) { console.log('1. Skip:', e.message?.substring(0, 80)); }

  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ALTER COLUMN "subscriptionStatus" TYPE "SubscriptionStatus" USING "subscriptionStatus"::"SubscriptionStatus"`);
    console.log('2. Converted to enum type');
  } catch (e: any) { console.log('2. Skip:', e.message?.substring(0, 80)); }

  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ALTER COLUMN "subscriptionStatus" SET DEFAULT 'FREE'::"SubscriptionStatus"`);
    console.log('3. Set new enum default');
  } catch (e: any) { console.log('3. Skip:', e.message?.substring(0, 80)); }

  await prisma.$disconnect();
}

main();
