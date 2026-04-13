const mariadb = require('mariadb');

module.exports = {
    connectionLimit: 10,
    host: 'pbase_db',
    user: 'root',
    password: 'root_password',
    database: 'your_database_name'
};

