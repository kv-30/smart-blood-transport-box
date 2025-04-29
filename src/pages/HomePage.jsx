import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
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
            <Link 
              to="/stats" 
              className="inline-flex items-center px-8 py-3 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition-colors duration-200"
            >
              View Live Stats
            </Link>
            <Link 
              to="/team" 
              className="inline-flex items-center px-8 py-3 border-2 border-primary-600 text-primary-600 rounded-full font-semibold hover:bg-primary-50 transition-colors duration-200"
            >
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
              <div 
                key={index} 
                className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
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

        {/* Temperature Guidelines Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-gray-100">
              Transport Temperature Guidelines
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Maintaining proper temperature is crucial for blood component viability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Whole Blood & Red Blood Cells
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Should be transported at temperature range of 1°C to 10°C
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Platelets
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Require a temperature range of 20°C to 24°C
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Plasma (Frozen)
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Must remain frozen during transport, typically at ≤ -25°C
              </p>
            </div>
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
              <Link 
                to="/stats" 
                className="inline-flex items-center px-8 py-3 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition-colors duration-200"
              >
                View Live Statistics
              </Link>
            </div>
          </div>
        </section>
      </div>
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

export default HomePage;