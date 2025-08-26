// AddPost.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function AddPost({ onPostAdded }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [reflectionPositive, setReflectionPositive] = useState('');
    const [reflectionNegative, setReflectionNegative] = useState('');
    const [locationName, setLocationName] = useState('');
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);
    const [moodId, setMoodId] = useState(null);
    const [mediaUrl, setMediaUrl] = useState('');
    const [file, setFile] = useState(null);
    const [physicalEffort, setPhysicalEffort] = useState(1);
    const [economicEffort, setEconomicEffort] = useState(1);
    const [cost, setCost] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [tags, setTags] = useState([]);
    const [moods, setMoods] = useState([]);
    const [loading, setLoading] = useState(false);

    // Carica tags e moods dal DB
    useEffect(() => {
        const fetchData = async () => {
            const { data: tagsData, error: tagsError } = await supabase
                .from('tags')
                .select('*')
                .order('name', { ascending: true });
            if (!tagsError && tagsData) setTags(tagsData);

            const { data: moodsData, error: moodsError } = await supabase
                .from('moods')
                .select('*')
                .order('name', { ascending: true });
            if (!moodsError && moodsData) setMoods(moodsData);
        };
        fetchData();
    }, []);

    // Geolocalizzazione e reverse geocoding
    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            alert("La geolocalizzazione non è supportata dal tuo browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const latitude = pos.coords.latitude;
                const longitude = pos.coords.longitude;
                setLat(latitude);
                setLng(longitude);

                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
                    const data = await res.json();
                    if (data.address) {
                        const displayName = data.address.city || data.address.town || data.address.village || data.display_name;
                        setLocationName(displayName);
                    }
                } catch (err) {
                    console.error("Errore reverse geocoding:", err);
                }
            },
            (err) => {
                console.error("Errore geolocalizzazione:", err);
                alert("Impossibile ottenere la posizione");
            }
        );
    };

    // Gestione selezione file
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Upload file su Supabase Storage (bucket "Media")
    const uploadFile = async () => {
        if (!file) return null;

        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { data, error } = await supabase.storage.from('Media').upload(fileName, file);

        console.log("Upload data:", data);
        console.log("Upload error:", error);

        if (error) {
            console.error("Errore upload file:", error);
            return null;
        }

        const { data: urlData } = supabase.storage.from('Media').getPublicUrl(fileName);
        return urlData.publicUrl;
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Controllo campi obbligatori
        if (!title.trim() || !locationName.trim() || !description.trim() || !cost) {
            alert("Compila tutti i campi obbligatori: Titolo, Luogo, Descrizione e Costo.");
            return;
        }

        setLoading(true);

        let uploadedUrl = mediaUrl;
        if (file) {
            uploadedUrl = await uploadFile();
        }

        // Inserimento post
        const { data: newPost, error: postError } = await supabase
            .from('posts')
            .insert([{
                title,
                description,
                reflection_positive: reflectionPositive,
                reflection_negative: reflectionNegative,
                location_name: locationName,
                lat,
                lng,
                mood_id: moodId,
                media_url: uploadedUrl,
                physical_effort: physicalEffort,
                economic_effort: economicEffort,
                cost
            }])
            .select()
            .single();

        if (postError) {
            console.error("Errore inserimento post:", postError);
            setLoading(false);
            return;
        }

        // Inserimento tag collegati
        if (selectedTags.length > 0) {
            const tagsToInsert = selectedTags.map(tagId => ({ post_id: newPost.id, tag_id: tagId }));
            await supabase.from('post_tags').insert(tagsToInsert);
        }

        setLoading(false);
        onPostAdded(newPost);

        // Reset form
        setTitle('');
        setDescription('');
        setReflectionPositive('');
        setReflectionNegative('');
        setLocationName('');
        setLat(null);
        setLng(null);
        setMoodId(null);
        setMediaUrl('');
        setFile(null);
        setPhysicalEffort(1);
        setEconomicEffort(1);
        setCost('');
        setSelectedTags([]);
    };

    return (
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-2">
            <input type="text" placeholder="Titolo *" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <input type="text" placeholder="Luogo (nome) *" value={locationName} onChange={(e) => setLocationName(e.target.value)} required />
            <button type="button" onClick={handleGetLocation} className="btn btn-secondary">📍 Usa la mia posizione</button>
            {lat && lng && <p>Posizione: {lat.toFixed(5)}, {lng.toFixed(5)}</p>}

            <textarea placeholder="Descrizione *" value={description} onChange={(e) => setDescription(e.target.value)} required />
            <textarea placeholder="Riflessione positiva" value={reflectionPositive} onChange={(e) => setReflectionPositive(e.target.value)} />
            <textarea placeholder="Riflessione negativa" value={reflectionNegative} onChange={(e) => setReflectionNegative(e.target.value)} />

            <label>Immagine/Video</label>
            <input type="file" accept="image/*,video/*" onChange={handleFileChange} />

            <label>Sforzo fisico (1-5)</label>
            <input type="number" min="1" max="5" value={physicalEffort} onChange={(e) => setPhysicalEffort(Number(e.target.value))} />

            <label>Sforzo economico (1-5)</label>
            <input type="number" min="1" max="5" value={economicEffort} onChange={(e) => setEconomicEffort(Number(e.target.value))} />

            <label>Costo (€) *</label>
            <input type="number" step="0.01" value={cost} onChange={(e) => setCost(e.target.value)} required />

            <label>Mood</label>
            <select value={moodId || ''} onChange={(e) => setMoodId(Number(e.target.value))}>
                <option value="">Seleziona umore</option>
                {moods.map(mood => (
                    <option key={mood.id} value={mood.id}>{mood.name}</option>
                ))}
            </select>

            <label>Tags (selezione multipla)</label>
            <select
                multiple
                value={selectedTags}
                onChange={(e) =>
                    setSelectedTags(Array.from(e.target.selectedOptions, opt => Number(opt.value)))
                }
            >
                {tags.map(tag => (
                    <option key={tag.id} value={tag.id}>{tag.name}</option>
                ))}
            </select>

            <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Caricamento...' : 'Aggiungi Post'}
            </button>
        </form>
    );
}
