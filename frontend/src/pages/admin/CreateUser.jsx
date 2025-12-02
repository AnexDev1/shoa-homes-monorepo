import { Toaster, toast } from 'react-hot-toast';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import LoadingSpinner from '../../components/LoadingSpinner';
import { userAPI } from '../../services/api';
import { User, Mail, Phone, UserPlus, Search } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const CreateUser = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: 'Agent123',
    role: 'AGENT',
  });

  const createAgentMutation = useMutation({
    mutationFn: (agentData) => userAPI.create(agentData),
    onSuccess: () => {
      toast.success('Agent created successfully!');
      setShowCreateForm(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: 'defaultPassword123!',
        role: 'AGENT',
      });
      queryClient.invalidateQueries({ queryKey: ['admin-all-agents'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create agent');
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('Name and email are required');
      return;
    }
    createAgentMutation.mutate(formData);
  };

  const {
    data: clients = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['admin-all-clients'],
    queryFn: async () => {
      const agents = await userAPI.getAll();
      const agentMap = agents.reduce((acc, agent) => {
        if (agent.role === 'AGENT') acc[agent.id] = agent;
        return acc;
      }, {});

      const allClients = [];
      for (const agentId of Object.keys(agentMap)) {
        try {
          const clients = await userAPI.getAgentClients(agentId);
          allClients.push(
            ...clients.map((client) => ({
              ...client,
              agentName: agentMap[agentId]?.name || 'Unknown Agent',
              agentEmail: agentMap[agentId]?.email || '',
            }))
          );
        } catch (err) {
          console.error(`Error fetching clients for agent ${agentId}:`, err);
        }
      }

      return allClients;
    },
    enabled: !!user?.id,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const filteredClients = clients.filter(
    (client) =>
      client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone?.includes(searchQuery) ||
      client.agentName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-red-200 text-red-800 rounded">
        Failed to load clients: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Toaster position="top-right" />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Agents Management</h1>
          <p className="text-gray-600">
            View and manage all agents and their clients
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <UserPlus className="h-5 w-5 mr-2" />
          Create New Agent
        </button>
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Create New Agent</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      required
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
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      required
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
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <span className="inline-flex items-center px-3 py-2 border border-gray-300 bg-gray-100 text-gray-500 rounded-md">
                      AGENT
                    </span>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    disabled={createAgentMutation.isPending}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    disabled={createAgentMutation.isPending}
                  >
                    {createAgentMutation.isPending
                      ? 'Creating...'
                      : 'Create Agent'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH BAR */}
      <div className="relative mb-6 max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search clients by name"
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* CLIENT TABLE */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Assigned Agent
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Notes
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4 text-sm font-medium text-gray-900">
                          {client.name}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 space-y-1">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          {client.email}
                        </div>
                        {client.phone && (
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-gray-400" />
                            {client.phone}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.agentName}
                      <div className="text-xs text-gray-400">
                        {client.agentEmail}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.notes || 'No notes'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    <User className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    No clients found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
