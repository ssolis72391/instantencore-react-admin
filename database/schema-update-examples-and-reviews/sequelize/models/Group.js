import s from 'sequelize';
const { DataTypes, Model } = s;
import sequelize from '../sequelize.js';

const Group = sequelize.define('Group', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER, primaryKey: true
    }
}, {
    // Other model options go here
});

export default Group;


