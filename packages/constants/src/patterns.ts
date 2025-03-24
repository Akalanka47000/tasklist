export const regex = {
  name: /^[a-zA-Z\s]*$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&^()._*?]{8,30}$/,
  hash: /^\$2[ayb]\$.{56}$/ // bcrypt hash
};

export const passwordValidationFailureMessage =
  'Password should have at least one lowercase letter, one uppercase letter, one number and one special character and should be at least 8 characters long';
