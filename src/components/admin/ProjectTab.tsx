import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Project {
  id: string;
  name: string;
  location: string;
  status: string;
  duration: string;
  image: string;
  slug: string;
  description?: string;
  images?: string[];
  features?: string[];
}

interface ProjectTabProps {
  projects: Project[];
  loading: boolean;
  showForm: boolean;
  editingProject: Project | null;
  formData: any;
  formMessage?: {type: 'success' | 'error'; text: string} | null;
  onShowForm: () => void;
  onFormDataChange: (data: any) => void;
  onSaveProject: (e: React.FormEvent) => Promise<void>;
  onEditProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
}

export function ProjectTab({
  projects,
  showForm,
  formData,
  onShowForm,
  onFormDataChange,
  onSaveProject,
  onEditProject,
  onDeleteProject,
  editingProject,
  formMessage,
}: ProjectTabProps) {
  const generateSlug = (text: string) => {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-light text-white">Projeler</h2>
        <Button
          onClick={onShowForm}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Plus className="w-5 h-5 mr-2" /> {showForm ? 'İptal' : 'Yeni Proje'}
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={onSaveProject} className="bg-zinc-900 p-8 rounded-lg mb-8 border border-zinc-800">
          <h3 className="text-xl font-medium text-white mb-6">
            {editingProject ? 'Projeyi Düzenle' : 'Yeni Proje Ekle'}
          </h3>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/60 text-sm mb-2 block">Proje Adı *</label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    onFormDataChange({
                      ...formData,
                      name: e.target.value,
                      slug: generateSlug(e.target.value),
                    })
                  }
                  placeholder="Örn: ONN Moda"
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <div>
                <label className="text-white/60 text-sm mb-2 block">Slug (URL) *</label>
                <Input
                  value={formData.slug}
                  onChange={(e) => onFormDataChange({ ...formData, slug: e.target.value })}
                  placeholder="onn-moda"
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-white/60 text-sm mb-2 block">Konum *</label>
              <Input
                value={formData.location}
                onChange={(e) => onFormDataChange({ ...formData, location: e.target.value })}
                placeholder="Kadıköy / İstanbul"
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/60 text-sm mb-2 block">Durum</label>
                <select
                  value={formData.status}
                  onChange={(e) => onFormDataChange({ ...formData, status: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded text-white px-3 py-2"
                >
                  <option>PROJE AŞAMASINDA</option>
                  <option>SATIŞ AŞAMASINDA</option>
                  <option>TAMAMLANDI</option>
                </select>
              </div>
              <div>
                <label className="text-white/60 text-sm mb-2 block">Süre</label>
                <Input
                  value={formData.duration}
                  onChange={(e) => onFormDataChange({ ...formData, duration: e.target.value })}
                  placeholder="2023 - 2024"
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/60 text-sm mb-2 block">Kapak Resmi URL *</label>
                <Input
                  value={formData.image}
                  onChange={(e) => onFormDataChange({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-white/60 text-sm mb-2 block">Açıklama</label>
              <textarea
                value={formData.description}
                onChange={(e) => onFormDataChange({ ...formData, description: e.target.value })}
                placeholder="Proje hakkında bilgilendirme metni..."
                rows={4}
                className="w-full bg-zinc-800 border border-zinc-700 rounded text-white px-3 py-2 resize-none"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/60 text-sm mb-2 block">Galeri Resimleri (Virgülle ayırınız)</label>
                <textarea
                  value={formData.imagesText}
                  onChange={(e) => onFormDataChange({ ...formData, imagesText: e.target.value })}
                  placeholder="https://img1.jpg, https://img2.jpg"
                  rows={3}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded text-white px-3 py-2 resize-none text-sm"
                />
              </div>
              <div>
                <label className="text-white/60 text-sm mb-2 block">Özellikler (Virgülle ayırınız)</label>
                <textarea
                  value={formData.featuresText}
                  onChange={(e) => onFormDataChange({ ...formData, featuresText: e.target.value })}
                  placeholder="Bahçe, Mutfak, 3+1"
                  rows={3}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded text-white px-3 py-2 resize-none text-sm"
                />
              </div>
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

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                {editingProject ? 'Güncelle' : 'Ekle'}
              </Button>
              <Button
                type="button"
                onClick={onShowForm}
                variant="outline"
                className="border-zinc-700 text-white"
              >
                İptal
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Projects List */}
      <div className="grid gap-4">
        {projects.length === 0 ? (
          <div className="text-center text-white/60 py-12">Henüz proje eklenmemiş</div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 flex justify-between items-start hover:border-zinc-700 transition-colors"
            >
              <div className="flex-1 flex gap-4 items-center">
                {project.image && (
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                )}
                <div>
                  <h3 className="text-lg font-medium text-white mb-1">{project.name}</h3>
                  <p className="text-white/60 text-xs">/{project.slug}</p>
                  <p className="text-emerald-400 text-sm mt-1">
                    {project.status} <span className="text-white/40">• {project.location}</span>
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => onEditProject(project)}
                  size="sm"
                  variant="outline"
                  className="border-blue-600/30 text-blue-400 hover:bg-blue-600/20"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => onDeleteProject(project.id)}
                  size="sm"
                  variant="outline"
                  className="border-red-600/30 text-red-400 hover:bg-red-600/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}