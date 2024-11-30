
'use client'
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { motion } from 'framer-motion';

const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });

const WeddingInvitation = () => {


  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } }
  };

  const slideIn = {
    hidden: { x: -100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.8 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-200 p-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <div className="relative h-96">
          <Image
            src="/wedding-banner.jpg"
            alt="Wedding Banner"
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <h1 className="text-4xl font-script text-white">Sarah & John</h1>
          </div>
        </div>

        <div className="p-8">
          <motion.div variants={slideIn} className="mb-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Our Special Day</h2>
            <p className="text-gray-600">Join us in celebrating our love and commitment on</p>
            <p className="text-2xl font-semibold text-purple-600">June 15, 2025</p>
          </motion.div>

          <motion.div variants={slideIn} className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Location</h3>
            <div className="h-64 rounded-lg overflow-hidden">
            
            </div>
            <p className="mt-2 text-gray-600">123 Wedding Venue St, New York, NY 10001</p>
          </motion.div>

          <motion.div variants={slideIn} className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">RSVP</h3>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
               
               
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                
               
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              <select
              
             
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="">Will you attend?</option>
                <option value="yes">Yes, I'll be there</option>
                <option value="no">Sorry, I can't make it</option>
              </select>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition duration-300"
              >
                Send RSVP
              </button>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default WeddingInvitation;
