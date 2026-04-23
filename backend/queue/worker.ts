import { Worker } from "bullmq";
import nodemailer from "nodemailer"
import { redisConnection } from './queue';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const emailWorker = new Worker(
  'emailQueue',
  async (job) => {
    // job.data is whatever you passed as the second argument to emailQueue.add()
    const { emails, itemName, expiryDate } = job.data;

    //    Send to all household members in parallel instead of one-by-one
    //    Promise.all fails fast ,if one email fails the whole job retries,
    //    which is fine since nodemailer is idempotent (re-sending is safe).
    await Promise.all(
      emails.map((email: string) =>
        transporter.sendMail({
          from: process.env.SMTP_USER,
          to: email,
          subject: `${itemName} is expiring soon`,
          text: `Hi! Just a heads-up: ${itemName} in your household expires on ${expiryDate}. Use it before it's wasted!`,
        })
      )
    );

    console.log(`[EmailWorker] Sent expiry alerts for "${itemName}" to ${emails.length} member(s)`);
  },
  {
    connection: redisConnection
  }
);

// Listen for worker-level errors so the process doesn't crash silently
emailWorker.on('failed', (job, err) => {
  console.error(`[EmailWorker] Job ${job?.id} failed:`, err.message);
});

emailWorker.on('completed', (job) => {
  console.log(`[EmailWorker] Job ${job.id} completed`);
});
