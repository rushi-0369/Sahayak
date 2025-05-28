import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, Calendar, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import ActivityForm from './ActivityForm';
import toast from 'react-hot-toast';

interface Activity {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  category: string;
  description?: string;
}

const categoryColors: Record<string, string> = {
  work: 'bg-blue-500',
  meeting: 'bg-green-500',
  email: 'bg-orange-500',
  learning: 'bg-pink-500',
  break: 'bg-yellow-500',
  social: 'bg-purple-500',
  personal: 'bg-indigo-500',
};

const timeSlots = [
  '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM',
  '7:00 PM', '8:00 PM', '9:00 PM'
];

const DailySchedule: React.FC = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week'>('day');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Format the date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Format date for database query
  const formatDateForQuery = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Fetch activities for the current date
  const fetchActivities = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const startOfDay = new Date(currentDate);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(currentDate);
      endOfDay.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .gte('start_time', startOfDay.toISOString())
        .lte('start_time', endOfDay.toISOString())
        .order('start_time');

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Failed to load activities');
    } finally {
      setIsLoading(false);
    }
  };

  // Move to previous/next day or week
  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    const days = view === 'day' ? 1 : 7;
    
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - days);
    } else {
      newDate.setDate(newDate.getDate() + days);
    }
    
    setCurrentDate(newDate);
  };

  // Find events for a given time slot
  const getEventsForTimeSlot = (timeSlot: string) => {
    const hour = parseInt(timeSlot.split(':')[0]);
    const period = timeSlot.split(' ')[1];
    const hour24 = period === 'PM' && hour !== 12 ? hour + 12 : 
                   period === 'AM' && hour === 12 ? 0 : hour;

    return activities.filter(activity => {
      const startHour = new Date(activity.start_time).getHours();
      return startHour === hour24;
    });
  };

  // Calculate event duration in hours
  const getEventDuration = (activity: Activity) => {
    const start = new Date(activity.start_time);
    const end = new Date(activity.end_time);
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  };

  // Handle activity added
  const handleActivityAdded = () => {
    fetchActivities();
  };

  // Fetch activities when date changes
  useEffect(() => {
    fetchActivities();
  }, [currentDate, user]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <button
              onClick={() => navigateDate('prev')}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Previous day"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
            
            <h2 className="mx-4 text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-500" />
              {formatDate(currentDate)}
            </h2>
            
            <button
              onClick={() => navigateDate('next')}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Next day"
            >
              <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setView('day')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  view === 'day'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Day
              </button>
              <button
                onClick={() => setView('week')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  view === 'week'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Week
              </button>
            </div>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Event
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : view === 'day' ? (
          <div className="space-y-2 overflow-y-auto max-h-[600px]">
            {timeSlots.map((timeSlot, index) => {
              const events = getEventsForTimeSlot(timeSlot);
              
              return (
                <div key={index} className="flex">
                  <div className="w-16 flex-shrink-0 flex flex-col items-center">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">
                      {timeSlot}
                    </div>
                    <div className="flex-grow border-r border-gray-200 dark:border-gray-700 ml-2"></div>
                  </div>
                  
                  <div className="flex-grow pl-4 py-2">
                    {events.length > 0 ? (
                      <div className="space-y-2">
                        {events.map(event => (
                          <div
                            key={event.id}
                            className={`rounded-lg p-3 ${categoryColors[event.category]} text-white hover:shadow-md transition-shadow cursor-pointer`}
                            style={{ height: `${Math.max(getEventDuration(event) * 60, 60)}px` }}
                          >
                            <div className="font-medium">{event.title}</div>
                            <div className="text-sm mt-1 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {new Date(event.start_time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} - 
                              {new Date(event.end_time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                            </div>
                            {event.description && (
                              <div className="text-sm mt-1 text-white/80">
                                {event.description}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-16 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center">
                        <button 
                          onClick={() => setIsModalOpen(true)}
                          className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          + Add activity
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              Weekly view will be implemented in a future update.
            </p>
          </div>
        )}
      </div>

      {/* Activity Form Modal */}
      {isModalOpen && (
        <ActivityForm 
          onClose={() => setIsModalOpen(false)} 
          onActivityAdded={handleActivityAdded}
        />
      )}
    </div>
  );
};

export default DailySchedule;