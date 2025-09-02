npm init 
npm i --save-dev typescript ts-node @types/node dotenv
npx tsc --init

<!-- # 1. init
npm init -y

# 2. install dependencies
npm install express mongoose jsonwebtoken bcryptjs

# 3. install dev deps (TypeScript + types + watcher)
npm install -D typescript ts-node-dev @types/express @types/jsonwebtoken @types/node @types/mongoose

# 4. create folder
mkdir -p src/modules/user/{domain/{entities,value-objects,repositories,services},application/use-cases,presentation/{controllers},infrastructure/database,infrastructure/repositories}
mkdir -p src/shared/{middleware,services,types}
mkdir -p src/config -->
