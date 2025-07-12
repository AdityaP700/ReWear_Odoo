// makeAdmin.js

const { User } = require('./models');

async function makeUserAdmin(username) {
  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      console.log("User not found.");
      return;
    }

    user.is_admin = true;
    await user.save();

    console.log(`✅ User ${username} has been promoted to admin.`);
  } catch (error) {
    console.error("❌ Error making user admin:", error);
  }
}

// Replace 'some_username' with the actual username you want to promote
makeUserAdmin('some_username');
