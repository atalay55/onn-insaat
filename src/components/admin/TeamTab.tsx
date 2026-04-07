import { Plus, Edit2, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type TeamMember } from '@/services/teamService';

interface TeamTabProps {
  team: TeamMember[];
  showForm: boolean;
  teamFormData: {
    name: string;
    role: string;
    email: string;
  };
  editingTeamMember: TeamMember | null;
  formMessage?: {type: 'success' | 'error'; text: string} | null;
  onShowForm: () => void;
  onFormDataChange: (data: { name: string; role: string; email: string }) => void;
  onSaveTeamMember: (e: React.FormEvent) => void;
  onEditTeamMember: (member: TeamMember) => void;
  onDeleteTeamMember: (id: string) => void;
}

export function TeamTab({
  team,
  showForm,
  teamFormData,
  editingTeamMember,
  formMessage,
  onShowForm,
  onFormDataChange,
  onSaveTeamMember,
  onEditTeamMember,
  onDeleteTeamMember,
}: TeamTabProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light text-white mb-2">Ekip Yönetimi</h2>
          <p className="text-white/60">Şirket ekibinizi yönetin ve güncelleyin</p>
        </div>
        <Button
          onClick={onShowForm}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          {showForm ? 'İptal' : 'Yeni Ekip Üyesi'}
        </Button>
      </div>

      {showForm && (
        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
          <h3 className="text-xl font-medium text-white mb-6">
            {editingTeamMember ? 'Ekip Üyesini Düzenle' : 'Yeni Ekip Üyesi Ekle'}
          </h3>
          <form onSubmit={onSaveTeamMember} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-white/60">
                  Ad Soyad
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ad Soyad"
                  value={teamFormData.name}
                  onChange={(e) =>
                    onFormDataChange({ ...teamFormData, name: e.target.value })
                  }
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-white/30"
                  required
                />
              </div>
              <div>
                <Label htmlFor="role" className="text-white/60">
                  Görevi
                </Label>
                <Input
                  id="role"
                  type="text"
                  placeholder="Görev ünvanı"
                  value={teamFormData.role}
                  onChange={(e) =>
                    onFormDataChange({ ...teamFormData, role: e.target.value })
                  }
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-white/30"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email" className="text-white/60">
                E-posta
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="E-posta adresi"
                value={teamFormData.email}
                onChange={(e) =>
                  onFormDataChange({ ...teamFormData, email: e.target.value })
                }
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-white/30"
                required
              />
            </div>
            
            {formMessage && (
              <div 
                className={`p-3 rounded border text-sm mt-2 ${
                  formMessage.type === 'success' 
                    ? 'border-emerald-600 bg-emerald-600/10 text-emerald-400' 
                    : 'border-red-600 bg-red-600/10 text-red-400'
                }`}
              >
                {formMessage.text}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {editingTeamMember ? 'Güncelle' : 'Kaydet'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onShowForm}
                className="border-zinc-700 text-white/60 hover:text-white hover:bg-zinc-800"
              >
                İptal
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((member) => (
          <div
            key={member.id}
            className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 hover:border-emerald-500/30 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEditTeamMember(member)}
                  className="text-white/60 hover:text-emerald-400 p-1"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => member.id && onDeleteTeamMember(member.id)}
                  className="text-white/60 hover:text-red-400 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <h3 className="text-lg font-medium text-white mb-1">
              {member.name}
            </h3>
            <p className="text-emerald-400 text-sm mb-3">{member.role}</p>
            <a
              href={`mailto:${member.email}`}
              className="text-white/50 text-sm hover:text-emerald-400 transition-colors"
            >
              {member.email}
            </a>
          </div>
        ))}
      </div>

      {team.length === 0 && (
        <div className="text-center py-12 text-white/60">
          Henüz ekip üyesi eklenmemiş.
        </div>
      )}
    </div>
  );
}