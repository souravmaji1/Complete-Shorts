// app/link/[slug]/page.jsx
'use client'
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { 
  Music,
  ExternalLink,
  Instagram,
  Twitter,
  Facebook,
  Youtube
} from 'lucide-react';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const LinkTreePage = () => {
  const params = useParams();
  const slug = params.slug;
  
  const [linktreeData, setLinktreeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLinktree = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('musicians_linktree')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        if (!data) throw new Error('LinkTree not found');

        setLinktreeData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchLinktree();
    }
  }, [slug]);

  const musicPlatforms = {
    'spotify': { name: 'Spotify', color: '#1DB954', icon: '🎵' },
    'apple-music': { name: 'Apple Music', color: '#FA243C', icon: '🍎' },
    'youtube-music': { name: 'YouTube Music', color: '#FF0000', icon: '🎬' },
    'soundcloud': { name: 'SoundCloud', color: '#FF5500', icon: '☁️' },
    'deezer': { name: 'Deezer', color: '#FEAA2D', icon: '🎶' },
    'tidal': { name: 'Tidal', color: '#000000', icon: '🌊' }
  };

  const socialPlatforms = {
    'instagram': { name: 'Instagram', color: '#E4405F', icon: Instagram },
    'twitter': { name: 'Twitter', color: '#1DA1F2', icon: Twitter },
    'facebook': { name: 'Facebook', color: '#4267B2', icon: Facebook },
    'youtube': { name: 'YouTube', color: '#FF0000', icon: Youtube }
  };

  const backgroundOptions = [
    { id: 'gradient-1', name: 'Purple Gradient', class: 'bg-gradient-to-br from-purple-600 to-pink-600' },
    { id: 'gradient-2', name: 'Blue Gradient', class: 'bg-gradient-to-br from-blue-600 to-cyan-500' },
    { id: 'gradient-3', name: 'Green Gradient', class: 'bg-gradient-to-br from-green-500 to-teal-600' },
    { id: 'gradient-4', name: 'Orange Gradient', class: 'bg-gradient-to-br from-orange-500 to-red-600' },
    { id: 'dark', name: 'Dark', class: 'bg-gray-900' },
    { id: 'light', name: 'Light', class: 'bg-white' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center p-6 max-w-md">
          <h1 className="text-2xl font-bold mb-4">LinkTree Not Found</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <a 
            href="/" 
            className="bg-amber-600 hover:bg-amber-700 px-6 py-3 rounded-xl font-medium transition-colors inline-block"
          >
            Go Back Home
          </a>
        </div>
      </div>
    );
  }

  if (!linktreeData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center p-6 max-w-md">
          <h1 className="text-2xl font-bold mb-4">LinkTree Not Found</h1>
          <p className="text-gray-400 mb-6">No data available</p>
          <a 
            href="/" 
            className="bg-amber-600 hover:bg-amber-700 px-6 py-3 rounded-xl font-medium transition-colors inline-block"
          >
            Go Back Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-black rounded-3xl p-2 shadow-2xl w-full max-w-sm">
        <div className="bg-gray-900 rounded-2xl overflow-hidden">
          {/* Phone Status Bar */}
          <div className="bg-black px-4 py-2 flex justify-between items-center text-white text-xs">
            <span>9:41</span>
            <div className="flex space-x-1">
              <div className="w-4 h-2 bg-white rounded-sm"></div>
              <div className="w-1 h-2 bg-white rounded-sm"></div>
              <div className="w-6 h-2 bg-white rounded-sm"></div>
            </div>
          </div>

          {/* Main Content */}
          <div className={`min-h-[600px] ${
            backgroundOptions.find(bg => bg.id === linktreeData.profile.backgroundColor)?.class || 
            'bg-gradient-to-br from-purple-600 to-pink-600'
          } relative`}>
            <div className="px-6 py-8 text-center">
              {/* Profile Section */}
              <div className="mb-8">
                <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center backdrop-blur-sm">
                  {linktreeData.profile.profileImage ? (
                    <img 
                      src={linktreeData.profile.profileImage} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover" 
                    />
                  ) : (
                    <Music size={32} className="text-white" />
                  )}
                </div>
                <h1 className={`text-xl font-bold mb-2 ${
                  linktreeData.profile.textColor === 'white' ? 'text-white' : 'text-gray-900'
                }`}>
                  {linktreeData.profile.displayName || 'Artist'}
                </h1>
                <p className={`text-sm ${
                  linktreeData.profile.textColor === 'white' ? 'text-white/80' : 'text-gray-700'
                }`}>
                  {linktreeData.profile.bio || 'Music artist'}
                </p>
              </div>

              {/* Music Links */}
              <div className="space-y-3 mb-6">
                {linktreeData.music_links.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-white/20 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between hover:bg-white/30 transition-all block"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{musicPlatforms[link.platform]?.icon}</span>
                      <span className="text-white font-medium">{musicPlatforms[link.platform]?.name}</span>
                    </div>
                    <ExternalLink size={16} className="text-white/70" />
                  </a>
                ))}
              </div>

              {/* Social Links */}
              {linktreeData.social_links.length > 0 && (
                <div className="flex justify-center space-x-4">
                  {linktreeData.social_links.map((link) => {
                    const Icon = socialPlatforms[link.platform]?.icon;
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
                      >
                        <Icon size={20} className="text-white" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkTreePage;