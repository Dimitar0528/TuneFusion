import { Sequelize } from 'sequelize';

// Create a Sequelize instance with MySQL connection
export const sequelizeInstance = new Sequelize("musicplayer", 'root', 'MD05at06', {
    host: 'localhost',
    port: '',
    dialect: "mysql",
    logging: false
});

// Function to gracefully close the database connection
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
    process.exit(0); // Exit the application
});

process.on('SIGINT', async () => {
    console.log('Received SIGINT signal. Closing database connection...');
    await closeDatabaseConnection();
    process.exit(0); // Exit the application
});

try {
    await sequelizeInstance.authenticate();
    sequelizeInstance.sync();
} catch (err) {
    console.error('Error connecting to MySQL database:', err);
}
