import { Schema, model, models } from 'mongoose';

const userSchema = new Schema(
    {
        email: { required: true, type: 'string', unique: true },
        username: { required: true, type: 'string', unique: true },
        password: { required: true, type: 'string' },
    },
    {
        timestamps: true,
    }
);

const User = models.User || model('User', userSchema);

export default User;
