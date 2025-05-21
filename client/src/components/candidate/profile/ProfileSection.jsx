import React, { useState, useEffect } from "react";
import { FaEdit, FaPlus, FaTrash, FaTimes, FaCheck, FaEllipsisV } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const FormInput = ({ field, formData, onChange }) => (
  <div className="flex flex-col space-y-1.5">
    <label className="text-sm font-medium text-gray-700">
      {field.placeholder}
      {field.required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {field.type === "select" ? (
      <select 
        name={field.name} 
        value={formData[field.name] || ""} 
        onChange={onChange} 
        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        required={field.required}
      >
        <option value="">Select an option</option>
        {field.options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    ) : field.type === "textarea" ? (
      <textarea 
        name={field.name} 
        rows={field.rows || 4} 
        value={formData[field.name] || ""} 
        onChange={onChange} 
        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none" 
        required={field.required} 
      />
    ) : (
      <input 
        type={field.type || "text"} 
        name={field.name} 
        value={formData[field.name] || ""} 
        onChange={onChange} 
        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
        required={field.required} 
      />
    )}
  </div>
);

const ProfileSection = ({ title, items, fields, onAdd, onUpdate, onDelete }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [editingItem, setEditingItem] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const requiredFields = fields.filter(f => f.required && f.type !== "checkbox");
    setIsFormValid(requiredFields.every(f => formData[f.name]?.toString().trim() !== ""));
  }, [formData, fields]);

  const openModal = (item = null) => {
    setEditingItem(item);
    setFormData(item || fields.reduce((acc, field) => ({ ...acc, [field.name]: field.type === "checkbox" ? false : "" }), {}));
    setModalOpen(true);
    setActiveDropdown(null);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleChange = ({ target: { name, value, type, checked } }) => {
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await (editingItem ? onUpdate(editingItem._id, { ...formData, _id: editingItem._id }) : onAdd(formData));
      closeModal();
    } catch (error) {
      console.error("Submit failed", error);
    }
  };

  const handleDelete = async (id) => {
    if (confirmDeleteId === id) {
      await onDelete(id);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
      setTimeout(() => setConfirmDeleteId(null), 3000);
    }
    setActiveDropdown(null);
  };

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  return (
    <div className="profile-section bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <button 
          onClick={() => openModal()} 
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <FaPlus size={14} /> Add New
        </button>
      </div>

      {items.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200"
        >
          <div className="mx-auto w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center text-blue-600 mb-3">
            <FaPlus size={20} />
          </div>
          <p className="text-gray-500 mb-4">No {title.toLowerCase()} found</p>
          <button 
            onClick={() => openModal()} 
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            Add your first {title.toLowerCase()}
          </button>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <motion.div 
              key={item._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-4 border border-gray-100 hover:border-gray-200 transition-all shadow-xs hover:shadow-sm relative"
            >
              <div className="flex justify-between items-start">
                <div className="pr-4">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  {fields.slice(1).map(field => (
                    <p key={field.name} className="text-sm text-gray-600 mt-1.5">
                      {item[field.name] || <span className="text-gray-400">Not specified</span>}
                    </p>
                  ))}
                </div>
                
                <div className="relative">
                  <button 
                    onClick={() => toggleDropdown(item._id)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    <FaEllipsisV size={14} />
                  </button>
                  
                  {activeDropdown === item._id && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-100"
                    >
                      <button 
                        onClick={() => openModal(item)}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <FaEdit className="mr-2" size={12} /> Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(item._id)}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      >
                        <FaTrash className="mr-2" size={12} /> 
                        {confirmDeleteId === item._id ? "Confirm Delete" : "Delete"}
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-xl w-full max-w-md overflow-hidden border border-gray-100 shadow-xl"
            >
              <div className="flex justify-between items-center p-5 border-b border-gray-100">
                <h3 className="font-bold text-lg text-gray-800">
                  {editingItem ? "Edit" : "Add"} {title}
                </h3>
                <button 
                  onClick={closeModal} 
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                >
                  <FaTimes />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-5 space-y-5">
                <div className={`grid gap-5 ${fields.filter(f => f.name !== "description" && f.type !== "checkbox").length > 1 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
                  {fields.filter(f => f.name !== "description" && f.type !== "checkbox").map(field => (
                    <FormInput key={field.name} field={field} formData={formData} onChange={handleChange} />
                  ))}
                </div>
                
                {fields.filter(f => f.name === "description").map(field => (
                  <FormInput key={field.name} field={field} formData={formData} onChange={handleChange} />
                ))}
                
                {fields.filter(f => f.type === "checkbox").length > 0 && (
                  <div className="flex flex-col space-y-3 pt-2">
                    {fields.filter(f => f.type === "checkbox").map(field => (
                      <label key={field.name} className="inline-flex items-center">
                        <input 
                          type="checkbox" 
                          name={field.name} 
                          checked={formData[field.name] || false} 
                          onChange={handleChange} 
                          className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300" 
                        />
                        <span className="ml-2 text-sm text-gray-700">{field.placeholder}</span>
                      </label>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button 
                    type="button" 
                    onClick={closeModal} 
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={!isFormValid} 
                    className={`px-4 py-2 rounded-lg text-white transition-colors ${
                      isFormValid 
                        ? "bg-blue-600 hover:bg-blue-700 shadow-sm" 
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    {editingItem ? "Save Changes" : "Add Item"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileSection;