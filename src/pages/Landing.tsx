import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, BarChart3, BrainCircuit, Clock } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const features = [
  {
    title: 'AI-Powered Analysis',
    description: 'Our advanced AI analyzes your daily routines and identifies opportunities for optimization.',
    icon: <BrainCircuit className="h-10 w-10 text-blue-500" />,
  },
  {
    title: 'Smart Scheduling',
    description: 'Get intelligent scheduling suggestions to maximize your productivity and efficiency.',
    icon: <Calendar className="h-10 w-10 text-blue-500" />,
  },
  {
    title: 'Productivity Insights',
    description: 'Visualize your productivity patterns with interactive reports and analytics.',
    icon: <BarChart3 className="h-10 w-10 text-blue-500" />,
  },
  {
    title: 'Time Optimization',
    description: 'Reclaim wasted time and focus on what matters most with our optimization tips.',
    icon: <Clock className="h-10 w-10 text-blue-500" />,
  },
];

const Landing: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-950" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                    Transform Your <span className="text-blue-600 dark:text-blue-400">Productivity</span> with Sahayak
                  </h1>
                  <p className="mt-6 text-xl text-gray-600 dark:text-gray-300">
                    Your AI assistant that analyzes your daily routine and suggests improvements for a more productive life.
                  </p>
                  <div className="mt-10 flex flex-col sm:flex-row gap-4">
                    <Link
                      to="/signup"
                      className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-center"
                    >
                      Get Started for Free
                    </Link>
                    <Link
                      to="/signin"
                      className="px-8 py-4 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-center"
                    >
                      Sign In
                    </Link>
                  </div>
                </motion.div>
              </div>
              <motion.div
                className="lg:w-1/2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur-lg opacity-30 dark:opacity-40"></div>
                  <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
                    <img
                      src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                      alt="Productivity dashboard"
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Features That Empower Your Productivity
                </h2>
                <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
                  Sahayak combines AI intelligence with productivity principles to help you achieve more.
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600 dark:bg-blue-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-white mb-6">
                  Ready to Transform Your Daily Routine?
                </h2>
                <p className="text-xl text-blue-100 mb-10">
                  Join thousands of users who have improved their productivity with Sahayak.
                </p>
                <Link
                  to="/signup"
                  className="px-8 py-4 bg-white text-blue-600 font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 inline-block"
                >
                  Get Started Today
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Landing;