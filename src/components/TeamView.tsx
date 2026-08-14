import React, { useState } from 'react';
import { TeamMember, Task, UserProfile } from '../types';
import { Users, Plus, Phone, Mail, CheckCircle2, Shield, Search, Download, X, Edit3, Trash2, Send, MessageSquare } from 'lucide-react';

interface TeamViewProps {
  team: TeamMember[];
  tasks: Task[];
  user: UserProfile | null;
  onAddTeamMember: (member: Partial<TeamMember>) => void;
  onUpdateTeamMember: (member: TeamMember) => void;
  onDeleteTeamMember: (memberId: string) => void;
  onEditTask?: (task: Task) => void;
  onToggleCompleteTask?: (taskId: string) => void;
}

export const TeamView: React.FC<TeamViewProps> = ({
  team,
  tasks,
  user,
  onAddTeamMember,
  onUpdateTeamMember,
  onDeleteTeamMember,
  onEditTask,
  onToggleCompleteTask,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [selectedDashboardMember, setSelectedDashboardMember] = useState<TeamMember | null>(null);

  // Form state (Mandatory Phone & Email)
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [phone, setPhone] = useState('+92 300 ');
  const [email, setEmail] = useState('');
  const [notifyViaSMS, setNotifyViaSMS] = useState(true);
  const [notifyViaEmail, setNotifyViaEmail] = useState(true);

  const openAddModal = () => {
    setName('');
    setRole('Operations Specialist');
    setPhone('+92 300 ');
    setEmail('');
    setNotifyViaSMS(true);
    setNotifyViaEmail(true);
    setEditingMember(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (member: TeamMember, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingMember(member);
    setName(member.name);
    setRole(member.role);
    setPhone(member.phone);
    setEmail(member.email);
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newMemberData: Partial<TeamMember> = {
      name,
      role: role || 'Team Member',
      phone: phone || '+92 300 000 0000',
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@company.com`,
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 100)}?auto=format&fit=crop&q=80&w=250`,
      active: true,
    };

    if (editingMember) {
      onUpdateTeamMember({
        ...editingMember,
        name,
        role,
        phone,
        email,
      });
    } else {
      onAddTeamMember(newMemberData);

      // Notify via SMS / WhatsApp & Email Launcher
      const inviteMsg = encodeURIComponent(
        `Hello ${name}! You have been added as ${role} to ${user?.name || 'our company'} on TaskGenie. View your assigned tasks live here: ${window.location.origin}`
      );

      if (notifyViaSMS && phone) {
        window.open(`sms:${phone}?body=${inviteMsg}`, '_blank');
      } else if (notifyViaEmail && email) {
        window.open(`mailto:${email}?subject=TaskGenie Company Invitation&body=${inviteMsg}`, '_blank');
      }
    }
    setIsAddModalOpen(false);
  };

  const filteredTeam = team.filter((m) => {
    return (
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const totalCompanyTasks = tasks.length;
  const completedCompanyTasks = tasks.filter((t) => t.status === 'completed').length;
  const companyEfficiency = totalCompanyTasks > 0 ? Math.round((completedCompanyTasks / totalCompanyTasks) * 100) : 0;

  const handleDownloadCompanyReport = () => {
    let reportText = `====================================================\n`;
    reportText += `       TASKGENIE COMPANY TEAM WORKLOAD REPORT       \n`;
    reportText += `====================================================\n`;
    reportText += `Generated Date: ${new Date().toLocaleString()}\n`;
    reportText += `Admin: ${user?.name || 'Admin'} (${user?.title || 'Director'})\n`;
    reportText += `Total Company Tasks: ${totalCompanyTasks}\n`;
    reportText += `Completed Company Tasks: ${completedCompanyTasks}\n`;
    reportText += `Overall Efficiency: ${companyEfficiency}%\n\n`;
    reportText += `----------------------------------------------------\n`;

    team.forEach((m) => {
      const assignedTasks = tasks.filter((t) => t.assigneeId === m.id || t.assigneeName === m.name || t.contactName === m.name);
      const doneTasks = assignedTasks.filter((t) => t.status === 'completed').length;
      reportText += `👤 ${m.name} [${m.role}]\n`;
      reportText += `   Phone: ${m.phone} | Email: ${m.email}\n`;
      reportText += `   Assigned Tasks: ${assignedTasks.length} | Completed: ${doneTasks}\n`;
      reportText += `   Task List:\n`;
      if (assignedTasks.length === 0) {
        reportText += `     - No active tasks assigned\n`;
      } else {
        assignedTasks.forEach((t, i) => {
          reportText += `     ${i + 1}. [${t.status.toUpperCase()}] ${t.title} (${t.dueDate || 'No Date'})\n`;
        });
      }
      reportText += `----------------------------------------------------\n`;
    });

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Company_Team_Report_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const memberTasks = selectedDashboardMember
    ? tasks.filter(
        (t) =>
          t.assigneeId === selectedDashboardMember.id ||
          t.assigneeName === selectedDashboardMember.name ||
          t.contactName === selectedDashboardMember.name
      )
    : [];

  return (
    <div className="flex-1 max-w-md mx-auto w-full px-4 pt-4 pb-24 select-none animate-fadeIn flex flex-col space-y-4">
      {/* Team Header & Export Report Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight font-heading">
            Company Team & Workload
          </h1>
          <p className="text-xs text-slate-500 font-medium">Add team members & notify via SMS/Email</p>
        </div>

        <button
          onClick={openAddModal}
          className="px-3.5 py-2 rounded-full bg-[#10B981] hover:bg-[#059669] text-white shadow-xs active:scale-95 transition-all flex items-center gap-1 text-xs font-extrabold"
        >
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>

      {/* Admin Company Workload Overview Box */}
      <div className="clean-card p-4.5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white space-y-3 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <div>
            <div className="text-[10px] font-extrabold text-[#10B981] uppercase tracking-wider flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> ADMIN DASHBOARD
            </div>
            <h3 className="text-sm font-extrabold text-white font-heading mt-0.5">
              {team.length} Team Members ({totalCompanyTasks} Tasks)
            </h3>
          </div>

          <button
            onClick={handleDownloadCompanyReport}
            className="px-3 py-1.5 rounded-full bg-[#10B981] text-white text-[11px] font-extrabold flex items-center gap-1 hover:bg-[#059669] shadow-sm transition-all"
            title="Download Executive Workload Report"
          >
            <Download className="w-3.5 h-3.5" /> Export Report
          </button>
        </div>

        <div className="flex items-center justify-between text-xs font-bold text-slate-300 pt-1 border-t border-slate-700/80">
          <span>Overall Company Efficiency: <strong className="text-[#10B981]">{companyEfficiency}%</strong></span>
          <span>Completed: {completedCompanyTasks} / {totalCompanyTasks}</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search team member name or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-slate-200/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#10B981] shadow-2xs"
        />
      </div>

      {/* Team Members Cards */}
      <div className="space-y-3">
        {filteredTeam.length === 0 ? (
          <div className="clean-card p-6 text-center space-y-1">
            <Users className="w-8 h-8 text-slate-300 mx-auto" />
            <div className="text-xs font-extrabold text-slate-900">No Team Members Found</div>
            <div className="text-[10px] text-slate-400 font-medium">Click "Add Member" to add employees and send invitation SMS/Email</div>
          </div>
        ) : (
          filteredTeam.map((member) => {
            const memberAssignedTasks = tasks.filter(
              (t) => t.assigneeId === member.id || t.assigneeName === member.name || t.contactName === member.name
            );
            const memberDoneTasks = memberAssignedTasks.filter((t) => t.status === 'completed').length;
            const memberPercent = memberAssignedTasks.length > 0
              ? Math.round((memberDoneTasks / memberAssignedTasks.length) * 100)
              : 0;

            const inviteMsg = encodeURIComponent(
              `Hello ${member.name}! Here are your assigned tasks on TaskGenie: ${window.location.origin}`
            );

            return (
              <div
                key={member.id}
                onClick={() => setSelectedDashboardMember(member)}
                className="clean-card p-4 space-y-3 hover:border-[#10B981] transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-11 h-11 rounded-full object-cover border-2 border-[#10B981]/40 shrink-0"
                    />
                    <div>
                      <h3 className="text-xs font-extrabold text-slate-900 font-heading group-hover:text-[#10B981] transition-colors">
                        {member.name}
                      </h3>
                      <div className="text-[10px] font-bold text-slate-500">{member.role}</div>
                      <div className="text-[9px] text-slate-400 font-medium mt-0.5">
                        📱 {member.phone} • ✉️ {member.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => openEditModal(member, e)}
                      className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-bold"
                      title="Edit member"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTeamMember(member.id);
                      }}
                      className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold"
                      title="Remove member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
                  <span className="text-slate-600">
                    Assigned Tasks: <strong className="text-slate-900">{memberAssignedTasks.length}</strong>
                  </span>
                  <span className="text-[#10B981]">{memberDoneTasks} Completed ({memberPercent}%)</span>
                </div>

                {/* Direct Invite & Notify Actions (SMS, WhatsApp, Email) */}
                <div className="flex items-center gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
                  <a
                    href={`sms:${member.phone}?body=${inviteMsg}`}
                    className="flex-1 py-1.5 rounded-xl bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20 text-[10px] font-extrabold flex items-center justify-center gap-1 transition-colors"
                    title="Send SMS Task Notification"
                  >
                    <MessageSquare className="w-3 h-3" /> SMS Notify
                  </a>

                  <a
                    href={`https://wa.me/${member.phone.replace(/\D/g, '')}?text=${inviteMsg}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-1.5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 text-[10px] font-extrabold flex items-center justify-center gap-1 transition-colors"
                    title="Send WhatsApp Task Notification"
                  >
                    <Send className="w-3 h-3" /> WhatsApp
                  </a>

                  <a
                    href={`mailto:${member.email}?subject=TaskGenie Task Assignment&body=${inviteMsg}`}
                    className="flex-1 py-1.5 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-[10px] font-extrabold flex items-center justify-center gap-1 transition-colors"
                    title="Send Email Task Notification"
                  >
                    <Mail className="w-3 h-3" /> Email
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Team Member Modal with SMS/Email Notify Switches */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-t-[32px] p-6 max-w-md mx-auto w-full space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 font-heading">
                {editingMember ? 'Edit Team Member' : 'Add Team Member & Notify'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariq Khan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Role / Designation *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sales Manager, Operations Director"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#10B981]"
                />
              </div>

              {/* MANDATORY PHONE NUMBER */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Mobile Phone Number * <span className="text-[10px] text-[#10B981] font-extrabold">(SMS / WhatsApp)</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+92 300 1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#10B981]"
                />
              </div>

              {/* MANDATORY EMAIL ADDRESS */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Email Address * <span className="text-[10px] text-[#10B981] font-extrabold">(Email Notify)</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="tariq@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#10B981]"
                />
              </div>

              {/* Instant Notification Option Switches */}
              {!editingMember && (
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="text-xs font-extrabold text-slate-900">Send Instant Mobile / Email Invitation:</div>

                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Send Mobile SMS Invitation</span>
                    <input
                      type="checkbox"
                      checked={notifyViaSMS}
                      onChange={(e) => setNotifyViaSMS(e.target.checked)}
                      className="w-4 h-4 accent-[#10B981]"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Send Email Company Invitation</span>
                    <input
                      type="checkbox"
                      checked={notifyViaEmail}
                      onChange={(e) => setNotifyViaEmail(e.target.checked)}
                      className="w-4 h-4 accent-[#10B981]"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-xs shadow-md shadow-[#10B981]/25 active:scale-95 transition-all"
              >
                {editingMember ? 'Save Member Details' : 'Add Team Member & Trigger Invite 🚀'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
