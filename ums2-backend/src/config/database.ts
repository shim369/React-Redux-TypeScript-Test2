import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('postgres://shim:shim@localhost:5432/mydatabase');

export default sequelize;
