import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inquiriesAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const InquiryManagement = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all'); // all, unread, read

  const { data: inquiries, isLoading } = useQuery({
    queryKey: ['inquiries', filter],
    queryFn: () => inquiriesAPI.getAll({ status: filter !== 'all' ? filter : undefined }),
  });

  const markAsReadMutation = useMutation({
    mutationFn: inquiriesAPI.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries(['inquiries']);
    },
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Inquiry Management</h1>
        <p className="text-gray-600">Manage customer inquiries and requests</p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-md p-1 inline-flex">
        {['all', 'unread', 'read'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-6 py-2 rounded-lg font-semibold capitalize transition-colors ${
              filter === status
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Inquiries List */}
      <div className="bg-white rounded-xl shadow-md">
        {isLoading ? (
          <div className="py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : inquiries?.data?.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">✉️</div>
            <h3 className="text-xl font-bold mb-2">No Inquiries Found</h3>
            <p className="text-gray-600">
              {filter === 'all'
                ? 'No inquiries have been received yet'
                : `No ${filter} inquiries`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {inquiries?.data?.map((inquiry) => (
                  <tr
                    key={inquiry.id}
                    className={`hover:bg-gray-50 ${
                      inquiry.status === 'unread' ? 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          inquiry.status === 'unread'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {inquiry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold">{inquiry.name}</div>
                        <div className="text-sm text-gray-600">{inquiry.email}</div>
                        {inquiry.phone && (
                          <div className="text-sm text-gray-600">{inquiry.phone}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <div className="font-semibold truncate">
                          {inquiry.property?.title || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {inquiry.propertyId || 'General Inquiry'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-sm text-sm text-gray-700 line-clamp-2">
                        {inquiry.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(inquiry.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {inquiry.status === 'unread' && (
                        <button
                          onClick={() => markAsReadMutation.mutate(inquiry.id)}
                          disabled={markAsReadMutation.isPending}
                          className="text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          Mark Read
                        </button>
                      )}
                      <a
                        href={`mailto:${inquiry.email}`}
                        className="text-primary-600 hover:text-primary-800 font-semibold"
                      >
                        Reply
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl mb-2">📬</div>
          <h3 className="text-gray-600 text-sm mb-1">Total Inquiries</h3>
          <p className="text-3xl font-bold">{inquiries?.total || 0}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl mb-2">📩</div>
          <h3 className="text-gray-600 text-sm mb-1">Unread</h3>
          <p className="text-3xl font-bold text-blue-600">
            {inquiries?.data?.filter((i) => i.status === 'unread').length || 0}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-3xl mb-2">✅</div>
          <h3 className="text-gray-600 text-sm mb-1">Read</h3>
          <p className="text-3xl font-bold text-green-600">
            {inquiries?.data?.filter((i) => i.status === 'read').length || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InquiryManagement;
