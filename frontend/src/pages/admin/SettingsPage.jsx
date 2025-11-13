import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import { authAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast, { Toaster } from 'react-hot-toast';

const SettingsPage = () => {
  const { user, updateUser } = useAuthStore();
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const queryClient = useQueryClient();
  const updateProfileMutation = useMutation({
    mutationFn: (userData) => authAPI.updateProfile(userData),
    onSuccess: (data) => {
      updateUser(data);
      toast.success('Profile updated successfully!', {
        position: 'top-center',
        duration: 4000,
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update profile', {
        position: 'top-center',
        duration: 4000,
      });
    },
  });
  const changePasswordMutation = useMutation({
    mutationFn: (passwordData) =>
      authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }),
    onSuccess: () => {
      toast.success('Password updated successfully!', {
        position: 'top-center',
        duration: 4000,
      });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      queryClient.invalidateQueries(['user']);
    },
    onError: (error) => {
      if (error.response?.status === 401) {
        toast.error('Incorrect current password. Please try again.', {
          position: 'top-center',
          duration: 4000,
        });
      } else {
        toast.error(
          error.response?.data?.message || 'Failed to update password',
          {
            position: 'top-center',
            duration: 4000,
          }
        );
      }
    },
  });
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileData);
  };
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match!', {
        position: 'top-center',
        duration: 4000,
      });
      return;
    }
    changePasswordMutation.mutate(passwordData);
  };
  return (
    <div className="space-y-6">
      <Toaster />
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>
      {/* Profile Settings */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">Profile Information</h2>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) =>
                  setProfileData({ ...profileData, name: e.target.value })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) =>
                  setProfileData({ ...profileData, email: e.target.value })
                }
                className="input-field"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) =>
                  setProfileData({ ...profileData, phone: e.target.value })
                }
                className="input-field"
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn-primary flex items-center justify-center gap-2"
            disabled={updateProfileMutation.isPending}
          >
            {updateProfileMutation.isPending && <LoadingSpinner size="sm" />}
            {updateProfileMutation.isPending ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
      {/* Password Change */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">Change Password</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div className="max-w-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                className="input-field"
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn-primary flex items-center justify-center gap-2"
            disabled={changePasswordMutation.isPending}
          >
            {changePasswordMutation.isPending && <LoadingSpinner size="sm" />}
            {changePasswordMutation.isPending
              ? 'Updating...'
              : 'Update Password'}
          </button>
        </form>
      </div>
      {/* System Settings */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">System Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <h3 className="font-semibold">Email Notifications</h3>
              <p className="text-sm text-gray-600">
                Receive email alerts for new inquiries
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <h3 className="font-semibold">SMS Notifications</h3>
              <p className="text-sm text-gray-600">
                Receive SMS alerts for urgent inquiries
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <h3 className="font-semibold">Marketing Emails</h3>
              <p className="text-sm text-gray-600">
                Receive updates and marketing materials
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;
