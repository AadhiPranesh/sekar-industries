import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const email = process.env.DEFAULT_ADMIN_EMAIL || 'admin@sekarindustries.com';
        const plainPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@12345';

        const existing = await Admin.findOne({ email });
        if (existing) {
            existing.password = plainPassword;
            await existing.save();
            console.log(`Updated existing admin: ${email}`);
        } else {
            await Admin.create({
                email,
                password: plainPassword
            });
            console.log(`Created default admin: ${email}`);
        }

        console.log('Admin seed completed successfully.');
    } catch (error) {
        console.error('Admin seed failed:', error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.connection.close();
    }
};

run();
