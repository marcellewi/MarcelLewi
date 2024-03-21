class Pipeline {
    constructor() {
      // Initialize attributes
      this.filters = [];
    }
    use(filter) {
      this.filters.push(filter);
      // Add a filter to the execution flow
    }
    run(input, errors) {
      /* Execute the first filter and then pass the modified input
        to the next filter
        */
      const result = this.filters.reduce((acc, filter) => {
        return filter(acc, input);
      }, errors);
  
      return result;
    }
  }
  
  module.exports = { Pipeline };