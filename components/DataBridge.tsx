import { memo } from "react";

const DataBridge: React.FC = memo(() => {
  return (
    <div className="w-full py-16 md:py-20 bg-gradient-to-br from-[#f8f7f3] to-[#f0ede7]" id="Solutions">
      <div className="max-w-6xl mx-auto px-6 sm:px-6 md:px-8">
        <div className="mb-6 md:mb-8">
          <h1 className="font-inter text-2xl sm:text-3xl font-bold text-black mb-4 md:mb-6 leading-tight">Data Consulting for Local Businesses</h1>
          <p className="font-inter text-sm leading-relaxed text-gray-800 max-w-3xl font-normal">
            Connect with our expert data analytics team for complimentary consulting services.
            We help local businesses in Vancouver unlock the power of their data through analysis, visualization, and strategic insights.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 mb-8 md:mb-12">
          <div className="bg-white/20 backdrop-blur-lg rounded-xl p-3 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 active:scale-95 active:shadow-xl active:bg-white/30">
            <div className="w-10 h-10 bg-black/10 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-inter text-gray-800 font-bold text-sm mb-2">Data Analysis</h3>
            <p className="font-inter text-gray-700 text-xs leading-relaxed">
              Comprehensive analysis of your business data to identify trends, patterns, and opportunities for growth.
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-lg rounded-xl p-3 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 active:scale-95 active:shadow-xl active:bg-white/30">
            <div className="w-10 h-10 bg-black/10 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <h3 className="font-inter text-gray-800 font-bold text-sm mb-2">Data Visualization</h3>
            <p className="font-inter text-gray-700 text-xs leading-relaxed">
              Create compelling dashboards and visualizations that make your data accessible and actionable.
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-lg rounded-xl p-3 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 active:scale-95 active:shadow-xl active:bg-white/30 sm:col-span-2 lg:col-span-1">
            <div className="w-10 h-10 bg-black/10 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-inter text-gray-800 font-bold text-sm mb-2">Strategic Insights</h3>
            <p className="font-inter text-gray-700 text-xs leading-relaxed">
              Transform raw data into strategic recommendations that drive business decisions and growth.
            </p>
          </div>
        </div>

        <div className="text-center">
          <p className="font-inter text-gray-800 text-sm mb-4 leading-relaxed">
            Our team of dedicated students across different disciplines is ready to help your business thrive.
            Contact us for a free consultation and discover how data can transform your operations.
          </p>
          <div className="flex justify-center">
            <a
              href="mailto:boltubc@gmail.com"
              className="bg-black/20 backdrop-blur-lg text-white font-inter font-semibold px-8 py-3 rounded-full transition-all duration-200 hover:bg-black/30 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 flex items-center gap-2 group"
            >
              Contact Us
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              >
                <path d="M7 17L17 7M17 7H7M17 7V17"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-8 md:mt-12 text-center">
          <p className="font-inter text-gray-500 text-xs">
            * All services are provided free of charge to local businesses as part of our educational mission.
          </p>
        </div>
      </div>
    </div>
  );
});

DataBridge.displayName = 'DataBridge';

export default DataBridge;
