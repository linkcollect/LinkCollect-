import { PrismaClient } from '@prisma/client';
import Emit from '../events/events';
import tags from '../constants/alltags';
const prisma = new PrismaClient();
let emit = new Emit();

class CollectionRepo {
  async create(data) {
    try {
      if (
        data.tags?.length <= 2 ||
        data.title?.length <= 59 ||
        data.description?.length <= 1000
      ) {
        const collection = await prisma.collection.create({
          data: {
            ...data,
            user: {
              connect: { id: data.userId },
            },
          },
        });

        const payload = {
          userId: data.userId,
          collection: collection,
        };

        emit.collectionCreated(payload);
        return collection;
      } else {
        throw new Error('some issue in your data');
      }
    } catch (error) {
      console.log(
        'Something went wrong at collection repository layer',
        error
      );
      throw error;
    }
  }


    /**
   * @dev Validate user and collection before saving.
   * @param {Object} user - The user object.
   * @param {Object} collection - The collection object.
   */

  async validUserAndCollection(user, collection) {
    if (!user) {
      throw new Error('User ID is not a Valid ID');
    }
    if (!collection) {
      throw new Error('Collection ID is not a Valid ID');
    }
  }



    /**
   * @dev Save a collection to the user's saved collections.
   * @param {string} collectionId - The ID of the collection.
   * @param {string} userId - The ID of the user.
   * @returns {Object} The saved collection.
   */

  async save(collectionId, userId) {
    try {
      const collection = await prisma.collection.findUnique({
        where: { id: collectionId },
      });
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      await this.validUserAndCollection(user, collection);

      await prisma.user.update({
        where: { id: userId },
        data: {
          savedCollections: {
            connect: { id: collectionId },
          },
        },
      });

      return collection;
    } catch (error) {
      console.log(
        'Something went wrong at repository layer while saving collection',
        error
      );
      throw error;
    }
  }


    /**
   * @dev Unsave a collection from the user's saved collections.
   * @param {string} collectionId - The ID of the collection.
   * @param {string} userId - The ID of the user.
   * @returns {Object} The unsaved collection.
   */

  async unsave(collectionId, userId) {
    try {
      const collection = await prisma.collection.findUnique({
        where: { id: collectionId },
      });
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      await this.validUserAndCollection(user, collection);

      await prisma.user.update({
        where: { id: userId },
        data: {
          savedCollections: {
            disconnect: { id: collectionId },
          },
        },
      });

      return collection;
    } catch (error) {
      console.log(
        'Something went wrong at repository layer while saving collection',
        error
      );
      throw error;
    }
  }


   /**
   * @dev Get the saved collections of a user.
   * @param {string} userId - The ID of the user.
   * @returns {Collection} The user's saved collections.
   */

