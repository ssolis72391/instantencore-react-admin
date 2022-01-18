import User from './models/User1.js'

User.sync()
    .then(data => console.log(data));


