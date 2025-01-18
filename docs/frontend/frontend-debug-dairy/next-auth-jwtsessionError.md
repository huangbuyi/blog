---
title: Next Auth 报错 JWTSessionError
date: 2024-12-30
---

使用 Github 登录，跳转会页面时，后台报错 JWTSessionError，获取 session 为 null。

解决方案：将 next-auth session 策略配置为 'jwt'。

```ts
export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub
  ],
  session: {
    strategy: 'jwt' // 设置为 jwt
  },
})
```