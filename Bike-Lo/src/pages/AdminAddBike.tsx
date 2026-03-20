import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { createBike } from '@/services/bikeService';

export default function AdminAddBike() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const [make, setMake] = useState('');
  const [modelName, setModelName] = useState('');
  const [year, setYear] = useState<number | ''>('');
  const [kmDriven, setKmDriven] = useState<number | ''>('');
  const [ownership, setOwnership] = useState<number | ''>('');
  const [price, setPrice] = useState<number | ''>('');
  const [insurance, setInsurance] = useState(false);
  const [files, setFiles] = useState<
    { id: string; file: File; preview: string | null }[]
  >([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const MAX_FILES = 2;
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);

  const createPreview = (file: File) =>
    new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(typeof reader.result === 'string' ? reader.result : '');
      };
      reader.readAsDataURL(file);
    });

  const addFiles = async (incoming: FileList | File[]) => {
    const arr = Array.from(incoming);
    const allowed = MAX_FILES - files.length;
    const slice = arr.slice(0, allowed);
    const newItems: { id: string; file: File; preview: string | null }[] = [];
    for (const f of slice) {
      if (!f.type.startsWith('image/')) continue;
      // limit file size to 5MB
      if (f.size > 5 * 1024 * 1024) continue;
      const preview = await createPreview(f);
      newItems.push({ id: Date.now().toString() + Math.random(), file: f, preview });
    }
    if (newItems.length) setFiles((prev) => [...prev, ...newItems]);
  };

  const validate = () => {
    if (!make.trim() || !modelName.trim()) return 'Make and model are required';
    if (!year || Number(year) < 1900 || Number(year) > 2100 || !Number.isInteger(Number(year))) return 'Enter a valid year between 1900 and 2100';
    if (kmDriven === '' || Number(kmDriven) < 0) return 'Enter valid km driven';
    if (ownership === '' || Number(ownership) < 0) return 'Enter valid ownership count';
    if (price === '' || Number(price) < 0) return 'Enter valid price';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      toast.error(v);
      return;
    }
    setError(null);
    setIsSubmitting(true);
    setUploadErrors([]);

    try {
      const fd = new FormData();
      fd.append('make', make.trim());
      fd.append('model_name', modelName.trim());
      fd.append('year', String(Number(year)));
      fd.append('km_driven', String(Number(kmDriven)));
      fd.append('ownership', String(Number(ownership)));
      fd.append('price', String(Number(price)));
      fd.append('insurance', insurance ? 'true' : 'false');
      if (files[0]) fd.append('image_1', files[0].file);
      if (files[1]) fd.append('image_2', files[1].file);

      setIsUploading(true);
      await createBike(fd);
      setUploadComplete(true);
      toast.success('Bike added successfully!');
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Failed to save bike.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold mb-4">Add Bike</h1>
        <form onSubmit={handleSubmit} className="space-y-4 bg-card p-6 rounded-lg border border-border">
          {error && <div className="text-sm text-red-600">{error}</div>}

          <div>
            <Label htmlFor="make">Make</Label>
            <Input id="make" value={make} onChange={(e) => setMake(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="modelName">Model Name</Label>
            <Input id="modelName" value={modelName} onChange={(e) => setModelName(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="year">Year</Label>
              <Input id="year" type="number" value={year} onChange={(e) => setYear(e.target.value === '' ? '' : Number(e.target.value))} />
            </div>
            <div>
              <Label htmlFor="kmDriven">KM Driven</Label>
              <Input id="kmDriven" type="number" value={kmDriven} onChange={(e) => setKmDriven(e.target.value === '' ? '' : Number(e.target.value))} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ownership">Ownership</Label>
              <Input id="ownership" type="number" value={ownership} onChange={(e) => setOwnership(e.target.value === '' ? '' : Number(e.target.value))} />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox id="insurance" checked={insurance} onChange={(e) => setInsurance(e.target.checked)} />
            <Label htmlFor="insurance" className="mb-0">Insurance</Label>
          </div>

          <div>
            <Label htmlFor="images">Images</Label>
            <div
              onDragEnter={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragging(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer?.files) addFiles(e.dataTransfer.files);
              }}
              className={`rounded-md border p-6 text-center ${isDragging ? 'border-primary bg-primary/5' : 'border-dashed border-muted-foreground/25 hover:border-muted-foreground/50'}`}
            >
              <input
                ref={fileInputRef}
                id="images"
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(e) => {
                  if (e.target.files) addFiles(e.target.files);
                  e.currentTarget.value = '';
                }}
              />
              <div className="flex flex-col items-center gap-3">
                <div className="text-muted-foreground text-sm">
                  PNG, JPG up to 5MB each (max 2 files)
                </div>
                <div className="flex gap-2">
                  <Button type="button" onClick={() => fileInputRef.current?.click()}>Select images</Button>
                  <Button variant="outline" type="button" onClick={() => setFiles([])}>Clear all</Button>
                </div>
              </div>
            </div>

            {files.length > 0 && (
              <>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h4 className="text-sm font-medium">Gallery ({files.length}/{MAX_FILES})</h4>
                    <div className="text-muted-foreground text-xs">
                      Total: {files.reduce((acc, f) => acc + f.file.size, 0)} bytes
                    </div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-3">
                  {files.map((f) => (
                    <div key={f.id} className="relative group">
                      <img src={f.preview || ''} alt={f.file.name} className="w-full h-40 object-cover rounded" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2">
                        <Button size="icon" variant="secondary" onClick={() => setSelectedPreview(f.preview)}>View</Button>
                        <Button size="icon" variant="ghost" onClick={() => setFiles((prev) => prev.filter((p) => p.id !== f.id))}>Remove</Button>
                      </div>
                      <div className="mt-1 text-xs truncate">{f.file.name}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 mt-4">
            <Button type="submit" disabled={isSubmitting || isUploading}>
              {isUploading ? 'Uploading...' : isSubmitting ? 'Saving...' : 'Add Bike'}
            </Button>
            <Button variant="outline" onClick={() => navigate('/admin')}>Cancel</Button>
          </div>
        </form>
        
        {/* Upload Status */}
        {uploadComplete && (
          <div className="mt-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-green-800 dark:text-green-200">Upload completed</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Your bike and images were uploaded successfully.</p>
                {uploadErrors.length > 0 && (
                  <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                    Some uploads failed:
                    <ul className="list-disc ml-5">
                      {uploadErrors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button onClick={() => {
                  setMake(''); setModelName(''); setYear(''); setKmDriven(''); setOwnership(''); setPrice(''); setInsurance(false);
                  setFiles([]); setUploadErrors([]); setUploadComplete(false);
                }}>Add another</Button>
                <Button variant="outline" onClick={() => navigate('/admin')}>Go to Admin</Button>
              </div>
            </div>
          </div>
        )}

        {/* Preview Dialog */}
        {selectedPreview && (
          <div>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedPreview(null)}>
              <div className="fixed inset-0 bg-black/50" />
              <div className="relative z-50 w-full max-w-3xl">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6">
                  <img src={selectedPreview} alt="preview" className="w-full h-auto object-contain rounded" />
                  <div className="mt-4 text-right">
                    <Button onClick={() => setSelectedPreview(null)}>Close</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

