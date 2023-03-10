const db = require('../config/connection');
module.exports = createUserSchema =  async () => {
 try {
   await db.get().command('users',{
      // collMod: "users",
      validator: {
         $jsonSchema: {
            bsonType: "object",
            required: [ "email", "password", "verified"],
            properties: {
               email: {
                  bsonType: "string",
                  description: "is required"
               },
               password: {
                  bsonType: "string",
                  description: " is required"
               },
               verified: {
                  bsonType: [ "bool" ],
                  description: "must be boolean and is required"
               }
            }
         }
      },
      validationLevel: "moderate"
   });
 } catch (error) {
   console.log(error)
 }
}
