import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-2">
            <h3 className="text-lg font-display font-semibold text-neutral-900 dark:text-white">
              Smart Blood Transport Box
            </h3>
            <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400 max-w-md">
              Revolutionizing blood transport with smart technology for safer and more efficient delivery.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/stats" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Stats
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Team Members
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wider">Contact</h4>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-neutral-600 dark:text-neutral-400">
                <a href="mailto:contact@example.com" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  contact@example.com
                </a>
              </li>
              <li className="text-sm text-neutral-600 dark:text-neutral-400">
                <a href="tel:+1234567890" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  +91xxxxxxxx
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
          <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">
            © {currentYear} Smart Blood Transport Box. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