  async getSavedCollections(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { savedCollections: true },
      });
      if (!user) {
        throw new Error('User not found');
      }
      return user.savedCollections;
    } catch (error) {
      console.log(
        'Err in repository layer getting saved collection failed',
        error
      );
      throw error;
    }
  }




    /**
   * @dev Get collections for the explore page.
   * @param {number} pageSize - The number of collections per page.
   * @param {number} page - The page number.
   * @param {Array|string} tags - Tags for filtering collections.
   * @returns {Array} Collections for the explore page.
   */

  async getExplorePage(pageSize, page, tags) {
    try {
      let tagQuery = {};
      let tagsArray;
      if (tags) {
        tagsArray = Array.isArray(tags) ? tags : [tags];
        tagQuery = { tags: { in: tagsArray } };
      }

      const query = {
        isPublic: true,
        ...tagQuery,
      };

      const collections = await prisma.collection.findMany({
        where: query,
        select: {
          id: true,
          title: true,
          image: true,
          description: true,
          tags: true,
          upvotes: true,
          views: true,
          timelines: { select: { id: true } }, // Select only the ID of the timelines
        },
        orderBy: {
          // upvotes: { _count: "desc" },
          views: "desc",
        },
        skip: (parseInt(page) - 1) * parseInt(pageSize),
        take: parseInt(pageSize),
      });

      return collections;
    } catch (error) {
      console.log(
        'Err in repository layer getting saved collection failed',
        error
      );
      throw error;
    }
  }
  


    /**
   * @dev Search collections for the explore page.
   * @param {string} queryFor - The search query.
   * @param {number} page - The page number.
   * @param {number} pageSize - The number of collections per page.
   * @returns {Array} Search results for the explore page.
   */

  searchInExplorePage = async (queryFor, page, pageSize) => {
    try {
      if (queryFor.length < 3) {
        throw new Error("Search term should be at least 3 characters long");
      }
  
      const collections = await prisma.collection.findMany({
        where: {
          isPublic: true,
          OR: [
            { title: { contains: queryFor, mode: "insensitive" } },
            // Search within the tags array
            // { tags: { some: { contains: queryFor, mode: "insensitive" } } },
            { user: { username: { contains: queryFor, mode: "insensitive" } } },
          ],
        },
        select: {
          id: true,
          title: true,
          upvotes: true,
          views: true,
          description: true,
          tags: true,
          user: { select: { username: true, profilePic: true } },
          timelines: { select: { id: true } }, // Select only the ID of the timelines
        },
        orderBy: {
          upvotes: { _count: "desc" },
          views: "desc",
        },
        skip: (parseInt(page) - 1) * parseInt(pageSize),
        take: parseInt(pageSize),
      });
  
      return collections;
    } catch (error) {
      console.log("Err in repository layer getting saved collection failed", error);
      throw error;
    }
  };




    /**
   * @dev Toggle the privacy status of a collection.
   * @param {string} collectionId - The ID of the collection.
   * @returns {Object} The updated collection.
   */


  async togglePrivacy(collectionId) {
    try {
      const collectionCurrent = await prisma.collection.findUnique(
        { where: { id: collectionId } },
      )
      if (!collectionCurrent) {
        throw new Error('User not found');
      }

      const collection = await prisma.collection.update({
        where: { id: collectionId },
        data: {
          isPublic: collectionCurrent.isPublic? false : true,
        },
      });
      return collection;
    } catch (error) {
      console.log('Something went wrong at collection repository layer', error);
      throw error;
    }
  }





  /**
   * @dev Toggle the pin status of a collection.
   * @param {string} collectionId - The ID of the collection.
   * @returns {Object} The updated collection.
   */

  async togglePin(collectionId) {
    try {
      const collectionCurrent = await prisma.collection.findUnique({
        where: { id: collectionId },
        include: { pinDetails: true },
      });

      if (!collectionCurrent) {
        throw new Error('repository.collectionRepo.ts: Collection Not Found to togglePin');
      }

      let isPinned = false;
      if (collectionCurrent.pinDetails) {
        isPinned = !collectionCurrent.pinDetails.isPinned;
      } else {
        isPinned = true;
      }

      const updatedCollection = await prisma.collection.update({
        where: { id: collectionId },
        data: {
          pinDetails: {
            upsert: {
              update: { isPinned },
              create: { isPinned },
            },
          },
        },
        include: {pinDetails: true}
      });

      return updatedCollection;
    } catch (error) {
      console.log('Something went wrong at collection repository layer', error);
      throw error;
    }
  }




  deleteFromArray = (array, value) => {
    let newArray = array.filter((item) => item.toString() !== value.toString());
    return newArray;
  };


  /**
   * @dev Delete a collection by ID.
   * @param {string} id - The ID of the collection.
   * @returns {Object} The deleted collection.
   */

  async delete(id) {
    try {
      const collection = await prisma.collection.findUnique({
        where: { id },
        include: { user: true, SavedBy: true },
      });
  
      if (!collection) {
        throw new Error('Collection not found');
      }
  
      // Delete the collection and related records
      await prisma.collection.delete({ where: { id } });
  
      // Remove the deleted collection from savedCollections of all users
      if (collection.SavedBy) {
        const users = await prisma.user.findMany({
          where: { savedCollections: { some: { id } } },
        });
  
        for (const user of users) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              savedCollections: {
                disconnect: { id },
              },
            },
          });
        }
      }
  
      return collection;
    } catch (error) {
      console.log('Something went wrong at collection repository layer', error);
      throw error;
    }
  }
  
  // async delete(id) {
  //   try {
  //     const collection = await prisma.collection.findUnique({
  //       where: { id },
  //       include: { user: true },
  //     });

  //     if (!collection) {
  //       throw new Error('Collection not found');
  //     }

  //     await prisma.collection.delete({ where: { id } });

  //     await prisma.user.update({
  //       where: { id: collection.user.id },
  //       data: {
  //         collections: {
  //           disconnect: { id },
  //         },
  //       },
  //     });

  //     const payload = {
  //       userId: collection.user.id,
  //       collection,
  //     };

  //     // Emit collectionDeleted event
  //     // emit.collectionDeleted(payload);
      
  //     return collection;
  //   } catch (error) {
  //     console.log('Something went wrong at collection repository layer', error);
  //     throw error;
  //   }
  // }




    /**
   * @dev Get a collection by ID.
   * @param {string} id - The ID of the collection.
   * @returns {Object} The retrieved collection.
   */

  async get(id) {
    try {
      const collection = await prisma.collection.findUnique({
        where: { id },
        include: { timelines: true },
      });

      return collection;
    } catch (error) {
      console.log('Something went wrong at collection repository layer', error);
      throw error;
    }
  }



   /**
   * @dev Get all collections of a user by user ID.
   * @param {string} userId - The ID of the user.
   * @returns {Array} All collections of the user.
   */

  async getAll(userId) {
    try {
      const collections = await prisma.collection.findMany({
        where: { userId },
      });

      return collections;
    } catch (error) {
      console.log('Something went wrong at collection repository layer', error);
      throw error;
    }
  }



   /**
   * @dev Get all collections of a user with timelines by user ID.
   * @param {string} userId - The ID of the user.
   * @returns {Array} All collections of the user with timelines.
   */

  async getAllCollectionsWithTimeline(userId) {
    try {
      const collections = await prisma.collection.findMany({
        where: { userId },
        include: { timelines: true },
      });

      return collections;
    } catch (error) {
      console.log('Something went wrong at collection repository layer', error);
      throw error;
    }
  }


  /**
   * @dev Get all collections of a user by username.
   * @param {string} username - The username of the user.
   * @param {boolean} ownsUsername - Flag indicating if the username belongs to the requesting user.
   * @returns {Array} All collections of the user.
   */

  getAllByUsername = async (username, ownsUsername) => {
  try {
     let query: any;

      if (ownsUsername) {
        query = {
          username,
        };
      }

      query = {
        username,
        isPublic: true,
      };

      const collections = await prisma.collection.findMany({
        where: query, include: { timelines: true },
      });

      return collections;
    } catch (error) {
      console.log('Something went wrong at collection repository layer', error);
      throw error;
    }
  };



   /**
   * @dev Check if a link exists in a collection's timelines.
   * @param {string} collectionId - The ID of the collection.
   * @param {string} link - The link to check.
   * @returns {boolean} True if the link exists, otherwise false.
   */


  doesLinkExist = async (collectionId, link) => {
    try {
      const collection = await prisma.collection.findUnique({
        where: { id: collectionId },
        include: { timelines: true },
      });

      if (!collection) {
        throw new Error('repository layer: Collection not found');
      }
      // Check if the link already exists in the collection
      const existingLink = collection.timelines.some(
        (timeline) => timeline.link === link
      );
      // Return true if the link exists
      return existingLink;
    } catch (error) {
      console.log('Something went wrong at collection repository layer', error);
      throw error;
    }
  };


    /**
   * @dev Update a collection by ID.
   * @param {string} id - The ID of the collection.
   * @param {Object} data - The updated collection data.
   * @returns {Object} The updated collection.
   */

  update = async (id: any, data: any) => {
    try {
      const collection = await prisma.collection.update({
        where: { id },
        data,
      });

      return collection;
    } catch (error) {
      console.log('Something went wrong at collection repository layer', error);
      throw error;
    }
  };




    /**
   * @dev Upvote a collection.
   * @param {string} collectionId - The ID of the collection.
   * @param {string} userId - The ID of the user upvoting the collection.
   * @returns {Object} The upvoted collection.
   */

  upvote = async (collectionId: any, userId: any) => {
    try {
      // update collection if collection exists
      const collection = await prisma.collection.update({
        where: { id: collectionId },
        data: {
          upvotes: {
            connect: [{ id: userId }],
          },
        },
      });

      if(!collection) {
        throw new Error('Collection not found');
      }

      return collection;
    } catch (error) {
      console.log('Something went wrong at collection repository layer', error);
      throw error;
    }
  };

  /**
   * @dev Downvote a collection.
   * @param {string} collectionId - The ID of the collection.
   * @param {string} userId - The ID of the user downvoting the collection.
   * @returns {Object} The downvoted collection.
   */

  downvote = async (collectionId: any, userId: any) => {
    try {
      if(!collectionId || !userId) {
        throw new Error('Invalid collectionId or userId');
      }

      // Check if the collection exists
      const collectionOld = await prisma.collection.findUnique({
         where: { id: collectionId }, include: {upvotes: true}
      });

      if(!collectionId || !userId || !collectionOld) {
        throw new Error('Invalid collectionId or userId');
      }
      // Check if the user has upvoted the collection
      const userHasUpvoted = collectionOld.upvotes.some((upvote) => upvote.userId === userId);

      if (!userHasUpvoted) {
        throw new Error('User has not upvoted the collection');
      }

      // upvote the collection
      const collection = await prisma.collection.update({
        where: { id: collectionId },
        data: {
          upvotes: {
            disconnect: [{ id: userId }],
          },
        },
      });

      return collection;
    } catch (error) {
      console.log('Something went wrong at collection repository layer', error);
      throw error;
    }
  };



  /**
   * @dev Get available tags for collections to be able to add in their collection
   * @returns {Array} List of available tags.
   */

  getTags = async () => {
    try {
      if (!tags) {
        throw new Error("Collection not found");
      }
      return tags;
    } catch (error) {
      console.log("Something went wrong at collection repository layer", error);
      throw error;
    }
  };
}

export default CollectionRepo;
