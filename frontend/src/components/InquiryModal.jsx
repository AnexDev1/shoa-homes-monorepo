import { useState } from 'react';
import { useModalStore } from '../store/modalStore';
import { useMutation } from '@tanstack/react-query';
import { inquiriesAPI } from '../services/api';

const InquiryModal = () => {
  const { isInquiryModalOpen, selectedProperty, closeInquiryModal } = useModalStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const mutation = useMutation({
    mutationFn: (data) => inquiriesAPI.create(data),
    onSuccess: () => {
      alert('Inquiry submitted successfully!');
      closeInquiryModal();
      setFormData({ name: '', email: '', phone: '', message: '' });
    },
    onError: () => {
      alert('Failed to submit inquiry. Please try again.');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      ...formData,
      propertyId: selectedProperty?.id,
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!isInquiryModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={closeInquiryModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold mb-4">Send Inquiry</h2>
        {selectedProperty && (
          <p className="text-gray-600 mb-6">
            Property: <span className="font-semibold">{selectedProperty.title}</span>
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input-field"
              placeholder="+251 911 234567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="4"
              className="input-field"
              placeholder="I'm interested in this property..."
            />
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="btn-primary w-full"
          >
            {mutation.isPending ? 'Sending...' : 'Send Inquiry'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InquiryModal;
