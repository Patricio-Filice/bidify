## Getting Started
First, install the dependencies:
```bash
pnpm install
```

Then, run the migrate script to setup your database schemas:
```bash
npx prisma migrate deploy
```

Then if needed, we have a seed file to populate some initial data (Only for development):
```bash
npx prisma migrate db seed
```

Lastly, run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
