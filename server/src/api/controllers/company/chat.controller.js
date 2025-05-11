const Chat = require('../../models/chat.model.js');
const User = require('../../models/user.model.js');

exports.getCandidates = async (req, res) => {
  try {
    const { companyId } = req.params;
    const chats = await Chat.find({ companyId })
      .populate('candidateId', 'name email candidateProfile.profilePicture online')
      .sort({ updatedAt: -1 });
    res.status(200).json(chats.map(chat => chat.candidateId));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getOrCreateChat = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { candidateId } = req.query;

    if (!candidateId) {
      return this.getCandidates(req, res);
    }

    let chat = await Chat.findOne({ companyId, candidateId })
      .populate('candidateId', 'name email candidateProfile.profilePicture online')
      .populate('messages.senderId', 'name email');

    if (!chat) {
      const candidate = await User.findById(candidateId);
      if (!candidate) {
        return res.status(404).json({ message: 'Candidate not found' });
      }
      chat = await Chat.create({ companyId, candidateId, messages: [] });
      chat = await chat.populate('candidateId', 'name email candidateProfile.profilePicture online');
    }

    res.status(200).json(chat);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { companyId, candidateId } = req.params;
    const chat = await Chat.findOne({ companyId, candidateId })
      .populate('messages.senderId', 'name email');
    res.status(200).json(chat ? chat.messages : []);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { companyId, candidateId } = req.params;
    const { senderId, content, files = [] } = req.body;

    const message = {
      senderId,
      content,
      files,
      timestamp: new Date(),
      seenBy: [senderId]
    };

    const chat = await Chat.findOneAndUpdate(
      { companyId, candidateId },
      { 
        $push: { messages: message },
        $set: { updatedAt: new Date() }
      },
      { new: true, upsert: true }
    ).populate('messages.senderId', 'name email');

    const newMessage = chat.messages[chat.messages.length - 1];
    
    if (!res.headersSent) {
      res.status(200).json(newMessage);
    }
    
    req.io.to(candidateId).emit('message', newMessage);

  } catch (err) {
    if (!res.headersSent) {
      res.status(400).json({ message: err.message });
    } else {
      console.error(err);
    }
  }
};
