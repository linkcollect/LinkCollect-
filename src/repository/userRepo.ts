import { PrismaClient } from "@prisma/client";
import { Collection } from "../models/index";
import Email from "../utils/sendEmail";

const prisma = new PrismaClient();

class UserRepository {
  async create(data) {
    try {
      const user = await prisma.user.create({ data });
      Email.verifyEmail(user.name, user.email, user.emailToken);
      return user;
    } catch (error) {
      console.log("Something went wrong at repository layer", error);
      throw error;
    }
  }

  async togglePrivacy(userId) {
    try {
      const userOld = await prisma.user.findUnique({
        where: { id: userId }
      });

      if(!userOld) throw new Error("User not found");
      
      const user = await prisma.user.update({
        where: { id: userId },
        data: { isPublic: userOld.isPublic ? false : true },
      });
      return user;
    } catch (error) {
      console.log("Something went wrong at repository layer", error);
      throw error;
    }
  }

  async verifyEmailToken(emailToken) {
    try {
      if(!emailToken) throw new Error("Token not found");

      const userToVerify = await prisma.user.findFirst({
        where: { emailToken: emailToken },
      });

      if(!userToVerify) throw new Error("User not found");

      const user = await prisma.user.update({
        where: { id: userToVerify?.id }, // Specify the field and value to uniquely identify the user
        data: { emailToken: null, verified: 1 },
      });


      return user;
    } catch (error) {
      console.log("Something went wrong in the verification of mail", error);
      throw error;
    }
  }

  async createSocials(userId, data) {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { socials: { set: data } },
      });
      return "ok";
    } catch (error) {
      console.log("Something went wrong at repository layer", error);
      throw error;
    }
  }

  async destroy(userId) {
    try {
      await prisma.user.delete({ where: { id: userId } });
      return true;
    } catch (error) {
      console.log("Something went wrong at repository layer");
      throw error;
    }
  }

  async updateProfilePic({ userId, profilePic }) {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { profilePic },
      });
      return user.profilePic;
    } catch (error) {
      console.log("Something went wrong at repository layer", error);
      throw error;
    }
  }

  async getWithCollection(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { collections: true },
      });
      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getByUserId(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { collections: true },
      });
      return user;
    } catch (error) {
      console.log("Something went wrong in fetching the user", error);
      throw error;
    }
  }

  async getByEmail(userEmail) {
    try {
      const user = await prisma.user.findUnique({ where: { email: userEmail } });
      return user;
    } catch (error) {
      console.log("Something went wrong in fetching the user", error);
      throw error;
    }
  }

  async checkUsername(username) {
    try {
      const user = await prisma.user.findUnique({ where: username  });
      if (user) {
        throw new Error("Username is not available");
      } else {
        return "Username available";
      }
    } catch (error) {
      console.log("Something went wrong in fetching the user", error);
      throw error;
    }
  }

  async getByUsername(username) {
    try {
      const user = await prisma.user.findUnique({
        where: { username },
        include: { collections: true },
      });
      return user;
    } catch (error) {
      console.log("Something went wrong in fetching the user", error);
      throw error;
    }
  }

  async setPremium(data, userId) {
    try {
      const adminUser = await prisma.user.findUnique({
        where: { id: userId, username: "askwhyharsh" },
      });

      if (!adminUser) {
        throw new Error("User is not authorized");
      }

      await prisma.user.updateMany({
        where: { username: { in: data.list.map((item) => item.username) } },
        data: { isPremium: true },
      });

      return data;
    } catch (error) {
      console.log("Something went wrong in setting premium users", error);
      throw error;
    }
  }
}

export default UserRepository;
