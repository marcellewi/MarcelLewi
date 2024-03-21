class ServiceEmulator {
  async getAuthorizedUser() {
    // randomly return true or false,
    // to emulate the service. the posibility of returning true is 90%

    const random = Math.random();
    if (random < 0.9) {
      return true;
    }
    return false;
  }

  async makePayment(_paymentData) {
    // randomly return true or false,
    // to emulate the service. the posibility of returning true is 90%

    const random = Math.random();
    if (random < 0.9) {
      return true;
    }
    return false;
  }
}

module.exports = ServiceEmulator;
