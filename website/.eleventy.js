module.exports = function(eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("assets");
  
  // Add date filter
  eleventyConfig.addFilter("date", function(date, format) {
    const d = new Date(date === "now" ? Date.now() : date);
    
    switch(format) {
      case "Y":
        return d.getFullYear().toString();
      case "F j, Y":
        return d.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      default:
        return d.toLocaleDateString();
    }
  });
  
  // Set input and output directories
  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "../static"
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
