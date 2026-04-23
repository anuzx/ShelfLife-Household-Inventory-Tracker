import { emailQueue } from './queue';

type EmailPayload = {
  emails: string[]; //all household member emails 
  itemName: string;
  expiryDate: Date | string;
  itemId: string;
}

export const sendExpiryEmail = async (
  data: EmailPayload,
  options?: {
    delay?: number
  }) => {
  // emailQueue.add(jobName, payload, options)
  // jobName  → just a label to identify the job type ("send-email")
  // payload  → the data your Worker will receive as job.data
  // options  → retry strategy so transient failures don't silently drop emails

  await emailQueue.add('send-email', data, {
    delay: options?.delay,
    attempts: 3, // retry if fails
    backoff: {
      type: 'exponential',
      delay: 2000
    },
    removeOnComplete: true,
    removeOnFail: false
  });

};
