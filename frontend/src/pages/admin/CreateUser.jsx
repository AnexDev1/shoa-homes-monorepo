import { Toaster, toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import LoadingSpinner from '../../components/LoadingSpinner';
import { userAPI } from '../../services/api';
import { User, Mail, Phone, UserPlus, Search, Trash2, X } from 'lucide-react';
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

  // Pagination state for agents
  const [agentsPage, setAgentsPage] = useState(1);
  const [agentsPerPage] = useState(5);

  // Pagination state for clients
  const [clientsPage, setClientsPage] = useState(1);
  const [clientsPerPage] = useState(5);

  // Query to fetch all agents
  const {
    data: agents = [],
    isLoading: agentsLoading,
    isError: agentsError,
  } = useQuery({
    queryKey: ['admin-all-agents'],
    queryFn: async () => {
      const allUsers = await userAPI.getAll();
      return allUsers.filter(user => user.role === 'AGENT');
    },
    enabled: !!user?.id,
  });

  // Pagination logic for agents
  const indexOfLastAgent = agentsPage * agentsPerPage;
  const indexOfFirstAgent = indexOfLastAgent - agentsPerPage;
  const currentAgents = agents.slice(indexOfFirstAgent, indexOfLastAgent);
  const totalPagesAgents = Math.ceil(agents.length / agentsPerPage);

  // Mutation to delete an agent
  const deleteAgentMutation = useMutation({
    mutationFn: (agentId) => userAPI.delete(agentId),
    onSuccess: () => {
      toast.success('Agent deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin-all-agents'] });
      queryClient.invalidateQueries({ queryKey: ['admin-all-clients'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete agent');
    },
  });

  const handleDeleteAgent = async (agentId, agentName) => {
    if (!window.confirm(`Are you sure you want to delete agent ${agentName}? This action cannot be undone.`)) {
      return;
    }
    deleteAgentMutation.mutate(agentId);
  };

  const handleDeleteClient = async (clientId, clientName) => {
    if (!window.confirm(`Are you sure you want to delete client ${clientName}? This action cannot be undone.`)) {
      return;
    }
    deleteClientMutation.mutate(clientId);
  };


  const createAgentMutation = useMutation({
    mutationFn: (agentData) => userAPI.create(agentData),
    onSuccess: () => {
      toast.success('Agent created successfully!');
      setShowCreateForm(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: 'Agent123',
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

  // Reset pagination when search query changes
  useEffect(() => {
    setClientsPage(1);
  }, [searchQuery]);
  const filteredClients = clients.filter(
    (client) =>
      client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone?.includes(searchQuery) ||
      client.agentName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic for clients
  const indexOfLastClient = clientsPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);
  const totalPagesClients = Math.ceil(filteredClients.length / clientsPerPage);

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
                  <X className="h-6 w-6" />
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

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      User Details
                    </label>
                    <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                      <div className="flex-1">
                        <span className="inline-flex items-center px-3 py-2 border border-gray-300 bg-gray-100 text-gray-500 rounded-md w-full">
                          Role: AGENT
                        </span>
                      </div>
                      <div className="flex-1">
                        <span className="inline-flex items-center px-3 py-2 border border-gray-300 bg-gray-100 text-gray-500 rounded-md w-full">
                          Password: Agent123
                        </span>
                      </div>
                    </div>
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

      {/* AGENTS TABLE */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Agents</h2>
          <p className="text-gray-600 text-sm mt-1">Manage agents and their information</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Agent
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {agentsLoading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                    <LoadingSpinner size="md" className="mx-auto" />
                  </td>
                </tr>
              ) : agentsError ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-red-500">
                    Failed to load agents
                  </td>
                </tr>
              ) : currentAgents.length > 0 ? (
                currentAgents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4 text-sm font-medium text-gray-900">
                          {agent.name}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 space-y-1">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          {agent.email}
                        </div>
                        {agent.phone && (
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-gray-400" />
                            {agent.phone}
                          </div>
                        )}
                      </div>
                    </td>


                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleDeleteAgent(agent.id, agent.name)}
                        disabled={deleteAgentMutation.isPending}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete Agent"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
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
                    No agents found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-center p-4 border-t">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setAgentsPage(prev => Math.max(prev - 1, 1))}
              disabled={agentsPage === 1}
              className="px-3 py-1 text-sm rounded border disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-2 text-sm">
              {agentsPage} of {totalPagesAgents || 1}
            </span>
            <button
              onClick={() => setAgentsPage(prev => Math.min(prev + 1, totalPagesAgents))}
              disabled={agentsPage === totalPagesAgents || totalPagesAgents === 0}
              className="px-3 py-1 text-sm rounded border disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* CLIENTS SECTION */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Clients</h2>
          <div className="relative max-w-md">
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
              {currentClients.length > 0 ? (
                currentClients.map((client) => (
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
                    colSpan={5}
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
        <div className="flex items-center justify-center p-4 border-t">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setClientsPage(prev => Math.max(prev - 1, 1))}
              disabled={clientsPage === 1}
              className="px-3 py-1 text-sm rounded border disabled:opacity-50 disabled:cursor-not-allowed mr-2"
            >
              Previous
            </button>
            <span className="px-2 text-sm">
              {clientsPage} of {totalPagesClients || 1}
            </span>
            <button
              onClick={() => setClientsPage(prev => Math.min(prev + 1, totalPagesClients))}
              disabled={clientsPage === totalPagesClients || totalPagesClients === 0}
              className="px-3 py-1 text-sm rounded border disabled:opacity-50 disabled:cursor-not-allowed ml-2"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      </div> {/* Close clients section container */}
    </div>
  );
};

export default CreateUser;
