import React, { useState } from 'react';
import { Users, Plus, Edit2, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Member } from '../types';
import { EmojiAvatarPicker } from './EmojiAvatarPicker';

export function MemberManagement() {
  const { family, updateMembers } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState({
    nickname: '',
    role: 'kid' as 'kid' | 'teen' | 'adult',
    pin: '',
    avatar: '👤',
  });

  if (!family) return null;

  const handleAddMember = () => {
    if (!formData.nickname.trim() || !formData.pin.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const newMember: Member = {
      id: `member_${Date.now()}`,
      nickname: formData.nickname,
      role: formData.role,
      pin: formData.pin,
      avatar: formData.avatar,
      totalXp: 0,
      xpToday: 0,
      totalCash: 0,
      cashToday: 0,
      level: 1,
      streak: 0,
      badges: [],
    };

    updateMembers([...family.members, newMember]);
    setFormData({ nickname: '', role: 'kid', pin: '', avatar: '👤' });
    setShowAddForm(false);
  };

  const handleUpdateMember = () => {
    if (!editingMember || !formData.nickname.trim() || !formData.pin.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const updatedMembers = family.members.map(m =>
      m.id === editingMember.id
        ? { ...m, nickname: formData.nickname, role: formData.role, pin: formData.pin, avatar: formData.avatar }
        : m
    );

    updateMembers(updatedMembers);
    setEditingMember(null);
    setFormData({ nickname: '', role: 'kid', pin: '', avatar: '👤' });
  };

  const handleDeleteMember = (memberId: string) => {
    if (confirm('Are you sure you want to remove this member?')) {
      const updatedMembers = family.members.filter(m => m.id !== memberId);
      updateMembers(updatedMembers);
    }
  };

  const startEdit = (member: Member) => {
    setEditingMember(member);
    setFormData({
      nickname: member.nickname,
      role: member.role,
      pin: member.pin,
      avatar: member.avatar,
    });
    setShowAddForm(false);
  };

  const cancelEdit = () => {
    setEditingMember(null);
    setShowAddForm(false);
    setFormData({ nickname: '', role: 'kid', pin: '', avatar: '👤' });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-800">Manage Members</h2>
          </div>
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setEditingMember(null);
              setFormData({ nickname: '', role: 'kid', pin: '', avatar: '👤' });
            }}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Member
          </button>
        </div>

        {(showAddForm || editingMember) && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-6 border-2 border-blue-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {editingMember ? 'Edit Member' : 'Add New Member'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avatar
                </label>
                <EmojiAvatarPicker
                  selectedAvatar={formData.avatar}
                  onSelect={(avatar) => setFormData({ ...formData, avatar })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nickname
                </label>
                <input
                  type="text"
                  value={formData.nickname}
                  onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="Enter nickname"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'kid' | 'teen' | 'adult' })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                >
                  <option value="kid">Kid</option>
                  <option value="teen">Teen</option>
                  <option value="adult">Adult</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PIN (4 digits)
                </label>
                <input
                  type="text"
                  value={formData.pin}
                  onChange={(e) => setFormData({ ...formData, pin: e.target.value.slice(0, 4) })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="1234"
                  maxLength={4}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={editingMember ? handleUpdateMember : handleAddMember}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all"
                >
                  {editingMember ? 'Update' : 'Add'}
                </button>
                <button
                  onClick={cancelEdit}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Current Members ({family.members.length})</h3>
          {family.members.map((member) => (
            <div
              key={member.id}
              className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-gray-200 hover:border-blue-300 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{member.avatar}</div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-800">{member.nickname}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="capitalize">{member.role}</span>
                      <span>Level {member.level}</span>
                      <span>{member.totalXp} XP</span>
                      <span>{member.totalCash} {family.currency}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      PIN: {member.pin}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(member)}
                    className="bg-blue-500 text-white p-3 rounded-xl hover:bg-blue-600 transition-all"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteMember(member.id)}
                    className="bg-red-500 text-white p-3 rounded-xl hover:bg-red-600 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
