const User = require("../models/userModels");
const data = require("../data");
const seedUser = async (req, res, next) => {
  try {
    // Deleting all existing users
    await User.deleteMany({});

    // Creating new users
    const users = await User.insertMany(data.users);

    // Success response
    return res.status(201).json(users);
  } catch (error) {
    next(error);
      }
    //const users = await User.find()
    
    //res.json(users)
};

module.exports = { seedUser };
