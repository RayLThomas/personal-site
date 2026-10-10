module.exports = {
  layout: "episode.njk",
  eleventyComputed: {
    thumbnail: (data) =>
      data.image || (data.youtubeId ? `https://i.ytimg.com/vi/${data.youtubeId}/hqdefault.jpg` : "")
  }
};
