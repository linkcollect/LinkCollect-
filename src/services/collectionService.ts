import CollectionRepo from "../repository/collectionRepo";

class CollectionService {
  collectionRepo: CollectionRepo; // Define the collectionRepo property

  constructor() {
    this.collectionRepo = new CollectionRepo();
  }

  create = async (data) => {
    try {
      const collection = await this.collectionRepo.create(data);
      return collection;
    } catch (error) {
      throw error;
    }
  };

  save = async (collectionId, userId) => {
    try {
      const collection = await this.collectionRepo.save(collectionId, userId);
      return collection;
    } catch (error) {
      throw error;
    }
  };

  unsave = async (collectionId, userId) => {
    try {
      const collection = await this.collectionRepo.unsave(collectionId, userId);
      return collection;
    } catch (error) {
      throw error;
    }
  };
  
  getSavedCollections = async (userId) => {
    try {
      const collection = await this.collectionRepo.getSavedCollections(userId);
      return collection;
    } catch (error) {
      throw error;
    }
  };
  
  duplicateCollection = async (collectionId, userId) => {
    try {
      const collection = await this.collectionRepo.duplicateCollection(collectionId, userId);
      return collection;
    } catch (error) {
      throw error;
    }
  };

  getExplorePage = async (pageSize, page, tags, sortBy) => {
    try {
      const collection = await this.collectionRepo.getExplorePage(
        pageSize,
        page,
        tags, 
        sortBy
      );
      return collection;
    } catch (error) {
      throw error;
    }
  };
  searchInExplorePage = async (queryFor: any, page: any, pageSize: any) => {
    try {
      const collection = await this.collectionRepo.searchInExplorePage(
        queryFor, 
        page, 
        pageSize
      );
      return collection;
    } catch (error) {
      throw error;
    }
  };

  togglePrivacy = async (userId) => {
    try {
      const collection = await this.collectionRepo.togglePrivacy(userId);
      return collection;
    } catch (error) {
      throw error;
    }
  };

  update = async (id, data) => {
    try {
      const collection = await this.collectionRepo.update(id, data);
      return collection;
    } catch (error) {
      throw error;
    }
  };

  get = async (id) => {
    try {
      const collection = await this.collectionRepo.get(id);
      return collection;
    } catch (error) {
      throw error;
    }
  };

  delete = async (id) => {
    try {
      const collection = await this.collectionRepo.delete(id);
      return collection;
    } catch (error) {
      throw error;
    }
  };

  getAllWithTimeline = async (userId) => {
    try {
      const collection = await this.collectionRepo.getAllCollectionsWithTimeline(
        userId
      );
      return collection;
    } catch (error) {
      throw error;
    }
  };

  getAllByUsername = async (username, ownsUsername) => {
    try {
      const collection = await this.collectionRepo.getAllByUsername(
        username,
        ownsUsername // if the user owns the username
      );
      return collection;
    } catch (error) {
      throw error;
    } 
  };

  doesLinkExist = async (collectionId, link) => {
    try {
      const response = await this.collectionRepo.doesLinkExist(
        collectionId,
        link
      );
      return response;
    } catch (error) {
      throw error;
    } 
  };

  getAll = async (userId) => {
    try {
      const collection = await this.collectionRepo.getAll(userId);
      return collection;
    } catch (error) {
      throw error;
    }
  };

  upvote = async (collectionId, userId) => {
    try {
      const collection = await this.collectionRepo.upvote(collectionId, userId);
      return collection;
    } catch (error) {
      throw error;
    }
  };

  downvote = async (collectionId, userId) => {
    try {
      const collection = await this.collectionRepo.downvote(
        collectionId,
        userId
      );
      return collection;
    } catch (error) {
      throw error;
    }
  };

  getTags = async () => {
    try {
      const tag = await this.collectionRepo.getTags();
      return tag;
    } catch (error) {
      throw error;
    }
  };
  togglePin = async (collectionId: any) => {
    try {
      const tag = await this.collectionRepo.togglePin(collectionId);
      return tag;
    } catch (error) {
      throw error;
    }
  };
}

export default CollectionService;
