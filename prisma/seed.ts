import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  if (process.env.NODE_ENV === 'production') {
    console.error('Cannot seed database in production');
    process.exit(1);
  }

  console.log('Connecting to database...');
  await prisma.$connect();
  console.log('Successfully connected to database\n');

  console.log('Clearing existing data...');
  await prisma.bid.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.user.deleteMany();
  console.log('Successfully cleared existing data\n');

  console.log('Creating users...');
  const users = await Promise.all(
    Array.from({ length: 10 }, () => 
      prisma.user.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
        }
      })
    )
  );
  console.log('Successfully created users:', users.length, '\n');

  console.log('Creating collections...');
  // Create 100 collections
  const collections = await Promise.all(
    Array.from({ length: 100 }, () =>
      prisma.collection.create({
        data: {
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          stocks: faker.number.int({ min: 1, max: 100 }),
          price: parseFloat(faker.commerce.price()),
          ownerId: users[faker.number.int({ min: 0, max: 9 })].id,
        }
      })
    )
  );
  console.log('Successfully created collections:', collections.length, '\n');

  console.log('Creating bids...');
  // Create 10 bids per collection
  const bids = await Promise.all(
    collections.flatMap(collection =>
      Array.from({ length: 10 }, () =>
        prisma.bid.create({
          data: {
            price: parseFloat(faker.commerce.price()),
            status: 'PENDING',
            collectionId: collection.id,
            userId: users[faker.number.int({ min: 0, max: 9 })].id,
          }
        })
      )
    )
  );
  console.log('Successfully created bids:', bids.length);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });