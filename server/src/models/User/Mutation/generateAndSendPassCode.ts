import { Twilio } from 'twilio';

import { IContext } from '../../../types';

import { GenerateAndSendPassCodeResponse, MutationGenerateAndSendPassCodeArgs } from '../../../generated';

const {
  TWILIO_AUTH_TOKEN = '',
  TWILIO_ACCOUNT_SID = '',
  NODE_ENV = 'dev',
  TWILIO_IDENTIFICATION_VERIFICATION_MESSAGE_MESSAGING_SID = '',
} = process.env;

const twilioClient = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

/**
 * Create a short lived token with a random 6 digit number
 */
async function generateAndSendPassCode(
  parent: undefined,
  args: MutationGenerateAndSendPassCodeArgs,
  context: IContext,
): Promise<GenerateAndSendPassCodeResponse> {
  try {
    const expirationDate = new Date();
    expirationDate.setMinutes(new Date().getMinutes() + 2);

    const { phoneNumber } = args.input;

    // Remove any existing pass codes for this number
    await context.models.PassCodeToken.remove({
      phoneNumber,
    });

    if (NODE_ENV === 'production') {
      const isFakeNumber = phoneNumber.includes('+1555');

      let passCode = Math.floor(100000 + Math.random() * 900000).toString();

      // TODO: Move this to a staging env
      if (isFakeNumber) {
        passCode = '111112';
      }

      await context.models.PassCodeToken.create({
        passCode,
        phoneNumber,
        expirationDate,
      });

      if (!isFakeNumber) {
        await twilioClient.messages.create({
          body: `Your HomePost verification code is: ${passCode}`,
          messagingServiceSid: TWILIO_IDENTIFICATION_VERIFICATION_MESSAGE_MESSAGING_SID,
          to: phoneNumber,
        });
      }
    } else {
      const passCode = '123456';

      await context.models.PassCodeToken.create({
        passCode,
        phoneNumber,
        expirationDate,
      });
    }

    return {
      success: true,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.toString(),
    };
  }
}

export default generateAndSendPassCode;
