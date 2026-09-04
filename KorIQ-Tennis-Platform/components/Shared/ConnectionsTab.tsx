import React, { useState } from 'react';

type EntityType = 'player' | 'coach' | 'club';
type PortalType = 'player' | 'coach' | 'club';
type ConnectionTab = 'following' | 'followers';
type FilterType = 'all' | 'players' | 'coaches' | 'clubs';

interface Connection {
  id: string;
  name: string;
  type: EntityType;
  bio?: string;
  location?: string;
  ntrpLevel?: string;
  rating?: number;
  specialties?: string[];
  courtCount?: number;
  isFollowing: boolean;
  followerCount: number;
}

interface ConnectionsTabProps {
  portalType: PortalType;
  currentUserId: string;
  currentUserName: string;
}

// Mock data for following
const MOCK_FOLLOWING: Connection[] = [
  {
    id: 'coach1',
    name: 'Coach Mike Chen',
    type: 'coach',
    bio: 'Former ATP player with 10+ years of coaching experience.',
    location: 'Vancouver, BC',
    specialties: ['Serve', 'Mental Game'],
    rating: 4.8,
    isFollowing: true,
    followerCount: 234,
  },
  {
    id: 'coach2',
    name: 'Coach Sarah Mitchell',
    type: 'coach',
    bio: 'PTR Certified Professional specializing in beginners and juniors.',
    location: 'Vancouver, BC',
    specialties: ['Beginners', 'Juniors'],
    rating: 4.9,
    isFollowing: true,
    followerCount: 312,
  },
  {
    id: 'club1',
    name: 'Vancouver Tennis Club',
    type: 'club',
    bio: 'Premier tennis facility in downtown Vancouver.',
    location: 'Vancouver, BC',
    courtCount: 12,
    isFollowing: true,
    followerCount: 1245,
  },
  {
    id: 'player1',
    name: 'Sarah Johnson',
    type: 'player',
    bio: 'Recreational player passionate about improving.',
    location: 'Vancouver, BC',
    ntrpLevel: '4.0',
    isFollowing: true,
    followerCount: 56,
  },
  {
    id: 'player2',
    name: 'Marcus Lee',
    type: 'player',
    bio: 'Weekend warrior. Love doubles.',
    location: 'Burnaby, BC',
    ntrpLevel: '3.5',
    isFollowing: true,
    followerCount: 34,
  },
];

// Mock data for followers
const MOCK_FOLLOWERS: Connection[] = [
  {
    id: 'player3',
    name: 'Alex Thompson',
    type: 'player',
    bio: 'Tennis enthusiast, 3.0 working towards 3.5.',
    location: 'Richmond, BC',
    ntrpLevel: '3.0',
    isFollowing: false,
    followerCount: 23,
  },
  {
    id: 'player4',
    name: 'Jennifer Wu',
    type: 'player',
    bio: 'Former college player getting back into the game.',
    location: 'Vancouver, BC',
    ntrpLevel: '4.5',
    isFollowing: true,
    followerCount: 89,
  },
  {
    id: 'coach3',
    name: 'Coach David Park',
    type: 'coach',
    bio: 'Specializing in advanced competitive players.',
    location: 'Surrey, BC',
    specialties: ['Competition', 'Strategy'],
    rating: 4.7,
    isFollowing: false,
    followerCount: 156,
  },
  {
    id: 'club2',
    name: 'Stanley Park Tennis',
    type: 'club',
    bio: 'Public tennis facility with 17 courts.',
    location: 'Vancouver, BC',
    courtCount: 17,
    isFollowing: false,
    followerCount: 2340,
  },
];

