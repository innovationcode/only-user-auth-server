//Creating tokens that never expire and sending them out over the internet is not very good for security
const usersdb = require('../database.js');

// With setInterval() Function runs every 4 seconds
setInterval(async function checkRegistrationTokenValidity() {
    await usersdb.select('id', 'createdtime')
                 .from('users')
                 .then(timeOfTokenCreation => {
                     timeOfTokenCreation.map(entryTime => {

                     // Convert UTC time to an integer to compare with current time
                     let timeInInt = parseInt(entryTime.createdtime);
                     
                     // Check if an hour has passed since the token was generated
                     if (Date.now() > timeInInt + 60000 * 60) {
                         usersdb.table('users')
                                .where('id', entryTime.id)
                                .update({token: null}) //updates old token to null
                                .then(res => res)
                                .catch(err => err);
                     }
                     })
                  })
                 .catch(err => console.log(err));

}, 4000);