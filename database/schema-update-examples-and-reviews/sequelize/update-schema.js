import s from 'sequelize';
const { DataTypes } = s;
import User from './models/User.js'

await User.sync();

let description = await User.describe();
console.log(description);

var newModel = User.sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER, primaryKey: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING
    }

});

await newModel.sync();

description = await User.describe();
console.log(description);







// User.sync()
//     .then(data => console.log(data));