const ConnectionsTab: React.FC<ConnectionsTabProps> = ({ 
  portalType, 
  currentUserId, 
  currentUserName 
}) => {
  const [activeTab, setActiveTab] = useState<ConnectionTab>('following');
  const [filter, setFilter] = useState<FilterType>('all');
  const [following, setFollowing] = useState<Connection[]>(MOCK_FOLLOWING);
  const [followers, setFollowers] = useState<Connection[]>(MOCK_FOLLOWERS);

  // Get portal-specific colors
  const getPortalColor = () => {
    switch (portalType) {
      case 'coach': return 'portal-coach';
      case 'club': return 'portal-club';
      case 'player': return 'orange-500';
      default: return 'gray-500';
    }
  };

  const getPortalBgLight = () => {
    switch (portalType) {
      case 'coach': return 'bg-green-50';
      case 'club': return 'bg-teal-50';
      case 'player': return 'bg-orange-50';
      default: return 'bg-gray-50';
    }
  };

  const getPortalBorderLight = () => {
    switch (portalType) {
      case 'coach': return 'border-green-200';
      case 'club': return 'border-teal-200';
      case 'player': return 'border-orange-200';
      default: return 'border-gray-200';
    }
  };

  const connections = activeTab === 'following' ? following : followers;
  const setConnections = activeTab === 'following' ? setFollowing : setFollowers;

  const filteredConnections = connections.filter(c => {
    if (filter === 'all') return true;
    if (filter === 'players') return c.type === 'player';
    if (filter === 'coaches') return c.type === 'coach';
    if (filter === 'clubs') return c.type === 'club';
    return true;
  });

  const handleToggleFollow = (connectionId: string) => {
    // Update in following list
    setFollowing(prev => prev.map(c => 
      c.id === connectionId 
        ? { ...c, isFollowing: !c.isFollowing }
        : c
    ));
    // Update in followers list
    setFollowers(prev => prev.map(c => 
      c.id === connectionId 
        ? { ...c, isFollowing: !c.isFollowing }
        : c
    ));
  };

  const getTypeBadge = (type: EntityType) => {
    switch (type) {
      case 'coach':
        return <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">Coach</span>;
      case 'club':
        return <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">Club</span>;
      case 'player':
        return <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">Player</span>;
      default:
        return null;
    }
  };

  const getTypeColor = (type: EntityType) => {
    switch (type) {
      case 'coach': return 'bg-portal-coach';
      case 'club': return 'bg-portal-club';
      case 'player': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getFollowButtonClass = (connection: Connection) => {
    if (connection.isFollowing) {
      return 'bg-gray-200 text-gray-700 hover:bg-gray-300';
    }
    switch (connection.type) {
      case 'coach': return 'bg-portal-coach text-white hover:bg-green-600';
      case 'club': return 'bg-portal-club text-white hover:bg-teal-600';
      case 'player': return 'bg-orange-500 text-white hover:bg-orange-600';
      default: return 'bg-gray-500 text-white hover:bg-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Connections</h2>
          <p className="text-sm text-gray-500">Manage your network and discover new connections</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('following')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'following'
              ? `bg-${getPortalColor()} text-white`
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          style={activeTab === 'following' ? {
            backgroundColor: portalType === 'coach' ? '#22C55E' : portalType === 'club' ? '#0D9488' : '#F97316'
          } : {}}
        >
          Following ({following.length})
        </button>
        <button
          onClick={() => setActiveTab('followers')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'followers'
              ? `bg-${getPortalColor()} text-white`
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          style={activeTab === 'followers' ? {
            backgroundColor: portalType === 'coach' ? '#22C55E' : portalType === 'club' ? '#0D9488' : '#F97316'
          } : {}}
        >
          Followers ({followers.length})
        </button>
      </div>

      {/* Filter Dropdown */}
      <div className={`${getPortalBgLight()} ${getPortalBorderLight()} border rounded-xl p-4`}>
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Filter by:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterType)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
            style={{
              focusRing: portalType === 'coach' ? '#22C55E' : portalType === 'club' ? '#0D9488' : '#F97316'
            }}
          >
            <option value="all">All</option>
            <option value="players">Players</option>
            <option value="coaches">Coaches</option>
            <option value="clubs">Clubs</option>
          </select>
          <span className="text-sm text-gray-500 ml-auto">
            {filteredConnections.length} {activeTab === 'following' ? 'following' : 'followers'}
          </span>
        </div>
      </div>

      {/* Connections List */}
      <div className="space-y-3">
        {filteredConnections.length > 0 ? (
          filteredConnections.map(connection => (
            <div 
              key={connection.id}
              className={`bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow border-l-4 ${
                connection.type === 'coach' ? 'border-l-portal-coach' :
                connection.type === 'club' ? 'border-l-portal-club' : 'border-l-orange-500'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg flex-shrink-0 ${getTypeColor(connection.type)}`}>
                  {connection.name.charAt(0)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{connection.name}</h3>
                    {getTypeBadge(connection.type)}
                  </div>
                  
                  {connection.bio && (
                    <p className="text-sm text-gray-500 line-clamp-1 mb-2">{connection.bio}</p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    {connection.location && (
                      <span className="flex items-center gap-1 text-gray-400">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {connection.location}
                      </span>
                    )}
                    {connection.ntrpLevel && (
                      <span className="text-orange-600 font-medium">NTRP {connection.ntrpLevel}</span>
                    )}
                    {connection.rating && (
                      <span className="flex items-center gap-1 text-yellow-600">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {connection.rating}
                      </span>
                    )}
                    {connection.courtCount && (
                      <span className="text-teal-600 font-medium">{connection.courtCount} courts</span>
                    )}
                    {connection.specialties && connection.specialties.length > 0 && (
                      <span className="text-green-600">
                        {connection.specialties.slice(0, 2).join(', ')}
                      </span>
                    )}
                    <span className="text-gray-400">
                      {connection.followerCount} followers
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleToggleFollow(connection.id)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex-shrink-0 ${getFollowButtonClass(connection)}`}
                >
                  {connection.isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">
              {activeTab === 'following' ? 'Not following anyone yet' : 'No followers yet'}
            </h3>
            <p className="text-sm text-gray-500">
              {activeTab === 'following' 
                ? 'Discover players, coaches, and clubs to follow in the Ball Park!'
                : 'Share great content in Ball Park to grow your audience!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionsTab;
