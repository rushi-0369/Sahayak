import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  Clock, 
  BrainCircuit, 
  Focus, 
  Zap, 
  CheckCircle2, 
  TimerReset,
  Inbox,
  BatteryCharging,
} from 'lucide-react';

const tips = [
  {
    id: 1,
    title: 'Implement the Pomodoro Technique',
    description: 'Work in focused 25-minute blocks followed by 5-minute breaks. After 4 cycles, take a longer 15-30 minute break.',
    icon: <Clock className="h-6 w-6 text-orange-500" />,
    category: 'focus',
  },
  {
    id: 2,
    title: 'Use the 2-Minute Rule',
    description: 'If a task takes less than 2 minutes to complete, do it immediately instead of scheduling it for later.',
    icon: <Zap className="h-6 w-6 text-yellow-500" />,
    category: 'efficiency',
  },
  {
    id: 3,
    title: 'Time-Block Your Day',
    description: 'Allocate specific time blocks for different types of work. Reserve your peak energy hours for deep, focused work.',
    icon: <Focus className="h-6 w-6 text-blue-500" />,
    category: 'planning',
  },
  {
    id: 4,
    title: 'Practice Mindfulness',
    description: 'Take a few minutes throughout the day to practice mindfulness. This helps reset your mental state and improve focus.',
    icon: <BrainCircuit className="h-6 w-6 text-purple-500" />,
    category: 'wellbeing',
  },
  {
    id: 5,
    title: 'Batch Similar Tasks',
    description: 'Group similar tasks together and complete them in one session to reduce context switching and mental load.',
    icon: <CheckCircle2 className="h-6 w-6 text-green-500" />,
    category: 'efficiency',
  },
  {
    id: 6,
    title: 'Follow the 90/20 Rule',
    description: 'Work intensely for 90 minutes, then take a 20-minute break. This aligns with your body\'s natural ultradian rhythm.',
    icon: <TimerReset className="h-6 w-6 text-red-500" />,
    category: 'focus',
  },
  {
    id: 7,
    title: 'Implement Inbox Zero',
    description: 'Process your email inbox to empty each day. Either respond, delegate, defer, or delete each message.',
    icon: <Inbox className="h-6 w-6 text-blue-500" />,
    category: 'efficiency',
  },
  {
    id: 8,
    title: 'Schedule Energy, Not Just Time',
    description: 'Match your most demanding tasks to your high-energy periods. Save low-energy tasks for when your focus naturally dips.',
    icon: <BatteryCharging className="h-6 w-6 text-green-500" />,
    category: 'planning',
  },
];

const ProductivityTips: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedTipId, setExpandedTipId] = useState<number | null>(null);

  const filteredTips = selectedCategory === 'all' 
    ? tips 
    : tips.filter(tip => tip.category === selectedCategory);

  const categories = [
    { id: 'all', label: 'All Tips' },
    { id: 'focus', label: 'Focus' },
    { id: 'efficiency', label: 'Efficiency' },
    { id: 'planning', label: 'Planning' },
    { id: 'wellbeing', label: 'Wellbeing' },
  ];

  const toggleTip = (id: number) => {
    if (expandedTipId === id) {
      setExpandedTipId(null);
    } else {
      setExpandedTipId(id);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex items-center mb-6">
          <Lightbulb className="h-6 w-6 text-yellow-500 mr-3" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Productivity Tips & Insights</h2>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTips.map(tip => (
            <motion.div
              key={tip.id}
              layoutId={`tip-${tip.id}`}
              onClick={() => toggleTip(tip.id)}
              className={`bg-gray-50 dark:bg-gray-700 rounded-xl p-5 cursor-pointer hover:shadow-md transition-shadow ${
                expandedTipId === tip.id ? 'md:col-span-2' : ''
              }`}
            >
              <motion.div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  {tip.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {tip.title}
                  </h3>
                  <motion.p
                    className={`text-gray-600 dark:text-gray-300 ${
                      expandedTipId === tip.id ? '' : 'line-clamp-2'
                    }`}
                  >
                    {tip.description}
                  </motion.p>
                  
                  {expandedTipId === tip.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                      className="mt-4"
                    >
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">How to implement this tip:</h4>
                      <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                        <li>Start small by applying this technique to one task or part of your day.</li>
                        <li>Track your results and adjust as needed based on what works for you.</li>
                        <li>Combine with other productivity techniques for optimal results.</li>
                        <li>Schedule this as a recurring practice in your daily routine.</li>
                      </ul>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white mb-4">Personalized Productivity Insights</h2>
          <p className="text-blue-100 mb-6">
            Based on your activity patterns, we've identified these key insights to help optimize your productivity.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold text-white mb-2">Peak Focus Time</h3>
              <p className="text-sm text-blue-100">
                Your most productive hours appear to be 8:00 AM - 11:00 AM. Schedule your most important tasks during this time.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold text-white mb-2">Meeting Optimization</h3>
              <p className="text-sm text-blue-100">
                Your meetings are scattered throughout the day. Try batching them in the afternoon to protect your morning focus time.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold text-white mb-2">Energy Management</h3>
              <p className="text-sm text-blue-100">
                You experience an energy dip around 2:00 PM. Consider a short walk or power nap during this time.
              </p>
            </div>
          </div>
          
          <button className="inline-flex items-center px-4 py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors duration-200">
            View detailed analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductivityTips;