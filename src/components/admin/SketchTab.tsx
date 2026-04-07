import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Sketch {
  id: string;
  imageUrl: string;
  title?: string;
  description?: string;
  createdAt?: any;
}

interface SketchTabProps {
  sketches: Sketch[];
  showForm: boolean;
  sketchFormData: any;
  editingSketch: Sketch | null;
  formMessage?: {type: 'success' | 'error'; text: string} | null;
  onShowForm: () => void;
  onFormDataChange: (data: any) => void;
  onSaveSketch: (e: React.FormEvent) => Promise<void>;
  onEditSketch: (sketch: Sketch) => void;
  onDeleteSketch: (id: string) => void;
}

export function SketchTab({
  sketches,
  showForm,
  sketchFormData,
  editingSketch,
  formMessage,
  onShowForm,
  onFormDataChange,
  onSaveSketch,
  onEditSketch,
  onDeleteSketch,
}: SketchTabProps) {
  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-light text-white">Eskizler</h2>
        <Button onClick={onShowForm} className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Plus className="w-5 h-5 mr-2" /> {showForm ? 'İptal' : 'Yeni Eskiz'}
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={onSaveSketch} className="bg-zinc-900 p-8 rounded-lg mb-8 border border-zinc-800">
          <h3 className="text-xl font-medium text-white mb-6">
            {editingSketch ? 'Eskizi Düzenle' : 'Yeni Eskiz Ekle'}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-white/60 text-sm mb-2 block">Resim URL *</label>
              <Input
                value={sketchFormData.imageUrl}
                onChange={(e) => onFormDataChange({ ...sketchFormData, imageUrl: e.target.value })}
                placeholder="Firebase Storage URL'sini girin"
                className="bg-zinc-800 border-zinc-700 text-white"
              />
              <p className="text-white/40 text-xs mt-1">
                Firebase Storage'a yükleyip sağ tıkla → "URL'yi kopyala" yapın
              </p>
            </div>

            <div>
              <label className="text-white/60 text-sm mb-2 block">Başlık (Opsiyonel)</label>
              <Input
                value={sketchFormData.title}
                onChange={(e) => onFormDataChange({ ...sketchFormData, title: e.target.value })}
                placeholder="Eskiz başlığı"
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>

            <div>
              <label className="text-white/60 text-sm mb-2 block">Açıklama (Opsiyonel)</label>
              <textarea
                value={sketchFormData.description}
                onChange={(e) => onFormDataChange({ ...sketchFormData, description: e.target.value })}
                placeholder="Eskiz açıklaması"
                rows={3}
                className="w-full bg-zinc-800 border border-zinc-700 rounded text-white px-3 py-2 resize-none"
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

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                {editingSketch ? 'Güncelle' : 'Ekle'}
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

      {/* Sketches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sketches.length === 0 ? (
          <div className="col-span-full text-center text-white/60 py-12">
            Henüz eskiz yüklenmemiş. Yukarıdaki butona tıklayarak ilk eskizi ekleyebilirsiniz.
          </div>
        ) : (
          sketches.map((sketch) => (
            <div
              key={sketch.id}
              className="bg-zinc-900 p-4 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <div className="aspect-video mb-4 overflow-hidden rounded bg-black">
                <img
                  src={sketch.imageUrl}
                  alt={sketch.title || 'Eskiz'}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                />
              </div>

              {sketch.title && (
                <h3 className="font-medium text-white mb-2 line-clamp-2">{sketch.title}</h3>
              )}

              {sketch.description && (
                <p className="text-white/70 text-sm mb-4 line-clamp-2">{sketch.description}</p>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-zinc-700">
                <p className="text-white/40 text-xs">
                  {sketch.createdAt?.toDate?.()?.toLocaleDateString?.('tr-TR') || 'Tarih bilinmiyor'}
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => onEditSketch(sketch)}
                    size="sm"
                    variant="outline"
                    className="border-blue-600/30 text-blue-400 hover:bg-blue-600/20"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => onDeleteSketch(sketch.id)}
                    size="sm"
                    variant="outline"
                    className="border-red-600/30 text-red-400 hover:bg-red-600/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}