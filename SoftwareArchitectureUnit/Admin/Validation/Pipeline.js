class Pipeline {
  constructor() {
    // Initialize attributes
    this.filters = [];
  }

  use(filter) {
    this.filters.push(filter);
  }

  run(input, errors) {
    const result = this.filters.reduce((acc, filter) => filter(acc, input), errors);

    return result;
  }
}

module.exports = { Pipeline };
