import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { newsEventsAPI } from '../../services/api';
import { resolveImageUrl } from '../../utils/imageUrl';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast, { Toaster } from 'react-hot-toast';

const CATEGORIES = [
  'Project Delivery',
  'Development News',
  'Construction Update',
  'Product Launch',
  'Construction News',
  'Project Planning',
  'Company News',
  'Community',
  'Open House',
  'Seminar',
  'Meetup',
  'Other',
];

const emptyForm = {
  title: '',
  excerpt: '',
  content: '',
  type: 'news',
  category: 'Company News',
  date: new Date().toISOString().split('T')[0],
  startTime: '',
  endTime: '',
  location: '',
  published: true,
};

const NewsEventsManagement = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch all news events (admin — includes unpublished)
  const { data: response, isLoading } = useQuery({
    queryKey: ['admin-news-events', filterType],
    queryFn: () =>
      newsEventsAPI.adminGetAll({
        limit: 200,
        ...(filterType ? { type: filterType } : {}),
      }),
  });

  const items = response?.data || [];

  // Mutations
  const createMutation = useMutation({
    mutationFn: newsEventsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-news-events']);
      closeModal();
      toast.success('Created successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => newsEventsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-news-events']);
      closeModal();
      toast.success('Updated successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: newsEventsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-news-events']);
      toast.success('Deleted successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete');
    },
  });

  // ────────────────────────── Helpers ──────────────────────────

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData(emptyForm);
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(false);
    setIsSubmitting(false);
  };

  const openCreate = () => {
    setEditingItem(null);
    setFormData(emptyForm);
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(false);
    setIsModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    // parse existing time into startTime/endTime if possible
    const { start, end } = parseTimeRange(item.time);
    setFormData({
      title: item.title,
      excerpt: item.excerpt,
      content: item.content,
      type: item.type,
      category: item.category,
      date: new Date(item.date).toISOString().split('T')[0],
      startTime: start,
      endTime: end,
      location: item.location || '',
      published: item.published,
    });
    setImageFile(null);
    setImagePreview(resolveImageUrl(item.image) || null);
    setRemoveImage(false);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be under 10 MB');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setRemoveImage(false);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(true);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Time helpers — parse and format between HH:MM (24h) and 12-hour display
  const parseTimePartTo24 = (part) => {
    if (!part) return '';
    part = part.trim();
    const ampmMatch = part.match(/(\\d{1,2}):(\\d{2})\\s*(AM|PM)/i);
    if (ampmMatch) {
      let hh = parseInt(ampmMatch[1], 10);
      const mm = ampmMatch[2];
      const ampm = ampmMatch[3].toUpperCase();
      if (ampm === 'PM' && hh !== 12) hh += 12;
      if (ampm === 'AM' && hh === 12) hh = 0;
      return `${hh.toString().padStart(2, '0')}:${mm}`;
    }
    // If it's already HH:MM
    const hhmmMatch = part.match(/^(\\d{1,2}):(\\d{2})$/);
    if (hhmmMatch) {
      return `${hhmmMatch[1].padStart(2, '0')}:${hhmmMatch[2]}`;
    }
    return '';
  };

  const parseTimeRange = (timeStr) => {
    if (!timeStr) return { start: '', end: '' };
    const parts = timeStr.split('-').map((p) => p.trim());
    const start = parseTimePartTo24(parts[0] || '');
    const end = parts[1] ? parseTimePartTo24(parts[1]) : '';
    return { start, end };
  };

  const formatTime12 = (hhmm) => {
    if (!hhmm) return '';
    const [hStr, mStr] = hhmm.split(':');
    if (!mStr) return hhmm;
    let h = parseInt(hStr, 10);
    const m = mStr;
    const ampm = h >= 12 ? 'PM' : 'AM';
    if (h === 0) h = 12;
    const hh = ((h + 11) % 12) + 1;
    return `${hh}:${m.padStart(2, '0')} ${ampm}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (
      !formData.title ||
      !formData.excerpt ||
      !formData.content ||
      !formData.date
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const fd = new FormData();
      fd.append('title', formData.title);
      fd.append('excerpt', formData.excerpt);
      fd.append('content', formData.content);
      fd.append('type', formData.type);
      fd.append('category', formData.category);
      fd.append('date', formData.date);
      fd.append('published', formData.published);
      // Build time string from start/end time inputs (12-hour friendly)
      let timeValue = '';
      if (formData.startTime && formData.endTime) {
        timeValue = `${formatTime12(formData.startTime)} - ${formatTime12(formData.endTime)}`;
      } else if (formData.startTime) {
        timeValue = formatTime12(formData.startTime);
      }
      if (timeValue) fd.append('time', timeValue);
      if (formData.location) fd.append('location', formData.location);
      if (imageFile) fd.append('image', imageFile);
      if (removeImage) fd.append('removeImage', 'true');

      if (editingItem) {
        await updateMutation.mutateAsync({ id: editingItem.id, data: fd });
      } else {
        await createMutation.mutateAsync(fd);
      }
    } catch {
      // errors handled by mutation callbacks
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (item) => {
    if (window.confirm(`Delete "${item.title}"? This cannot be undone.`)) {
      deleteMutation.mutate(item.id);
    }
  };

  // ────────────────────────── Render ──────────────────────────

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">News & Events</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage articles and events shown on the public website
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary whitespace-nowrap">
          + Add New
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { label: 'All', value: '' },
          { label: 'News', value: 'news' },
          { label: 'Events', value: 'event' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilterType(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterType === tab.value
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Items list */}
      {items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <div className="text-5xl mb-4">📰</div>
          <h3 className="text-lg font-medium text-gray-900">No items yet</h3>
          <p className="text-gray-500 mt-1">
            Create your first news article or event
          </p>
          <button onClick={openCreate} className="btn-primary mt-4">
            + Add New
          </button>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Image
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {resolveImageUrl(item.image) ? (
                        <img
                          src={resolveImageUrl(item.image)}
                          alt=""
                          className="w-14 h-10 object-cover rounded"
                        />
                      ) : (
                        <div className="w-14 h-10 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                          No img
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 line-clamp-1">
                        {item.title}
                      </div>
                      <div className="text-sm text-gray-500 line-clamp-1 md:hidden">
                        {item.type === 'event' ? '📅 Event' : '📰 News'}{' '}
                        &middot; {new Date(item.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.type === 'event'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {item.type === 'event' ? '📅 Event' : '📰 News'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">
                      {item.category}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          item.published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {item.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => openEdit(item)}
                        className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ────────────────── Modal ────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 overflow-y-auto py-8">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                {editingItem ? 'Edit' : 'Create'}{' '}
                {formData.type === 'event' ? 'Event' : 'News Article'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            {/* Modal body */}
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5 max-h-[75vh] overflow-y-auto"
            >
              {/* Type toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <div className="flex gap-3">
                  {['news', 'event'].map((t) => (
                    <label
                      key={t}
                      className={`flex-1 text-center py-2 rounded-lg cursor-pointer border-2 transition-colors text-sm font-medium ${
                        formData.type === t
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="type"
                        value={t}
                        checked={formData.type === t}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      {t === 'news' ? '📰 News' : '📅 Event'}
                    </label>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter title"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Excerpt / Short Summary *
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  required
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="A brief summary shown on the card"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Content *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Full article body…"
                />
              </div>

              {/* Date & Time row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                {formData.type === 'event' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Time
                      </label>
                      <input
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Time
                      </label>
                      <input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Location (events only) */}
              {formData.type === 'event' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Bole, Addis Ababa"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              )}

              {/* Image upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image
                </label>
                {imagePreview && (
                  <div className="relative mb-2 inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-w-xs h-40 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
                    >
                      &times;
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Max 10 MB. JPG, PNG, or WebP recommended.
                </p>
              </div>

              {/* Published toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="published"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="published"
                  className="text-sm font-medium text-gray-700"
                >
                  Published (visible on website)
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving…' : editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsEventsManagement;
