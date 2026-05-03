# Setup Instructions

## First time setup

```powershell
# 1. Install dependencies
npm install

# 2. Push schema to database (creates all tables including HostProfile, SiteSetting)
npx prisma db push

# 3. Generate Prisma client (REQUIRED after db push)
npx prisma generate

# 4. Seed database (creates admin user, default categories, host profiles, site settings)
npx tsx prisma/seed.ts

# 5. Run dev server
npm run dev
```

## Login
- URL: http://localhost:3000/login
- Username: admin
- Password: admin123

## If you forget your password
```powershell
npx tsx prisma/create-admin.ts
```

## If Prisma models show undefined errors
```powershell
Remove-Item -Recurse -Force node_modules
npm install
npx prisma generate
Remove-Item -Recurse -Force .next
npm run dev
```

## Admin panel pages
- /dashboard - Overview stats
- /manage-episodes - All episodes
- /manage-episodes/new - Create episode
- /categories - Manage categories
- /subscribers - Email list
- /contacts - Messages from visitors
- /newsletter - Send newsletter
- /site-settings - Hero image, host profiles
- /settings - Change password
