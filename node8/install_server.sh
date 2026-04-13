cd /cliente/app-regg/
npm install
npm run build
cd ..
cd /servidor
npm install
node /servidor/index.js
tail -f /dev/null