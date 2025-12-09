import React from "react";
import { Link } from "react-router-dom";
import {
  Shield, MapPin, Bell, Smartphone, Users, TrendingUp,
  Zap, Globe, CheckCircle, ArrowRight, Menu, X
} from "lucide-react";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const features = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Real-Time Tracking",
      description: "Monitor elephant movements with GPS-enabled IoT devices and live location tracking on interactive maps."
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Smart Alerts",
      description: "Instant push notifications when elephants approach populated areas or critical hotspots."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Hotspot Management",
      description: "Identify and manage high-risk zones with customizable alert radii and risk levels."
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Multi-Platform Access",
      description: "Access the system from web, mobile, or desktop with role-based dashboards."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Analytics & Insights",
      description: "Data-driven insights on elephant behavior patterns and conflict trends."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Engagement",
      description: "Empower local communities with timely information to prevent conflicts."
    }
  ];

  const stats = [
    { value: "24/7", label: "Real-Time Monitoring" },
    { value: "500m+", label: "Alert Radius Coverage" },
    { value: "Multi-Role", label: "Access Control" },
    { value: "Instant", label: "Push Notifications" }
  ];

  const uniqueFeatures = [
    "PostGIS-powered geospatial analysis for accurate proximity detection",
    "WebSocket integration for real-time event broadcasting",
    "Firebase Cloud Messaging for reliable push notifications",
    "Role-based access control (Admin, Officer, User)",
    "Automatic token refresh for seamless 7-day sessions",
    "Customizable alert zones with multiple risk levels"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/375/375048.png"
                  alt="Elephant"
                  className="w-6 h-6"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Airavata
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-emerald-600 transition-colors">Features</a>
              <a href="#why-us" className="text-gray-700 hover:text-emerald-600 transition-colors">Why Us</a>
              <a href="#about" className="text-gray-700 hover:text-emerald-600 transition-colors">About</a>
              <Link
                to="/login"
                className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-gray-700 hover:text-emerald-600 py-2">Features</a>
              <a href="#why-us" className="block text-gray-700 hover:text-emerald-600 py-2">Why Us</a>
              <a href="#about" className="block text-gray-700 hover:text-emerald-600 py-2">About</a>
              <Link
                to="/login"
                className="block text-center px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 via-teal-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                Human-Elephant Conflict Prevention
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Protect Communities,
                <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Preserve Wildlife
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Project Airavata is an intelligent IoT-based monitoring system that prevents human-elephant conflicts through real-time tracking, smart alerts, and community engagement.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/signup"
                  className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg font-semibold flex items-center justify-center group"
                >
                  Get Started                  
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Link>
                <a
                  href="#features"
                  className="px-8 py-4 border-2 border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-all font-semibold text-center"
                >
                  Learn More
                </a>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800&q=80"
                  alt="Elephant in nature"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-lg font-semibold">Saving lives through technology</p>
                  <p className="text-sm opacity-90">Real-time monitoring • Smart alerts • Community safety</p>
                </div>
              </div>
             
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <p className="text-3xl font-bold text-emerald-600">{stat.value}</p>
                <p className="text-gray-600 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What is Project Airavata */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1551244072-5d12893278ab?w=800&q=80"
                alt="Technology dashboard"
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-emerald-600 to-teal-600 text-white p-6 rounded-xl shadow-xl max-w-xs">
                <Globe className="mb-3" size={32} />
                <p className="font-semibold">Powered by cutting-edge IoT, GPS, and geospatial technology</p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900">
                What is Project Airavata?
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Project Airavata is a comprehensive elephant monitoring and conflict prevention system designed to protect both human communities and wildlife. Named after the mythical elephant, our platform combines IoT sensors, GPS tracking, and intelligent analytics to create a safety network.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                The system uses GPS-enabled collars and ground sensors to track elephant movements in real-time. When elephants approach populated areas or critical hotspots, our intelligent alert system immediately notifies local communities, forest officials, and wildlife officers through multiple channels.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-emerald-50 rounded-lg">
                  <CheckCircle className="text-emerald-600 mb-2" size={24} />
                  <p className="font-semibold text-gray-900">Real-Time Data</p>
                  <p className="text-sm text-gray-600">Live tracking & updates</p>
                </div>
                <div className="p-4 bg-teal-50 rounded-lg">
                  <CheckCircle className="text-teal-600 mb-2" size={24} />
                  <p className="font-semibold text-gray-900">Smart Alerts</p>
                  <p className="text-sm text-gray-600">Instant notifications</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Are Unique */}
      <section id="why-us" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-emerald-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Airavata?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine advanced technology with practical solutions to create a system that actually works in the field.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {uniqueFeatures.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all group">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="text-emerald-600 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" size={24} />
                  <p className="text-gray-700 leading-relaxed">{feature}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-3">
              <div className="p-8 bg-gradient-to-br from-emerald-600 to-teal-600 text-white">
                <Shield size={48} className="mb-4" />
                <h3 className="text-2xl font-bold mb-2">Secure & Reliable</h3>
                <p className="opacity-90">Enterprise-grade security with role-based access control and encrypted data transmission.</p>
              </div>
              <div className="p-8 bg-gradient-to-br from-teal-600 to-cyan-600 text-white">
                <Zap size={48} className="mb-4" />
                <h3 className="text-2xl font-bold mb-2">Lightning Fast</h3>
                <p className="opacity-90">Real-time updates with WebSocket technology and optimized database queries.</p>
              </div>
              <div className="p-8 bg-gradient-to-br from-cyan-600 to-blue-600 text-white">
                <Globe size={48} className="mb-4" />
                <h3 className="text-2xl font-bold mb-2">Scalable Solution</h3>
                <p className="opacity-90">Built to handle thousands of devices and users across multiple regions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to prevent human-elephant conflicts and protect communities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 hover:border-emerald-200">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <div className="text-emerald-600">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Join us in creating safer communities and protecting wildlife through technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="px-8 py-4 bg-white text-emerald-600 rounded-lg hover:bg-gray-100 transition-all shadow-lg font-semibold"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-all font-semibold"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Brand */}
            <div className="col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/375/375048.png"
                    alt="Elephant"
                    className="w-6 h-6"
                  />
                </div>
                <span className="text-2xl font-bold text-white">Airavata</span>
              </div>
              <p className="text-sm text-gray-400">
                Protecting communities and wildlife through intelligent technology.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Airavata</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#about" className="hover:text-emerald-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Team</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Project Airavata. By Team Saksham 2.0.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
