import { MessageModel } from "../models/Message.model.js";

class MessageManager {
    async createOne(email, message) {
        try {
            const savedMessage = await MessageModel.create({ email, message });
            return savedMessage;
        } catch (error) {
            throw error;
        }
    }

    async findAll() {
        try {
            const response = await MessageModel.find().lean();
            return response;
        } catch (error) {
            throw error;
        }
    }

    async findById(id) {
        try {
            const response = await MessageModel.findById(id);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async deleteOne(id) {
        try {
            const response = await MessageModel.deleteOne({ _id: id });
            return response;
        } catch (error) {
            throw error;
        }
    }
}

export const messageManager = new MessageManager();
