import React, { useState } from 'react';
import { Contact } from '../types';
import { UserPlus, Search, Phone, Mail, Building, Tag, MessageSquare, Plus } from 'lucide-react';

interface ContactsViewProps {
  contacts: Contact[];
  onAddContact: (contact: Partial<Contact>) => void;
}

export const ContactsView: React.FC<ContactsViewProps> = ({ contacts, onAddContact }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrg, setSelectedOrg] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Extract list of unique organizations
  const organizations = Array.from(new Set(contacts.map(c => c.organization))).filter(Boolean);

  const filteredContacts = contacts.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedOrg !== 'all' && c.organization !== selectedOrg) return false;
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddContact({
      name,
      organization: organization || 'General Partner',
      role: role || 'Contact',
      phone: phone || '+92 300 000 0000',
      email: email || `${name.toLowerCase().replace(/\s+/g, '')}@partner.com`,
      avatar: `https://images.unsplash.com/photo-${1530000000000 + Math.floor(Math.random() * 100000)}?auto=format&fit=crop&q=80&w=250`,
      tags: [organization || 'Partner'],
    });

    setName('');
    setOrganization('');
    setRole('');
    setPhone('');
    setEmail('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="flex-1 max-w-md mx-auto w-full px-4 pt-2 pb-24 space-y-4 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white font-heading">Contacts & Organizations</h2>
          <p className="text-xs text-gray-400">Auto-tagged in voice prompts & tasks</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-600/30 active:scale-95 transition-all"
        >
          <UserPlus className="w-4 h-4" /> Add Contact
        </button>
      </div>

      {/* Search & Organization Filter */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, company, or role..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Organization Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setSelectedOrg('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedOrg === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-white/5 text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            All Organizations ({contacts.length})
          </button>
          {organizations.map(org => (
            <button
              key={org}
              onClick={() => setSelectedOrg(org)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedOrg === org
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              🏢 {org}
            </button>
          ))}
        </div>
      </div>

      {/* Contacts List Grid */}
      <div className="space-y-3">
        {filteredContacts.map(c => (
          <div
            key={c.id}
            className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] transition-all space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={c.avatar}
                  alt={c.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-500/40 shadow-md"
                />
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">{c.name}</h3>
                  <div className="text-xs text-purple-300 font-medium flex items-center gap-1">
                    <Building className="w-3 h-3" />
                    <span>{c.organization}</span>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">{c.role}</div>
                </div>
              </div>

              {/* Quick Action Phone / WhatsApp Buttons */}
              <div className="flex items-center gap-1.5">
                <a
                  href={`tel:${c.phone}`}
                  className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors"
                  title={`Call ${c.name}`}
                >
                  <Phone className="w-4 h-4" />
                </a>
                <a
                  href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 border border-teal-500/20 transition-colors"
                  title="WhatsApp Chat"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Notes or Tags */}
            {c.notes && <p className="text-xs text-gray-400 bg-white/5 p-2 rounded-xl italic">{c.notes}</p>}

            {c.tags && c.tags.length > 0 && (
              <div className="flex items-center gap-1.5 pt-1">
                {c.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 text-[10px] font-semibold bg-purple-500/10 text-purple-300 rounded-md border border-purple-500/20"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Contact Modal Drawer */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#111827] border-t border-white/10 rounded-t-3xl p-6 max-w-md mx-auto w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white">Add New Contact</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-full text-gray-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mohsin"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Company / Organization *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Labex Lab"
                  value={organization}
                  onChange={e => setOrganization(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Role / Position</label>
                  <input
                    type="text"
                    placeholder="e.g. Manager"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+92 300..."
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="mohsin@labexlab.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-sm shadow-lg shadow-purple-600/30 active:scale-95 transition-all"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
