import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  BarChart3,
  Clock,
  Plus,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Zap,
  TrendingUp,
  ClipboardList,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { supabase } from '../lib/supabase';
import ActivityForm from '../components/ActivityForm';
import DailySchedule from '../components/DailySchedule';
import ProductivityTips from '../components/ProductivityTips';
import toast from 'react-hot-toast';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ActivityStats {
  productivityScore: number;
  deepWorkHours: number;
  distractionEvents: number;
  timeAllocation: {
    labels: string[];
    data: number[];
  };
  weeklyProductivity: {
    labels: string[];
    data: number[];
  };
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<ActivityStats>({
    productivityScore: 0,
    deepWorkHours: 0,
    distractionEvents: 0,
    timeAllocation: {
      labels: [],
      data: [],
    },
    weeklyProductivity: {
      labels: [],
      data: [],
    },
  });

  const userName = user?.user_metadata?.name || 'User';

  const fetchStats = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Get activities for the past week
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);

      const { data: activities, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .gte('start_time', startDate.toISOString())
        .lte('start_time', endDate.toISOString());

      if (error) throw error;

      // Calculate statistics
      const categoryDurations: Record<string, number> = {};
      const dailyProductivity: Record<string, number> = {};
      let totalDeepWorkMinutes = 0;
      let distractions = 0;

      activities?.forEach(activity => {
        // Category allocation
        const duration = activity.duration_minutes;
        categoryDurations[activity.category] = (categoryDurations[activity.category] || 0) + duration;

        // Deep work hours
        if (activity.category === 'work' && activity.focus_level === 'high') {
          totalDeepWorkMinutes += duration;
        }

        // Distractions
        if (activity.focus_level === 'low') {
          distractions++;
        }

        // Daily productivity
        const date = new Date(activity.start_time).toLocaleDateString('en-US', { weekday: 'short' });
        const productivityScore = activity.focus_level === 'high' ? 100 :
                                activity.focus_level === 'medium' ? 70 : 40;
        
        if (!dailyProductivity[date]) {
          dailyProductivity[date] = { total: 0, count: 0 };
        }
        dailyProductivity[date].total += productivityScore;
        dailyProductivity[date].count++;
      });

      // Calculate average productivity score
      const productivityScore = Object.values(dailyProductivity).reduce((acc, day) => 
        acc + (day.total / day.count), 0) / Object.keys(dailyProductivity).length || 0;

      // Prepare time allocation data
      const categories = Object.keys(categoryDurations);
      const totalMinutes = Object.values(categoryDurations).reduce((a, b) => a + b, 0);
      const timeAllocationData = categories.map(cat => 
        Math.round((categoryDurations[cat] / totalMinutes) * 100)
      );

      // Prepare weekly productivity data
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const weeklyData = days.map(day => {
        if (dailyProductivity[day]) {
          return Math.round(dailyProductivity[day].total / dailyProductivity[day].count);
        }
        return 0;
      });

      setStats({
        productivityScore: Math.round(productivityScore),
        deepWorkHours: Math.round(totalDeepWorkMinutes / 60 * 10) / 10,
        distractionEvents: distractions,
        timeAllocation: {
          labels: categories,
          data: timeAllocationData,
        },
        weeklyProductivity: {
          labels: days,
          data: weeklyData,
        },
      });

    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  const handleActivityAdded = () => {
    fetchStats();
  };

  // Chart data
  const productivityData = {
    labels: stats.weeklyProductivity.labels,
    datasets: [
      {
        label: 'Productivity Score',
        data: stats.weeklyProductivity.data,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const timeAllocationData = {
    labels: stats.timeAllocation.labels,
    datasets: [
      {
        data: stats.timeAllocation.data,
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(251, 191, 36, 0.8)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome back, {userName}
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Here's an overview of your productivity
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Activity
            </button>
          </div>

          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setSelectedTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'overview'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setSelectedTab('schedule')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'schedule'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Schedule
              </button>
              <button
                onClick={() => setSelectedTab('reports')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'reports'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Reports
              </button>
              <button
                onClick={() => setSelectedTab('tips')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'tips'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Tips & Insights
              </button>
            </nav>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {selectedTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Productivity Score Card */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 col-span-1 md:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                        <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
                        Weekly Productivity
                      </h2>
                      <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm font-medium">
                        +12% vs last week
                      </span>
                    </div>
                    <div className="h-64">
                      <Line 
                        data={productivityData} 
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                              max: 100,
                              grid: {
                                color: 'rgba(156, 163, 175, 0.1)',
                              },
                            },
                            x: {
                              grid: {
                                display: false,
                              },
                            },
                          },
                          plugins: {
                            legend: {
                              display: false,
                            },
                          },
                        }}
                      />
                    </div>
                  </div>

                  {/* Time Allocation Card */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-4">
                      <Clock className="h-5 w-5 mr-2 text-blue-500" />
                      Time Allocation
                    </h2>
                    <div className="h-[200px] flex items-center justify-center">
                      <Doughnut 
                        data={timeAllocationData} 
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          cutout: '65%',
                          plugins: {
                            legend: {
                              position: 'bottom',
                              labels: {
                                boxWidth: 12,
                                font: {
                                  size: 11,
                                },
                                color: document.documentElement.classList.contains('dark') ? 'white' : 'rgb(55, 65, 81)',
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex items-center">
                    <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3 mr-4">
                      <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Productivity Score</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.productivityScore}%</p>
                      <p className="text-xs text-green-600 dark:text-green-400">↑ 8% from last week</p>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex items-center">
                    <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3 mr-4">
                      <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Deep Work Hours</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.deepWorkHours}</p>
                      <p className="text-xs text-green-600 dark:text-green-400">↑ 3.2 from last week</p>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex items-center">
                    <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/30 p-3 mr-4">
                      <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Distraction Events</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.distractionEvents}</p>
                      <p className="text-xs text-red-600 dark:text-red-400">↑ 4 from last week</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {selectedTab === 'schedule' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <DailySchedule />
              </motion.div>
            )}
            
            {selectedTab === 'reports' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weekly Focus Areas</h2>
                    <div className="space-y-4">
                      {stats.timeAllocation.labels.map((category, index) => (
                        <div key={category}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </span>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {stats.timeAllocation.data[index]}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full" 
                              style={{ width: `${stats.timeAllocation.data[index]}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Productivity Improvement</h2>
                    <div className="space-y-6">
                      <div className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                        <div>
                          <h3 className="text-base font-medium text-gray-900 dark:text-white">Deep Work Improved</h3>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Your deep work sessions increased by 15% this week. Great progress!
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 mr-3" />
                        <div>
                          <h3 className="text-base font-medium text-gray-900 dark:text-white">Meeting Overload</h3>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            You spent 20% more time in meetings than optimal. Consider consolidating some meetings.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Zap className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                        <div>
                          <h3 className="text-base font-medium text-gray-900 dark:text-white">Energy Management</h3>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Your energy levels drop significantly after 3 PM. Consider scheduling important tasks earlier.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {selectedTab === 'tips' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ProductivityTips />
              </motion.div>
            )}
          </>
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

export default Dashboard;