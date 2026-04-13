cd /app/servidor
rm -rf node_modules
npm install
npx prisma db push
npx prisma generate
npm start

tail -f /dev/null