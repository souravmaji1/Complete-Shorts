const { google } = require('googleapis');
const { NextResponse } = require('next/server');

const youtube = google.youtube('v3');

/**
 * Fetches videos from a YouTube channel
 * @param {Object} options - Configuration options
 * @param {string} options.channelName - YouTube channel name
 * @returns {Promise<Object>} - List of videos
 */
async function fetchChannelVideos(options) {
  const { channelName } = options;
  const YOUTUBE_API_KEY = 'AIzaSyC-JNIPHwRUreVcoHmnFcgFE3-KSuBptRQ';

  if (!YOUTUBE_API_KEY) {
    throw new Error('Missing YouTube API key');
  }

  if (!channelName) {
    throw new Error('Channel name is required');
  }

  try {
    // First, get channel ID from channel name
    const channelResponse = await youtube.channels.list({
      key: YOUTUBE_API_KEY,
      part: 'id',
      forUsername: channelName,
    });

    let channelId = channelResponse.data.items?.[0]?.id;

    if (!channelId) {
      // If no channel found by username, try searching
      const searchResponse = await youtube.search.list({
        key: YOUTUBE_API_KEY,
        part: 'snippet',
        q: channelName,
        type: 'channel',
        maxResults: 1,
      });

      channelId = searchResponse.data.items?.[0]?.id?.channelId;

      if (!channelId) {
        throw new Error('Channel not found');
      }
    }

    // Fetch videos from the channel
    const videoResponse = await youtube.search.list({
      key: YOUTUBE_API_KEY,
      part: 'snippet',
      channelId: channelId,
      type: 'video',
      maxResults: 50,
      order: 'date',
    });

    const videos = videoResponse.data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.default.url,
      publishedAt: item.snippet.publishedAt,
    }));

    return { videos };
  } catch (error) {
    console.error('Error fetching YouTube videos:', error.message);
    throw error;
  }
}

export async function POST(request) {
  try {
    const { channelName } = await request.json();

    const result = await fetchChannelVideos({ channelName });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch videos: ${error.message}` },
      { status: 500 }
    );
  }
}