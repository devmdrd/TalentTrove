const User = require('../../models/user.model.js');
const Experience = require('../../models/experience.model.js');
const Education = require('../../models/education.model.js');
const Certificate = require('../../models/certificate.model.js');
const Project = require('../../models/project.model.js');
const { ObjectId } = require('mongoose').Types;

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('name email mobile candidateProfile')
            .lean() 
            .populate([
                { path: 'candidateProfile.educationsId', model: 'Education' },
                { path: 'candidateProfile.experiencesId', model: 'Experience' },
                { path: 'candidateProfile.projectsId', model: 'Project' },
                { path: 'candidateProfile.certificationsId', model: 'Certificate' }
            ]);

        if (!user) return res.status(404).json({ message: 'User not found' });

        const profile = user.candidateProfile || {};
        return res.json({
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            profilePicture: profile.profilePicture || null,
            dateOfBirth: profile.dateOfBirth || null,
            gender: profile.gender || null,
            address: profile.address || null,
            about: profile.about || '',
            skills: profile.skills || [],
            languages: profile.languages || [],
            resume: profile.resumeOrCv || null,
            experiences: profile.experiencesId || [],
            educations: profile.educationsId || [],
            certifications: profile.certificationsId || [],
            projects: profile.projectsId || []
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching profile data', error: error.message });
    }
};

exports.addToProfile = async (req, res) => {
    try {
        const { section, ...data } = req.body;

        const modelMap = {
            experiences: Experience,
            educations: Education,
            certifications: Certificate,
            projects: Project,
        };

        const Model = modelMap[section];

        if (Model) {
            const newEntry = await new Model({ ...data, user: req.user.id }).save();
            const path = `${section}Id`;

            await User.findByIdAndUpdate(
                req.user.id,
                { $addToSet: { [`candidateProfile.${path}`]: newEntry._id } },
                { new: true }
            );

            return res.json({ [section]: newEntry });
        }

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (section === 'skills' && data.name) {
            const alreadyExists = user.candidateProfile.skills?.some(s => s.name === data.name);
            if (!alreadyExists) {
                const newSkill = { _id: new ObjectId(), name: data.name };
                user.candidateProfile.skills.push(newSkill);
                await user.save();
                return res.json({ skills: newSkill });
            } else {
                return res.status(400).json({ message: 'Skill already exists' });
            }
        }

        if (section === 'languages' && data.name) {
            const alreadyExists = user.candidateProfile.languages?.some(l => l.name === data.name);
            if (!alreadyExists) {
                const newLanguage = { _id: new ObjectId(), name: data.name, proficiency: data.proficiency };
                user.candidateProfile.languages.push(newLanguage);
                await user.save();
                return res.json({ languages: newLanguage });
            } else {
                return res.status(400).json({ message: 'Language already exists' });
            }
        }

        return res.status(400).json({ message: 'Invalid section type or missing data' });

    } catch (error) {
        return res.status(500).json({
            message: `Error adding ${req.body.section}`,
            error: error.message,
        });
    }
};
  
exports.updateTheProfile = async (req, res) => {
    try {
        const { section, id, ...data } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const profilePicture = req.files && req.files['profilePicture']?.[0]?.filename || null;
        const resumeOrCv = req.files && req.files['resumeOrCv']?.[0]?.filename || null;
  
        const Model = {
            experiences: Experience,
            educations: Education,
            certifications: Certificate,
            projects: Project
        }[section];
        
        if (Model) {
            const updatedItem = await Model.findOneAndUpdate({ _id: id }, data, { new: true });
            if (!updatedItem) return res.status(404).json({ message: 'Item not found or unauthorized' });
            return res.json({ [section]: updatedItem });
        }        
  
        if (section === 'languages') {
            user.candidateProfile.languages = user.candidateProfile.languages.filter(l => l._id?.toString() !== id);
            if (data.name) {
                const updatedLanguage = { _id: new ObjectId(), name: data.name, proficiency: data.proficiency };
                user.candidateProfile.languages.push(updatedLanguage);
                await user.save();
                return res.json({ languages: updatedLanguage });
            }
        } else if (section === 'skills') {
            user.candidateProfile.skills = user.candidateProfile.skills.filter(s => s._id.toString() !== id);
            if (data.name) {
                const updatedSkill = { _id: new ObjectId(), name: data.name };
                user.candidateProfile.skills.push(updatedSkill);
                await user.save();
                return res.json({ skills: updatedSkill });
            }
        } else if (section === 'profilePicture') {
            if (!profilePicture) return res.status(400).json({ message: 'No file uploaded for profilePicture' });
            user.candidateProfile.profilePicture = profilePicture;
        } else if (section === 'resumeOrCv') {
            if (!resumeOrCv) return res.status(400).json({ message: 'No file uploaded for resumeOrCv' });
            user.candidateProfile.resumeOrCv = resumeOrCv;
        } else if (section === 'basicInfo') {
            ['about', 'dateOfBirth', 'gender', 'address'].forEach(key => {
              if (data[key] !== undefined) user.candidateProfile[key] = data[key];
            });
            ['name', 'email', 'mobile'].forEach(key => {
              if (data[key] !== undefined) user[key] = data[key];
            });
        } else {
            return res.status(400).json({ message: 'Invalid section type' });
        }
  
        await user.save();
        return res.json({ candidateProfile: user.candidateProfile });
  
    } catch (error) {
        return res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
}
  
exports.deleteFromProfile = async (req, res) => {
    try {
        const { section, id } = req.params;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
  
        const Model = {
            experiences: Experience,
            educations: Education,
            certifications: Certificate,
            projects: Project
        }[section];
        
        if (Model) {
            const user = await User.findOne({ 
                [`candidateProfile.${section}Id`]: id, 
                _id: req.user.id 
            });
            if (!user) return res.status(404).json({ message: 'Item not found or unauthorized' });
        
            user.candidateProfile[`${section}Id`] = user.candidateProfile[`${section}Id`].filter(item => !item.equals(id));
            await user.save();
        
            const deleted = await Model.findOneAndDelete({ _id: id });
            if (!deleted) return res.status(404).json({ message: 'Item not found or unauthorized' });
        
            return res.json({ [section]: await Model.find() });
        }                         
  
        if (section === 'languages') {
            user.candidateProfile.languages = user.candidateProfile.languages.filter(lang => lang._id.toString() !== id);
        } else if (section === 'skills') {
            user.candidateProfile.skills = user.candidateProfile.skills.filter(
                skillId => !skillId.equals(new ObjectId(id)) 
            );
        } else if (section === 'profilePicture') {
            user.candidateProfile.profilePicture = null;
        } else if (section === 'resumeOrCv') {
            user.candidateProfile.resumeOrCv = null;
        } else {
            return res.status(400).json({ message: 'Invalid section type' });
        }
  
        await user.save();
        return res.json({ candidateProfile: user.candidateProfile });
  
    } catch (error) {
        return res.status(500).json({ message: `Error deleting ${section}`, error: error.message });
    }
}
  