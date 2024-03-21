const mongoose = require('mongoose');
const validator = require('validator');
const currencyCodes = require('currency-codes');

const validCurrencySymbols = ['$', '€', '£', '₹', '¥'];

const SupplierSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  address: {
    country: { type: String, required: true },
    city: { type: String, required: true },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      return validator.isEmail(value);
    },
  },
  phone: { type: Number },
  currencyCode: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return currencyCodes.code(v) !== undefined;
      },
      message: (props) => `${props.value} is not a valid ISO 4217 currency code!`,
    },
  },
  currencyName: {
    type: String,
    required: true,
  },
  currencySymbol: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return validCurrencySymbols.includes(v);
      },
      message: () => 'Invalid currency symbol!',
    },
  },
  defaultPrice: { type: Number, required: true },
});

const SupplierQuery = mongoose.model('SupplierQuery', SupplierSchema);

module.exports = SupplierQuery;
