## Getting Started
First, install the dependencies:
```bash
pnpm install
```

Then, add an .env file, as a guideline we have a .env.example file with all the environment variables that we'll be using.

Then, run the migrate script to setup your database schemas:
```bash
npx prisma migrate deploy
```

Then, run generate to generate the prisma client:
```bash
npx prisma generate
```

Then if needed, we have a seed file to populate some initial data (Only for development):
```bash
npx prisma db seed
```

Lastly, run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
