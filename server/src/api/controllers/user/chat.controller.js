const Chat = require('../../models/chat.model.js');
const User = require('../../models/user.model.js');

exports.getChats = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const chats = await Chat.find({ candidateId })
      .populate('companyId', 'name email')
      .sort({ updatedAt: -1 });
    res.status(200).json(chats.map(chat => chat.companyId));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getMessagesForCompany = async (req, res) => {
  try {
    const { candidateId, companyId } = req.params;
    const chat = await Chat.findOne({ candidateId, companyId })
      .populate('messages.senderId', 'name email')
      .populate('companyId', 'name email');
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    res.status(200).json(chat.messages);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { candidateId, companyId } = req.params;
    const { senderId, content, files = [] } = req.body;
    
    const message = {
      senderId,
      content,
      files,
      timestamp: new Date(),
      seenBy: [senderId]
    };

    let chat = await Chat.findOne({ candidateId, companyId });
    if (!chat) {
      const candidate = await User.findById(candidateId);
      const company = await User.findById(companyId);
      if (!candidate || !company) {
        return res.status(404).json({ message: 'Candidate or Company not found' });
      }
      chat = new Chat({ candidateId, companyId, messages: [] });
    }
    chat.messages.push(message);
    chat.updatedAt = new Date();

    await chat.save();
    const newMessage = chat.messages[chat.messages.length - 1];
    res.status(200).json(newMessage);
    req.io.to(companyId).emit('message', newMessage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
