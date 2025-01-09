import axios from 'axios';

export async function ValidateHuman(token: string) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    throw new Error('Secret key is not defined');
  }

  try {
    const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
      params: {
        secret: secretKey,
        response: token,
      },
    });

    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('Error verifying reCAPTCHA: ' + error.message);
    } else {
      throw new Error('An unknown error occurred during reCAPTCHA verification');
    }
  }
}
