import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Download, 
  Mail, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Users, 
  Trophy, 
  Calendar,
  MapPin,
  Phone,
  Mail as MailIcon,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Select from 'react-select';
import axios from 'axios';
import toast from 'react-hot-toast';
import ParaSportsIcons from '../components/ParaSportsIcons';
import { ScreenReaderContext } from '../components/ScreenReader';

const PlayerList = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedDisability, setSelectedDisability] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});

  // Sports options for filter
  const sportsOptions = [
    { value: 'Wheelchair Basketball', label: 'Wheelchair Basketball' },
    { value: 'Para Swimming', label: 'Para Swimming' },
    { value: 'Para Athletics', label: 'Para Athletics' },
    { value: 'Wheelchair Tennis', label: 'Wheelchair Tennis' },
    { value: 'Para Powerlifting', label: 'Para Powerlifting' },
    { value: 'Para Cycling', label: 'Para Cycling' },
    { value: 'Wheelchair Rugby', label: 'Wheelchair Rugby' },
    { value: 'Para Table Tennis', label: 'Para Table Tennis' },
    { value: 'Para Badminton', label: 'Para Badminton' },
    { value: 'Para Archery', label: 'Para Archery' },
    { value: 'Para Shooting', label: 'Para Shooting' },
    { value: 'Para Judo', label: 'Para Judo' },
    { value: 'Para Taekwondo', label: 'Para Taekwondo' },
    { value: 'Para Rowing', label: 'Para Rowing' },
    { value: 'Para Canoe', label: 'Para Canoe' },
    { value: 'Para Triathlon', label: 'Para Triathlon' },
    { value: 'Para Alpine Skiing', label: 'Para Alpine Skiing' },
    { value: 'Para Cross-Country Skiing', label: 'Para Cross-Country Skiing' },
    { value: 'Para Snowboarding', label: 'Para Snowboarding' },
    { value: 'Para Ice Hockey', label: 'Para Ice Hockey' },
    { value: 'Other', label: 'Other' }
  ];

  const disabilityOptions = [
    { value: 'Physical Impairment', label: 'Physical Impairment' },
    { value: 'Visual Impairment', label: 'Visual Impairment' },
    { value: 'Intellectual Impairment', label: 'Intellectual Impairment' },
    { value: 'Hearing Impairment', label: 'Hearing Impairment' },
    { value: 'Multiple Disabilities', label: 'Multiple Disabilities' },
    { value: 'Other', label: 'Other' }
  ];

  // Fetch players
  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedSport && { sport: selectedSport.value }),
        ...(selectedDisability && { disabilityType: selectedDisability.value })
      });

      const response = await axios.get(`http://localhost:5000/api/players?${params}`);
      
      if (response.data.success) {
        setPlayers(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching players:', error);
      toast.error('Failed to load players');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, [currentPage, searchTerm, selectedSport, selectedDisability]);

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handle sport filter
  const handleSportFilter = (option) => {
    setSelectedSport(option);
    setCurrentPage(1);
  };

  // Handle disability filter
  const handleDisabilityFilter = (option) => {
    setSelectedDisability(option);
    setCurrentPage(1);
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSport(null);
    setSelectedDisability(null);
    setCurrentPage(1);
  };

  // Regenerate ID card
  const regenerateIdCard = async (playerId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/players/${playerId}/regenerate-idcard`);
      if (response.data.success) {
        toast.success('ID card regenerated and sent to email!');
      }
    } catch (error) {
      console.error('Error regenerating ID card:', error);
      toast.error('Failed to regenerate ID card');
    }
  };

  // Download ID card
  const downloadIdCard = async (playerId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/idcards/${playerId}/download`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ID_Card_${playerId}.png`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading ID card:', error);
      toast.error('Failed to download ID card');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-lg text-neutral-600 font-medium">Loading players...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Para Sports Decorative Background */}
      <ParaSportsIcons />
      
      <div className="relative z-10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl shadow-glow-green flex items-center justify-center">
                <Users size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold gradient-text">
                  Registered Players
                </h1>
                <p className="text-lg text-neutral-600 mt-2">
                  View and manage all registered para sports players in our comprehensive database
                </p>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="card p-6 mb-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-700">Search Players</label>
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or player ID..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="input-field pl-10"
                  />
                </div>
              </div>

              {/* Sport Filter */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Filter by Sport</label>
                <Select
                  options={sportsOptions}
                  value={selectedSport}
                  onChange={handleSportFilter}
                  placeholder="All sports"
                  isClearable
                  isSearchable
                  className="text-sm"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      border: state.isFocused ? '2px solid #3b82f6' : '1px solid #d1d5db',
                      borderRadius: '8px',
                      padding: '4px',
                      boxShadow: state.isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
                      '&:hover': {
                        borderColor: '#3b82f6'
                      }
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white',
                      color: state.isSelected ? 'white' : '#374151',
                      padding: '8px 12px',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: state.isSelected ? '#3b82f6' : '#eff6ff'
                      }
                    }),
                    menu: (base) => ({
                      ...base,
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                      zIndex: 9999
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: '#9ca3af'
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: '#374151'
                    }),
                    clearIndicator: (base) => ({
                      ...base,
                      color: '#9ca3af',
                      '&:hover': {
                        color: '#ef4444'
                      }
                    }),
                    dropdownIndicator: (base) => ({
                      ...base,
                      color: '#9ca3af',
                      '&:hover': {
                        color: '#3b82f6'
                      }
                    })
                  }}
                />
              </div>

              {/* Disability Filter */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Filter by Disability</label>
                <Select
                  options={disabilityOptions}
                  value={selectedDisability}
                  onChange={handleDisabilityFilter}
                  placeholder="All disabilities"
                  isClearable
                  isSearchable
                  className="text-sm"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      border: state.isFocused ? '2px solid #3b82f6' : '1px solid #d1d5db',
                      borderRadius: '8px',
                      padding: '4px',
                      boxShadow: state.isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
                      '&:hover': {
                        borderColor: '#3b82f6'
                      }
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white',
                      color: state.isSelected ? 'white' : '#374151',
                      padding: '8px 12px',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: state.isSelected ? '#3b82f6' : '#eff6ff'
                      }
                    }),
                    menu: (base) => ({
                      ...base,
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                      zIndex: 9999
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: '#9ca3af'
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: '#374151'
                    }),
                    clearIndicator: (base) => ({
                      ...base,
                      color: '#9ca3af',
                      '&:hover': {
                        color: '#ef4444'
                      }
                    }),
                    dropdownIndicator: (base) => ({
                      ...base,
                      color: '#9ca3af',
                      '&:hover': {
                        color: '#3b82f6'
                      }
                    })
                  }}
                />
              </div>

              {/* Clear Filters */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">&nbsp;</label>
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <Filter size={16} />
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Players Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {players.map((player) => (
              <div key={player._id} className="card-hover p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-sm flex items-center justify-center">
                      <Users size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {player.firstName} {player.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">ID: {player.playerId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Active
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail size={16} />
                    <span>{player.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Trophy size={16} />
                    <span>{player.primarySport}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={16} />
                    <span>{player.address?.city}, {player.address?.state}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} />
                    <span>Registered: {new Date(player.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => downloadIdCard(player._id)}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Download size={16} />
                    Download ID
                  </button>
                  <button
                    onClick={() => regenerateIdCard(player._id)}
                    className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Mail size={16} />
                    Resend Email
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && (
            <div className="flex items-center justify-between mt-8">
              <div className="text-sm text-gray-600">
                Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.total)} of {pagination.total} players
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                <span className="px-3 py-2 bg-blue-600 text-white rounded-lg">
                  {currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage >= pagination.totalPages}
                  className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {players.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={48} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No players found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
              <Link to="/register" className="btn-primary">
                <Plus size={20} />
                Register New Player
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerList; 