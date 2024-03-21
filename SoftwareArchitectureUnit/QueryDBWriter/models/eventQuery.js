const mongoose = require("mongoose");
const { EventStatus } = require("../../utils/constants/eventStatus");
const {
  EventAuthorizationMode,
} = require("../../utils/constants/eventAuthorizationMode");
const { BadRequestException } = require("../exceptions/exceptions");

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

const purchaseShcema = {
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
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
  }
}
  

const emailSchema = {
  emailsSent: {
    type: Number,
  },
  emailsFailed: {
    type: Number,
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
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
    },
    eventDatesInfo: {
      type: eventDatesSchema,
      required: true,
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
    averagePurchaseTime: {
      type: Number,
      default: 0,
    },
    emails: {
      type: emailSchema,
      default: {
        emailsSent: 0,
        emailsFailed: 0,
      },
    },
    videoConcurrentClients: {
      type: Number,
      default: 0,
    },
    averageVideoTime: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("Event", EventSchema);
module.exports = Event;
