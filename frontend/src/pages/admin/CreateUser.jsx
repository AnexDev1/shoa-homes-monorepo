import { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../../components/LoadingSpinner';
import { userAPI } from '../../services/api';
import { Search, User, Mail, Phone } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const CreateUser = () => {
  const { user } = useAuthStore();

  // Fetch all clients
  const {
    data: clients = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['admin-all-clients'],
    queryFn: async () => {
      // Get all agents first
      const agents = await userAPI.getAll();
      const agentMap = agents.reduce((acc, agent) => {
        if (agent.role === 'AGENT') {
          acc[agent.id] = agent;
        }
        return acc;
      }, {});

      // Get all clients for all agents
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

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Filter clients based on search query
  const filteredClients = clients.filter(
    (client) =>
      client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.phone && client.phone.includes(searchQuery)) ||
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Clients Management</h1>
        <p className="text-gray-600">
          View and manage all clients in the system
        </p>
      </div>

      {/* SEARCH */}
      <div className="relative mb-6 max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search clients by name, email, or phone..."
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* TABLE */}
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
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {client.name || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 space-y-1">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                          <span className="truncate max-w-xs block">
                            {client.email || 'N/A'}
                          </span>
                        </div>
                        {client.phone && (
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                            <span>{client.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {client.agentName}
                        {client.agentEmail && (
                          <div className="text-xs text-gray-400">
                            {client.agentEmail}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 max-w-xs">
                        {client.notes || 'No notes'}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="px-6 py-10 text-center text-gray-500"
                    colSpan={4}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <User className="h-12 w-12 text-gray-300 mb-2" />
                      <p className="text-gray-500">No clients found</p>
                    </div>
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
