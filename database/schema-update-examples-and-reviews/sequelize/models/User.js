import s from 'sequelize';
const { DataTypes, Model } = s;
import sequelize from '../sequelize.js';

const User = sequelize.define('User', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER, primaryKey: true
    },
    firstName: {
        type: DataTypes.STRING
    }
}, {
    // Other model options go here
});

export default User;
