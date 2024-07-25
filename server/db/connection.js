import { Sequelize } from 'sequelize';

// Create a Sequelize instance with MySQL connection
export const sequelizeInstance = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false
});

const closeDatabaseConnection = async () => {
    try {
        await sequelizeInstance.close();
        console.log('Database connection closed gracefully.');
    } catch (err) {
        console.error('Error closing database connection:', err);
    }
};

process.on('exit', async () => {
    console.log('Received exit signal. Closing database connection...');
    await closeDatabaseConnection();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('Received SIGINT signal. Closing database connection...');
    await closeDatabaseConnection();
    process.exit(0);
});

try {
    await sequelizeInstance.authenticate();
    sequelizeInstance.sync();
} catch (err) {
    console.error('Error connecting to MySQL database:', err);
}
