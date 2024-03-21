const mongoose = require("mongoose");
const { EventStatus } = require("../../utils/constants/eventStatus");
const { EventCategories } = require("../../utils/constants/eventCategories");
const {
  EventAuthorizationMode,
} = require("../../utils/constants/eventAuthorizationMode");
const { BadRequestException } = require("../exceptions/exceptions");

const validateCategory = (value) => {
  if (!Object.values(EventCategories).includes(value)) {
    throw new BadRequestException(`La categoría no es válida: ${value}`);
  }
};

const validateStatus = (value) => {
  if (!Object.values(EventStatus).includes(value)) {
    throw new BadRequestException(`El estado no es válido: ${value}`);
  }
};

const validateAuthMode = (value) => {
  if (!Object.values(EventAuthorizationMode).includes(value)) {
    throw new BadRequestException(
      `El modo de autorización no es válido: ${value}`
    );
  }
};

const validateDates = (value) => {
  if (value.startDate < Date.now()) {
    throw new BadRequestException(
      `La fecha de inicio no puede ser anterior a la fecha actual: ${value}`
    );
  }
  if (value.endDate < value.startDate) {
    throw new BadRequestException(
      `La fecha de fin no puede ser anterior a la fecha de inicio: ${value}`
    );
  }
};

const eventDatesSchema = {
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
};

const purchaseShcema = {
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
};

const statusSchema = {
  status: {
    type: String,
    validate: {
      validator: validateStatus,
      message: "Invalid status",
    },
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
};

const emailSchema = {
  emailsSent: {
    type: Number,
    default: 0,
  },
  emailsFailed: {
    type: Number,
    default: 0,
  },
};

const EventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    eventDatesInfo: {
      type: eventDatesSchema,
      required: true,
      validate: {
        validator: validateDates,
        message: "Invalid dates",
      },
    },
    price: {
      type: Number,
      required: true,
    },
    thumbnail: {
      type: String,
      required: false,
    },
    mainImage: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: true,
      validate: {
        validator: validateCategory,
        message: "Invalid category",
      },
    },
    video: {
      type: String,
      required: true,
    },
    eventURL: {
      type: String,
      required: false,
    },
    statusInfo: {
      type: statusSchema,
      default: {
        status: EventStatus.PENDING
      },
    },
    authorizationMode: {
      type: String,
      validate: {
        validator: validateAuthMode,
        message: "Invalid authorization mode",
      },
    },
    validetedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    validationDate: {
      type: Date,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    buyers: [
      {
        type: purchaseShcema,
      },
    ],
    emails: {
      type: emailSchema,
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("Event", EventSchema);
module.exports = Event;
