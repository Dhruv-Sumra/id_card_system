import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Mail, Edit, User, MapPin, Trophy, Heart, Shield, Calendar, Phone, Mail as MailIcon, Star, Award, Users, Clock, Globe, Target, AlertCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const PlayerDetails = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [idCardUrl, setIdCardUrl] = useState(null);

  useEffect(() => {
    fetchPlayerDetails();
  }, [id]);

  const fetchPlayerDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/players/${id}`);
      
      if (response.data.success) {
        setPlayer(response.data.data);
        
        // Fetch ID card if generated
        if (response.data.data.idCardGenerated) {
          try {
            const idCardResponse = await axios.get(
              `http://localhost:5000/api/idcards/${response.data.data.playerId}/view`,
              { responseType: 'blob' }
            );
            const url = URL.createObjectURL(idCardResponse.data);
            setIdCardUrl(url);
          } catch (error) {
            console.error('Error loading ID card:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching player details:', error);
      toast.error('Failed to load player details');
    } finally {
      setLoading(false);
    }
  };

  const regenerateIdCard = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/players/${id}/regenerate-idcard`);
      if (response.data.success) {
        toast.success('ID card regenerated and sent to email!');
        // Refresh the page to show updated ID card
        fetchPlayerDetails();
      }
    } catch (error) {
      console.error('Error regenerating ID card:', error);
      toast.error('Failed to regenerate ID card');
    }
  };

  const downloadIdCard = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/idcards/${player.playerId}/download`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ID_Card_${player.playerId}.png`);
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
          <p className="text-lg text-neutral-600 font-medium">Loading player details...</p>
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <User size={48} className="text-neutral-400" />
          </div>
          <h2 className="text-2xl font-display font-bold text-neutral-900 mb-4">Player not found</h2>
          <p className="text-neutral-600 mb-8">The player you're looking for doesn't exist or has been removed.</p>
          <Link to="/players" className="btn-primary">
            <ArrowLeft size={20} />
            Back to Players
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <Link 
                to="/players" 
                className="btn-secondary"
              >
                <ArrowLeft size={20} />
                Back to Players
              </Link>
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold gradient-text">
                  {player.firstName} {player.lastName}
                </h1>
                <p className="text-neutral-600 font-medium">ID: {player.playerId}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={regenerateIdCard} className="btn-accent">
                <Mail size={20} />
                Regenerate ID
              </button>
              {player.idCardGenerated && (
                <button onClick={downloadIdCard} className="btn-success">
                  <Download size={20} />
                  Download ID
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Player Information */}
            <div className="card p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-soft flex items-center justify-center">
                  <User size={24} className="text-white" />
                </div>
                <h2 className="text-xl font-display font-semibold text-blue-900">Personal Information</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                  <span className="text-sm font-medium text-blue-800">Full Name:</span>
                  <span className="text-blue-900 font-semibold">{player.firstName} {player.lastName}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                  <span className="text-sm font-medium text-blue-800">Player ID:</span>
                  <span className="text-blue-900 font-semibold">{player.playerId}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                  <span className="text-sm font-medium text-blue-800">Date of Birth:</span>
                  <span className="text-blue-900 font-semibold">{new Date(player.dateOfBirth).toLocaleDateString()}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                  <span className="text-sm font-medium text-blue-800">Age:</span>
                  <span className="text-blue-900 font-semibold">{player.age} years</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                  <span className="text-sm font-medium text-blue-800">Gender:</span>
                  <span className="text-blue-900 font-semibold">{player.gender}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                  <span className="text-sm font-medium text-blue-800">Email:</span>
                  <span className="text-blue-900 font-semibold">{player.email}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                  <span className="text-sm font-medium text-blue-800">Phone:</span>
                  <span className="text-blue-900 font-semibold">{player.phone}</span>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="card p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-soft flex items-center justify-center">
                  <MapPin size={24} className="text-white" />
                </div>
                <h2 className="text-xl font-display font-semibold text-green-900">Address Information</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                  <span className="text-sm font-medium text-green-800">Street Address:</span>
                  <span className="text-green-900 font-semibold">{player.address.streetAddress}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                  <span className="text-sm font-medium text-green-800">City:</span>
                  <span className="text-green-900 font-semibold">{player.address.city}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                  <span className="text-sm font-medium text-green-800">State:</span>
                  <span className="text-green-900 font-semibold">{player.address.state}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                  <span className="text-sm font-medium text-green-800">Postal Code:</span>
                  <span className="text-green-900 font-semibold">{player.address.postalCode}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg md:col-span-2">
                  <span className="text-sm font-medium text-green-800">Country:</span>
                  <span className="text-green-900 font-semibold">{player.address.country}</span>
                </div>
              </div>
            </div>

            {/* Sports Information */}
            <div className="card p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-soft flex items-center justify-center">
                  <Trophy size={24} className="text-white" />
                </div>
                <h2 className="text-xl font-display font-semibold text-purple-900">Sports Information</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                  <span className="text-sm font-medium text-purple-800">Primary Sport:</span>
                  <span className="badge-primary">{player.primarySport}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                  <span className="text-sm font-medium text-purple-800">Secondary Sport:</span>
                  <span className="text-purple-900 font-semibold">{player.secondarySport || 'Not specified'}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                  <span className="text-sm font-medium text-purple-800">Experience Level:</span>
                  <span className="badge-secondary">{player.experienceLevel}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                  <span className="text-sm font-medium text-purple-800">Years of Experience:</span>
                  <span className="text-purple-900 font-semibold">{player.yearsOfExperience} years</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                  <span className="text-sm font-medium text-purple-800">Coach Name:</span>
                  <span className="text-purple-900 font-semibold">{player.coachName || 'Not specified'}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                  <span className="text-sm font-medium text-purple-800">Coach Contact:</span>
                  <span className="text-purple-900 font-semibold">{player.coachContact || 'Not specified'}</span>
                </div>
              </div>
            </div>

            {/* Disability Information */}
            <div className="card p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-soft flex items-center justify-center">
                  <Shield size={24} className="text-white" />
                </div>
                <h2 className="text-xl font-display font-semibold text-orange-900">Disability Information</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                  <span className="text-sm font-medium text-orange-800">Disability Type:</span>
                  <span className="badge-warning">{player.disabilityType}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                  <span className="text-sm font-medium text-orange-800">Classification:</span>
                  <span className="text-orange-900 font-semibold">{player.disabilityClassification}</span>
                </div>
                
                <div className="p-3 bg-white/50 rounded-lg">
                  <span className="text-sm font-medium text-orange-800 block mb-2">Description:</span>
                  <span className="text-orange-900">{player.impairmentDescription}</span>
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="card p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-soft flex items-center justify-center">
                  <Heart size={24} className="text-white" />
                </div>
                <h2 className="text-xl font-display font-semibold text-red-900">Medical Information</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                  <span className="text-sm font-medium text-red-800">Emergency Contact:</span>
                  <span className="text-red-900 font-semibold">{player.emergencyContact.name}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                  <span className="text-sm font-medium text-red-800">Relationship:</span>
                  <span className="text-red-900 font-semibold">{player.emergencyContact.relationship}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                  <span className="text-sm font-medium text-red-800">Emergency Phone:</span>
                  <span className="text-red-900 font-semibold">{player.emergencyContact.phone}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                  <span className="text-sm font-medium text-red-800">Medical Conditions:</span>
                  <span className="text-red-900 font-semibold">{player.medicalConditions || 'None specified'}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                  <span className="text-sm font-medium text-red-800">Medications:</span>
                  <span className="text-red-900 font-semibold">{player.medications || 'None specified'}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                  <span className="text-sm font-medium text-red-800">Allergies:</span>
                  <span className="text-red-900 font-semibold">{player.allergies || 'None specified'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Profile Photo */}
            <div className="card p-6 text-center">
              <div className="w-32 h-32 mx-auto mb-4 relative">
                <img 
                  src={player.profilePhotoUrl} 
                  alt={`${player.firstName} ${player.lastName}`}
                  className="w-full h-full rounded-full object-cover border-4 border-white shadow-soft"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center">
                  <Award size={16} className="text-white" />
                </div>
              </div>
              <h3 className="text-xl font-display font-semibold text-neutral-900 mb-2">
                {player.firstName} {player.lastName}
              </h3>
              <p className="text-neutral-600 mb-4">{player.primarySport}</p>
              <div className="flex items-center justify-center gap-2">
                <span className="badge-primary">{player.disabilityType}</span>
                <span className="badge-secondary">{player.experienceLevel}</span>
              </div>
            </div>

            {/* ID Card Preview */}
            {idCardUrl && (
              <div className="card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl shadow-soft flex items-center justify-center">
                    <Award size={20} className="text-white" />
                  </div>
                  <h2 className="text-lg font-display font-semibold text-neutral-900">ID Card Preview</h2>
                </div>
                
                <div className="bg-white rounded-xl shadow-soft overflow-hidden">
                  <img 
                    src={idCardUrl} 
                    alt="Player ID Card" 
                    className="w-full h-auto"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerDetails; 