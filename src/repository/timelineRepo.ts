import { Prisma, PrismaClient } from '@prisma/client';
import { filterDuplicateTimelines } from '../utils/filterDuplicateTimelines';
import Emit from '../events/events';

const prisma = new PrismaClient();
const emit = new Emit();

class TimelineRepo {
  createTimeline = async (data: any, collectionId: string) => {
    try {
      const timeline = await prisma.timeline.create({
       data
      });

      const updatedCollection = await prisma.collection.update({
        where: { id: collectionId },
        data: { timelines: { connect: { id: timeline.id } } },
      });

      const payload = {
        collectionId: updatedCollection.id,
        bookmark: timeline,
      };

      emit.bookmarkAdded(payload);
      return timeline;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  createMultipleTimelines = async (data: any[], collectionId: string) => {
    try {
      console.log('in multiple timelines', collectionId);
      const collection = await prisma.collection.findUnique({
        where: { id: collectionId },
        include: { timelines: true },
      });
      if (!collection) {
        throw new Error('Not a Valid Collection');
      }
      const validNewTimelines = filterDuplicateTimelines(
        collection.timelines,
        data
      );
      const createdTimelines = await prisma.timeline.createMany({
        data: validNewTimelines,
      });

      /** @TODO */
  
      // const timelineIds: string[] = [];
      // for (const timeline of createdTimelines) {
      //   timelineIds.push(timeline.id);
      // }
  
      // await prisma.collection.update({
      //   where: { id: collectionId },
      //   data: { timelines: { set: timelineIds } },
      // });
  
      return createdTimelines;
    } catch (error) {
      console.log('Something went wrong at timelines repository layer', error);
      throw error;
    }
  };
  
  

  delete = async (id: string, collectionId: string) => {
    try {
      const collection = await prisma.collection.findUnique({
        where: { id: collectionId },
      });
      if (!collection) {
        throw new Error('Not a Valid Collection');
      }
      const timeline = await prisma.timeline.delete({
        where: { id },
      });
      await prisma.collection.update({
        where: { id: collectionId },
        data: { timelines: { disconnect: { id } } },
      });

      const payload = {
        collectionId: collection.id,
        bookmark: timeline,
      };

      emit.bookmarkDeleted(payload);
      return timeline;
    } catch (error) {
      console.log('Something went wrong at timelines repository layer', error);
      throw error;
    }
  };

  get = async (id: string) => {
    try {
      const timeline = await prisma.timeline.findUnique({
        where: { id },
      });
      return timeline;
    } catch (error) {
      console.log('Something went wrong at timelines repository layer', error);
      throw error;
    }
  };

  getAll = async (collectionId: string) => {
    try {
      const timelines = await prisma.timeline.findMany({
        where: { collectionId },
      });
      return timelines;
    } catch (error) {
      console.log('Something went wrong at timelines repository layer', error);
      throw error;
    }
  };

  update = async (id: string, data: any) => {
    try {
      const timeline = await prisma.timeline.update({
        where: { id },
        data,
      });
      return timeline;
    } catch (error) {
      console.log('Something went wrong at timelines repository layer', error);
      throw error;
    }
  };


     /** @TODO testing */
  async togglePin(timelineId: string) {
    try {
      const timeline = await prisma.timeline.findUnique({
        where: { id: timelineId },
        include: { collection: { include: { pinDetails: true } } },
      });
  
      if (!timeline) {
        throw new Error('Invalid id');
      }
  
      const isPinned = timeline.collection.pinDetails?.isPinned ?? false;
      const pinnedTime = new Date();
  
      const updatedTimeline = await prisma.timeline.update({
        where: { id: timelineId },
        data: {
          pinDetails: {
            upsert: {
              create: { isPinned, pinnedTime },
              update: { isPinned: !isPinned, pinnedTime },
            } as Prisma.PinDetailsUpsertWithoutBookmarkInput,
          },
        },
      }) ;
  
      return updatedTimeline;
    } catch (error) {
      console.log('Something went wrong at repository layer of timeline', error);
      throw error;
    }
  }
  
}

export default TimelineRepo;
