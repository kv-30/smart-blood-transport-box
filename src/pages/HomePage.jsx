import React from "react";
import { Link } from "react-router-dom";
import "../styles/pages/HomePage.css";


const HomePage = () => {
  return (
    <div className="space-y-16 animate-fade-in">
      {/* Hero Section */}
      <section className="text-center py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          Smart Blood Transport
          <span className="block text-primary-600">Made Simple</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-400">
          Revolutionizing blood transport with intelligent temperature monitoring and real-time tracking for safer, more efficient delivery.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/stats" className="btn-primary">
            View Live Stats
          </Link>
          <Link to="/team" className="btn-outline">
            Meet Our Team
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-gray-100">
            Key Features
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Advanced technology for reliable blood transport
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md 
                 transition-all duration-300 hover:shadow-xl hover:scale-105">
              <div className="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-gray-100">
            Impact Statistics
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Making a difference in blood transport safety
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-4xl font-bold text-primary-600">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800 rounded-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-gray-100">
            Ready to Get Started?
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Join us in revolutionizing blood transport with smart technology.
          </p>
          <div className="mt-8">
            <Link to="/stats" className="btn-primary">
              View Live Statistics
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

// Feature data
const features = [
  {
    icon: (
      <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Temperature Monitoring',
    description: 'Real-time temperature tracking with advanced sensors for optimal blood preservation.',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Quick Response',
    description: 'Immediate alerts and notifications for any temperature or handling anomalies.',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Secure Tracking',
    description: 'End-to-end tracking and monitoring for complete supply chain visibility.',
  },
];

// Stats data
const stats = [
  {
    value: '99.9%',
    label: 'Temperature Accuracy',
  },
  {
    value: '24/7',
    label: 'Monitoring',
  },
  {
    value: '15min',
    label: 'Response Time',
  },
  {
    value: '100%',
    label: 'Safety Record',
  },
];

export default HomePage;
