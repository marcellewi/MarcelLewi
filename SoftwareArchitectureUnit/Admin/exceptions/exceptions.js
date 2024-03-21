const HttpErrorCodes = {
  ERROR_404_NOT_FOUND: 404,
  ERROR_400_BAD_REQUEST: 400,
  ERROR_401_UNAUTHORIZED: 401,
  ERROR_403_FORBIDDEN: 403,
  ERROR_500_SERVER_ERROR: 500,
  HTTP_200_OK: 200,
};

const ErrorMessages = {
  ELEMENT_NOT_EXIST: 'No existe el elemento',
  INVALID_DATA: 'Elementos invalidos',
  OK: 'OK',
};

class NotFoundException extends Error {
  constructor(message) {
    super(message);
  }
}

class BadRequestException extends Error {
  constructor(message) {
    super(message);
  }
}

class UnauthorizeException extends Error {
  constructor(message) {
    super(message);
  }
}

class ForbiddenException extends Error {
  constructor(message) {
    super(message);
  }
}

const evalException = function (err, res) {
  if (err instanceof BadRequestException) {
    return res.status(HttpErrorCodes.ERROR_400_BAD_REQUEST).send(err.message);
  } if (err instanceof NotFoundException) {
    return res.status(HttpErrorCodes.ERROR_404_NOT_FOUND).send(err.message);
  } if (err instanceof UnauthorizeException) {
    return res.status(HttpErrorCodes.ERROR_401_UNAUTHORIZED).send(err.message);
  } if (err instanceof ForbiddenException) {
    return res.status(HttpErrorCodes.ERROR_403_FORBIDDEN).send(err.message);
  }
  return res.status(HttpErrorCodes.ERROR_500_SERVER_ERROR).send(err.message);
};

module.exports = {
  NotFoundException,
  BadRequestException,
  UnauthorizeException,
  ForbiddenException,
  HttpErrorCodes,
  ErrorMessages,
  evalException,
};
