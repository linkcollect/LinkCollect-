import Email from '../utils/sendEmail'
import User from "../models/user";


class EmailService {

    async sendWeeklyEmail() {

        try {
            // find user
            const users = await User.find().sort({ createdAt: 1 });
            // Get the 50 users who were created the farthest back in time

            
            const usersToSendEmail = users.slice(0, 3);

                        // Send emails to these users
                for (const user of usersToSendEmail) {
                    const emailRes =  await Email.weeklyFeatureEmail(user.name, user.email);
                    // Send the email using your email sending method
                    // Example: await sendEmail(user.email, 'Weekly Feature Email', emailContent);

                    console.log("res from ",user.email, "is", emailRes)
                }

      
            return usersToSendEmail;
          } catch (error) {
            throw error;
          }

    }
}


export default EmailService;
