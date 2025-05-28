import React, { useState } from 'react';
import { X, Clock, Calendar, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ActivityFormProps {
  onClose: () => void;
  onActivityAdded?: () => void;
}

const ActivityForm: React.FC<ActivityFormProps> = ({ onClose, onActivityAdded }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activity, setActivity] = useState({
    title: '',
    category: 'work',
    startTime: '',
    endTime: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    energy: 'medium',
    focus: 'medium',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setActivity(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      // Calculate duration in minutes
      const start = new Date(`${activity.date}T${activity.startTime}`);
      const end = new Date(`${activity.date}T${activity.endTime}`);
      const durationMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
      
      // Insert activity into database
      const { error } = await supabase
        .from('activities')
        .insert([{
          user_id: user.id,
          title: activity.title,
          category: activity.category,
          start_time: `${activity.date}T${activity.startTime}`,
          end_time: `${activity.date}T${activity.endTime}`,
          description: activity.description,
          energy_level: activity.energy,
          focus_level: activity.focus,
          duration_minutes: durationMinutes
        }]);

      if (error) throw error;
      
      toast.success('Activity added successfully!');
      onActivityAdded?.();
      onClose();
    } catch (error) {
      console.error('Error adding activity:', error);
      toast.error('Failed to add activity. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Activity</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Activity Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={activity.title}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Deep work session, Team meeting"
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-1" />
                    Category
                  </div>
                </label>
                <select
                  id="category"
                  name="category"
                  value={activity.category}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="work">Deep Work</option>
                  <option value="meeting">Meeting</option>
                  <option value="email">Email & Communication</option>
                  <option value="learning">Learning</option>
                  <option value="break">Break</option>
                  <option value="social">Social Media</option>
                  <option value="personal">Personal</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Date
                    </div>
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={activity.date}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Start Time
                    </div>
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={activity.startTime}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    End Time
                  </div>
                </label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={activity.endTime}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description (optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={activity.description}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Add any notes or details about this activity"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="energy" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Energy Level
                  </label>
                  <select
                    id="energy"
                    name="energy"
                    value={activity.energy}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="focus" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Focus Level
                  </label>
                  <select
                    id="focus"
                    name="focus"
                    value={activity.focus}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              
              <div className="pt-4 flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : 'Save Activity'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ActivityForm;