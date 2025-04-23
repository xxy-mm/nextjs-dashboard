# Next.js App Router Course - Starter

## Next.js Version

15.1.6

## Error: Cannot find module 'nextjs-dashboard/node_modules/.pnpm/bcrypt@5.1.1/node_modules/bcrypt/lib/binding/napi-v3/bcrypt_lib.node'

[github issue](https://github.com/vercel/next.js/discussions/76822)

**How to resolve?**

```bash
pnpm remove bcrypt
pnpm add bcryptjs
```

```ts
// /app/seed/route.ts
- import bcrypt from "bcrypt";
+ import bcrypt from "bcryptjs";
```
