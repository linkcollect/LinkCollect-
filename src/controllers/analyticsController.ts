import { analytics } from "googleapis/build/src/apis/analytics";
import { Collection, User, Timeline, SearchHistory } from "../models";
import { liveMessage } from "../constants/liveMessage";
import EmailService from "../services/emailService";
const axios = require("axios");
const cheerio = require("cheerio");
// const Redis = require('ioredis');

import { redisClient } from "../utils/redis/redis";

const emailService = new EmailService();

const getAll = async (req, res) => {
  try {
    const collections = await Collection.find();
    const users = await User.find();
    const timelines = await Timeline.find();

    const data = {
      collections: collections.length,
      users: users.length,
      timelines: timelines.length,
    };

    return res.status(201).json({
      data,
      success: true,
      message: "Successfully fetched the required Analytics",
      err: {},
    });
  } catch (error) {
    return res.status(500).json({
      data: {},
      success: false,
      message: "Not able to get the analytics",
      err: error,
    });
  }
};

const getLiveMessage = async (req, res) => {
  try {
    // const hostname = req.headers.host; // This contains the hostname and port
    // const [host, port] = hostname.split(':'); // Split the host and port
    // console.log("host", host, port)
    return res.status(201).json({
      data: liveMessage,
      success: true,
      message: "Successfully fetched the live message",
      err: {},
    });
  } catch (error) {
    return res.status(500).json({
      data: {},
      success: false,
      message: "Not able to get the analytics",
      err: error,
    });
  }
};

const getSearchHistory = async (req, res) => {
  try {
    // sort in desc order of count
    const searchHistory = await SearchHistory.find().sort({ count: -1 });
    return res.status(201).json({
      data: searchHistory,
      success: true,
      message: "Successfully fetched the search history",
      err: {},
    });
  } catch (error) {
    return res.status(500).json({
      data: {},
      success: false,
      message: "Not able to get the analytics",
      err: error,
    });
  }
};

const getMetaData = async (req, res) => {
  try {
    // fetch url from query params
    const url = req.query.url;
    console.log("url", url);

    setTimeout(() => {
      if(!res.headersSent) {
        return res.status(200).json({
          data: [],
          success: true,
          message: "Timedout",
        });
      }
    }, 2000);
    // Check if the metadata is already cached in Redis
    const cachedMetadata = await redisClient.get(url);
    console.log("cachedMetadata", cachedMetadata);

    if (cachedMetadata) {
      const metadata = JSON.parse(cachedMetadata);
      return res.status(200).json({
        data: metadata,
        success: false,
        message: "Metadata retrieved from cache",
      });
    }

    // check if twitter or tweet link, use regex
    const twitterRegex = new RegExp("https://twitter.com/.*");
    const isTwitter = twitterRegex.test(url);

    console.log("isTwitter", isTwitter);
    if (isTwitter) {
      // Construct the oEmbed URL
      const oEmbedUrl = `https://publish.twitter.com/oembed?url=${
        url
      }`;


      // Fetch the tweet metadata
      const tweetMetadata = await fetchTweetMetadata(oEmbedUrl);
      let tweetData = await scrapeTweetContent(tweetMetadata.html);
      console.log("tweetMetadata", tweetMetadata, tweetData);
      const metadata = {
        description: tweetData.tweetContent,
        images: tweetData.imageLinks,
        twitterAll: tweetMetadata
      };
     
      await redisClient.set(url, JSON.stringify(metadata), "EX", 3600); // 3600 seconds (1 hour)

      return res.status(200).json({
        data: metadata,
        success: true,
        message: "Metadata retrieved successfully",
      });
    }

    if(!isTwitter && !cachedMetadata){
    // If not cached, fetch the HTML content from the URL
    const response = await axios.get(url);
    const html = response.data;

    console.log("html", html);

    const $ = cheerio.load(html);
    const title = $("title").first().text();
    const description = $("meta[name=description]").attr("content");
    const image = $('meta[property="og:image"]').attr("content");
    const twitterImage = $('meta[property="twitter:image"]').attr("content");
    const twitterDescription = $('meta[property="twitter:description"]').attr(
      "content"
    );

    console.log("html", html);

    // Store the metadata in Redis with a TTL (time to live) of 1 hour
    const metadata = {
      title,
      description,
      images: [image, twitterImage],
      twitterImage,
      twitterDescription,
    };
    await redisClient.set(url, JSON.stringify(metadata), "EX", 3600); // 3600 seconds (1 hour)

    return res.status(200).json({
      data: metadata,
      success: true,
      message: "Metadata retrieved successfully",
    }); 
  }
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      data: {},
      success: false,
      message: "Not able to get the metadata",
      err: error.message,
    });
  }
};
function scrapeTweetContent(html) {
  // Load the HTML into cheerio
  const $ = cheerio.load(html);

  // Find the tweet content within the <p> tag
  const tweetContent = $('blockquote.twitter-tweet p').text();

  // find any image links in the tweet
  const imageLinks = $('blockquote.twitter-tweet a').map((i, el) => {
    const href = $(el).attr('href');
    if (href.includes('photo')) {
      return href;
    }
  }
  ).get();


  return {tweetContent, imageLinks};
}

const sendWeekyEmail = async (req, res) => {
  try {
    const response = await emailService.sendWeeklyEmail();

    return res.status(201).json({
      data: response,
      success: true,
      message: "Successfully sent emails",
      err: {},
    });
  } catch (error) {
    return res.status(500).json({
      data: {},
      success: false,
      message: "Not able to get the analytics",
      err: error,
    });
  }
};

async function fetchTweetMetadata(oEmbedUrl) {
  try {
    const response = await axios.get(oEmbedUrl);
    console.log("Tweet Metadata:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching tweet metadata:", error);
  }
}

const analyticsController = {
  getAll,
  getLiveMessage,
  getSearchHistory,
  sendWeekyEmail,
  getMetaData,
};

export default analyticsController;
