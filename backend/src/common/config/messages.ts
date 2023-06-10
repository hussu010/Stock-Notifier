const successMessages = {
  OTP_SENT_SUCCESSFULLY: 'OTP has been successfully sent to your phone number.',
};

const errorMessages = {
  CANNOT_SEND_OTP:
    'Something went wrong while sending OTP. Please try again later!!',
  INVALID_OTP:
    'The OTP you entered is invalid. Please check the code and try again.',
  INVALID_PHONE_NUMBER:
    'The phone number you entered is not valid. Please enter a valid phone number to continue.',
  INVALID_OTP_LENGTH:
    'Invalid OTP code length. Please enter a 6-digit code to proceed.',
  INVALID_JWT_TYPE: 'Please use refresh token to generate a new access token.',
  USER_ASSOCIATED_WITH_JWT_NOT_FOUND: 'User associated with JWT not found.',
  OBJECT_WITH_ID_NOT_FOUND: 'Object with given ID not found.',
  INVALID_OBJECT_ID: 'Invalid Object ID.',
  USER_NOT_AUTHORIZED: 'You do not have permission to perform this action',
  USER_PROFILE_NOT_FOUND: 'User profile not found.',
  OBJECT_ALREADY_EXISTS: 'Object already exists.',
  USERNAME_UNAVAILABLE: 'Username is already taken.',
  DATA_NOT_FOUND: 'Price Unaviable.',
};

export { successMessages, errorMessages };
