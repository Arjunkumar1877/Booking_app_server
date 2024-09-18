import otpGenerator from 'otp-generator';

export function otp(){
    const OTP = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
        digits: true,
      });

      return OTP
}