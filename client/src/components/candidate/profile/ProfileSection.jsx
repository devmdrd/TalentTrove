import React, { useState, useEffect } from "react";
import { FaEdit, FaPlus, FaTrash, FaTimes, FaCheck } from "react-icons/fa";

const FormInput = ({ field, formData, onChange }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">
      {field.placeholder}
      {field.required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {field.type === "select" ? (
      <select name={field.name} value={formData[field.name] || ""} onChange={onChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600" required={field.required}>
        <option value="">Select</option>
        {field.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    ) : field.type === "textarea" ? (
      <textarea name={field.name} rows={field.rows || 4} value={formData[field.name] || ""} onChange={onChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600" required={field.required} />
    ) : (
      <input type={field.type || "text"} name={field.name} value={formData[field.name] || ""} onChange={onChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600" required={field.required} />
    )}
  </div>
);

const ProfileSection = ({ title, items, fields, onAdd, onUpdate, onDelete }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [editingItem, setEditingItem] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const requiredFields = fields.filter(f => f.required && f.type !== "checkbox");
    setIsFormValid(requiredFields.every(f => formData[f.name]?.toString().trim() !== ""));
  }, [formData, fields]);

  const openModal = (item = null) => {
    setEditingItem(item);
    setFormData(item || fields.reduce((acc, field) => ({ ...acc, [field.name]: field.type === "checkbox" ? false : "" }), {}));
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleChange = ({ target: { name, value, type, checked } }) => setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));

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
  };

  return (
    <div className="profile-section bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <button onClick={() => openModal()} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <FaPlus size={14} /> Add
        </button>
      </div>
      {items.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-xl">
          <FaPlus className="mx-auto w-12 h-12 bg-indigo-100 rounded-full text-blue-600 mb-3" />
          <p className="text-gray-500 mb-4">No {title.toLowerCase()} found</p>
          <button onClick={() => openModal()} className="text-blue-600 hover:text-blue-800">Add your first {title.toLowerCase()}</button>
        </div>
      ) : (
        <div style={{ maxHeight: "200px", overflowY: "auto", scrollbarWidth: "thin" }} className="p-4">
          <div className="grid grid-cols-1 gap-4">
            {items.map(item => (
              <div key={item._id} className="bg-white shadow-sm rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-base text-gray-900">{item.name}</h3>
                    {fields.slice(1).map(field => (
                      <p key={field.name} className="text-xs text-gray-600 mt-2">{item[field.name] || <span className="text-gray-400">Not specified</span>}</p>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openModal(item)} className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full"><FaEdit size={14} /></button>
                    <button onClick={() => handleDelete(item._id)} className={`p-2 rounded-full transition-all duration-300 ${confirmDeleteId === item._id ? "bg-red-100 text-red-600" : "text-gray-500 hover:text-red-600 hover:bg-red-50"}`}>
                      {confirmDeleteId === item._id ? <FaCheck size={14} /> : <FaTrash size={14} />}
                    </button>
                  </div>
                </div>
                {confirmDeleteId === item._id && <div className="mt-2 text-xs text-red-500">Click again to confirm deletion</div>}
              </div>
            ))}
          </div>
        </div>
      )}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="font-bold text-lg">{editingItem ? "Edit" : "Add"} {title}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className={`grid gap-4 ${fields.filter(f => f.name !== "description" && f.type !== "checkbox").length > 1 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
                {fields.filter(f => f.name !== "description" && f.type !== "checkbox").map(field => (
                  <FormInput key={field.name} field={field} formData={formData} onChange={handleChange} />
                ))}
              </div>
              {fields.filter(f => f.name === "description").map(field => (
                <FormInput key={field.name} field={field} formData={formData} onChange={handleChange} />
              ))}
              {fields.filter(f => f.type === "checkbox").length > 0 && (
                <div className="flex flex-col space-y-2 pt-2">
                  {fields.filter(f => f.type === "checkbox").map(field => (
                    <label key={field.name} className="inline-flex items-center">
                      <input type="checkbox" name={field.name} checked={formData[field.name] || false} onChange={handleChange} className="form-checkbox h-4 w-4 text-blue-600" />
                      <span className="ml-2 text-sm text-gray-700">{field.placeholder}</span>
                    </label>
                  ))}
                </div>
              )}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                <button type="submit" disabled={!isFormValid} className={`px-4 py-2 rounded-lg text-white ${isFormValid ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}>{editingItem ? "Update" : "Add"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
