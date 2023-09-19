import User from "../models/user";
import deletedUsers from "../models/analytics/deletedUsers";
import Email from "../utils/sendEmail";
import { Collection } from "../models/index";
import checkSpecialCharacters from "middlewares/user/checkSpecialCharacters";
// import CollectionRepo from "./collectionRepo";
class UserRepository {
  async create(data) {
    try {
      const user = await User.create(data);
      // verify email
      Email.verifyEmail(user.name, user.email, user.emailToken);
      await user.save();
      return user;
    } catch (error) {
      console.log("Something went wrong at repository layer", error);
      console.log(error);
      throw error;
    }
  }

  async togglePrivacy(userId) {
    try {
      const user: any = await User.findById(userId);
      user.isPublic = !user.isPublic;
      await user.save();
      return user;
    } catch (error) {
      console.log("Something went wrong at repository layer", error);
      console.log(error);
      throw error;
    }
  }

  async verifyEmailToken(token) {
    try {
      const user: any = await User.findOne({ emailToken: token });
      console.log("user verifing token", user);
      if (!user) {
        console.log("User doesn't exist");
        throw "User doesn't exist";
      }

      let data = {
        emailToken: null,
        verified: 1,
      };
      console.log("data", data);
      await User.findOneAndUpdate({ emailToken: token }, data);

      await user.save();

      return user;
    } catch (error) {
      console.log("Something went wrong in the verification of mail", error);
      console.log(error);
      throw error;
    }
  }
  async createSocials(userId, data: []) {
    try {
      const user = await User.findById(userId);
      const userSocialData = user?.socials;

      if (userSocialData && userSocialData?.length > 0) {
        console.log(userSocialData.length);
        data.forEach((socialEntry) => {
          const companyName = Object.keys(socialEntry)[0];
          const existingIndex = userSocialData.findIndex(
            (userEntry) => Object.keys(userEntry)[0] === companyName
          );

          if (existingIndex !== -1) {
            // Update existing entry
            userSocialData[existingIndex][companyName] =
              socialEntry[companyName];
          } else {
            // Push new entry
            userSocialData.push(socialEntry);
          }
        });
      } else {
        console.log("No social data found.");
        throw new Error("No data was found");
      }

      console.log(userSocialData);

      return "ok";
    } catch (error) {
      console.log("Something went wrong at repository layer", error);
      console.log(error);
      throw error;
    }
  }
  async destroy(userId) {
    try {
      await User.findByIdAndRemove(userId);
      return true;
    } catch (error) {
      console.log("Something went wrong at repository layer");
      console.log(error);
      throw error;
    }
  }
  async createDeletedUser(userData) {
    try {
      let userDataImportant = {
        name: userData.name,
        email: userData.email,
        username: userData.username,
        password: userData.password,
        isPremium: userData.isPremium,
        isPublic: userData.isPublic,
        socials: userData.socials,
        collections: userData.collections,
        savedCollections: userData.savedCollections,
        emailToken: userData.emailToken,
        verified: userData.verified,
      };

      const userDeleted = await deletedUsers.create(userDataImportant);
      // console.log("userDelted", userDelted);
      return userDeleted;
    } catch (error) {
      console.log("Something went wrong at repository layer");
      console.log(error);
      throw error;
    }
  }

  async updateProfilePic({ userId, profilePic }) {
    try {
      const user: any = await User.findByIdAndUpdate(userId, { profilePic });
      return user.profilePic;
    } catch (error) {
      console.log("Something went wrong at repository layer", error);
      console.log(error);
      throw error;
    }
  }

  async getWithCollection(userId) {
    try {
      const user = await User.findById(userId)
        .populate({ path: "collections" })
        .lean();
      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getByUserId(userId) {
    try {
      const user = await User.findById(userId)
        .populate({ path: "collections" })
        .lean();
      return user;
    } catch (error) {
      console.log("Something went wrong in fetching the user", error);
      throw error;
    }
  }

  async getByEmail(userEmail, populateCollections = false) {
    try {
      if (!populateCollections) {
        const user = await User.findOne({ email: userEmail });
        return user;
      } else {
        const user = await User.findOne({ email: userEmail })
          .populate({ path: "collections" })
          .lean();

        return user;
      }
    } catch (error) {
      console.log("Something went wrong in fetching the user", error);
      console.log(error);
      throw error;
    }
  }

  async checkUsername(username: String) {
    try {
      const user = await User.findOne({username: username});
      console.log("user", user);
      if (user) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.log("Something went wrong in fetching the user", error);
      console.log(error);
      throw error;
    }
  }

  async getByUsername(username) {
    try {
      const user = await User.findOne({ username })
        .populate({ path: "collections" })
        .lean();
      return user;
    } catch (error) {
      console.log("Something went wrong in fetching the user", error);
      console.log(error);
      throw error;
    }
  }
  async userInfo(data, userId) {
    try {
  
      const user = await User.findOne({ _id: userId });
      if (!user) {
        throw new Error("User is not available");
      }
     
      // Update user data only for fields that are passed in the 'data' object
      if (data.name) {
        user.name = data.name;
      }

      if (data.username && data.username !== user.username) {
        let isUsernameAvailable = await this.checkUsername(data.username);
        const specialChars = data.username.match(/[^A-Za-z0-9\s.]/g);

        if (specialChars !== null) {   
          throw new Error("Username contained special characters!");
        }  

        if (!isUsernameAvailable) {
          throw new Error("Username is not available");
        }
        
        if(isUsernameAvailable) {
        user.username = data.username;
        }
      }

      if (data.socials) {
        user.socials = JSON.parse(data.socials);
      }

      if (data.bio) {
        user.bio = data.bio;
      }

      if (data.profilePic) {
        user.profilePic = data.profilePic;
      }
      if (data.isPublic !== undefined || data.isPublic !== null) {
        user.isPublic = data.isPublic;
      }

      // Save the updated user data
      await user.save();

      return user;

    } catch (error) {
      console.log("Something went wrong in fetching the user", error);
      console.log(error);
      throw error;
    }
  }

  async setPremium(data, userId) {
    try {
      // console.log("here", data, userId)
      const user = await User.findOne({ _id: userId });
      if (!user) {
        throw new Error("Username is not available");
      }
      console.log("user", user.username);
      if (user.username !== "askwhyharsh") {
        throw new Error("no admin");
      }
      // run a loop for each data value, data consist a list of objects. each object has a userId and a premium value (bool); we need to update the premium value of the user with the given userId
      if (data.list == null) {
        throw new Error("No data provided");
      }

      let usersUpdated: any = []

      console.log("here");
      for (let i = 0; i < data.list.length; i++) {
        let user2 = await User.findOne({ username: data.list[i].username });
        if (!user2 || data.list[i].premium == null || data.list[i].premium == undefined) {
          continue;
        }
        user2.isPremium = data.list[i].premium;
        await user2.save();
        usersUpdated.push(user2)
      }

      return usersUpdated;
    } catch (error) {
      console.log("Something went wrong in fetching the user", error);
      console.log(error);
      throw error;
    }
  }
}

export default UserRepository;
