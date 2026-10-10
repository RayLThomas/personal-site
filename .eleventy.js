module.exports = function(eleventyConfig) {

    eleventyConfig.addPassthroughCopy('./src/css');
    eleventyConfig.addPassthroughCopy('./src/images');
    eleventyConfig.addPassthroughCopy('./src/js');

    eleventyConfig.addFilter('year', () => new Date().getFullYear());

    return {
        dir: {
            input: "src",
            output: "public"
        }
    }
}
