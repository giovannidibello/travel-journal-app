// EditPost.jsx

import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function EditPost({ post, onPostUpdated }) {
    const [title, setTitle] = useState(post.title || '');
    const [description, setDescription] = useState(post.description || '');
    const [reflectionPositive, setReflectionPositive] = useState(post.reflection_positive || '');
    const [reflectionNegative, setReflectionNegative] = useState(post.reflection_negative || '');
    const [locationName, setLocationName] = useState(post.location_name || '');
    const [lat, setLat] = useState(post.lat || null);
    const [lng, setLng] = useState(post.lng || null);
    const [moodId, setMoodId] = useState(post.mood_id || null);
    const [mediaUrl, setMediaUrl] = useState(post.media_url || '');
    const [file, setFile] = useState(null);
    const [physicalEffort, setPhysicalEffort] = useState(post.physical_effort || 1);
    const [economicEffort, setEconomicEffort] = useState(post.economic_effort || 1);
    const [cost, setCost] = useState(post.cost || '');
    const [selectedTags, setSelectedTags] = useState([]);
    const [tags, setTags] = useState([]);
    const [moods, setMoods] = useState([]);
    const [loading, setLoading] = useState(false);

    // Carica tags e moods dal DB
    useEffect(() => {
        const fetchData = async () => {
            const { data: tagsData } = await supabase.from('tags').select('*').order('name');
            if (tagsData) setTags(tagsData);

            const { data: moodsData } = await supabase.from('moods').select('*').order('name');
            if (moodsData) setMoods(moodsData);

            // Carica tags collegati al post
            const { data: postTags } = await supabase.from('post_tags').select('tag_id').eq('post_id', post.id);
            if (postTags) setSelectedTags(postTags.map(t => t.tag_id));
        };
        fetchData();
    }, [post.id]);

    // Geolocalizzazione
    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            alert("La geolocalizzazione non è supportata");
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

    // Gestione file
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const uploadFile = async () => {
        if (!file) return mediaUrl; // se non cambio immagine tengo la vecchia

        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { data, error } = await supabase.storage.from('Media').upload(fileName, file);

        if (error) {
            console.error("Errore upload file:", error);
            return mediaUrl;
        }

        const { data: urlData } = supabase.storage.from('Media').getPublicUrl(fileName);
        return urlData.publicUrl;
    };

    // Submit update
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        let uploadedUrl = await uploadFile();

        // Update post
        const { data: updatedPost, error } = await supabase
            .from('posts')
            .update({
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
            })
            .eq('id', post.id)
            .select()
            .single();

        if (error) {
            console.error("Errore update post:", error);
            setLoading(false);
            return;
        }

        // Aggiorna i tag
        await supabase.from('post_tags').delete().eq('post_id', post.id);
        if (selectedTags.length > 0) {
            const tagsToInsert = selectedTags.map(tagId => ({ post_id: post.id, tag_id: tagId }));
            await supabase.from('post_tags').insert(tagsToInsert);
        }

        setLoading(false);
        onPostUpdated(updatedPost);
    };

    return (
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-2">
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titolo" required />
            <input type="text" value={locationName} onChange={(e) => setLocationName(e.target.value)} placeholder="Luogo" required />
            <button type="button" onClick={handleGetLocation} className="btn btn-secondary">📍 Usa la mia posizione</button>
            {lat && lng && <p>Posizione: {lat.toFixed(5)}, {lng.toFixed(5)}</p>}

            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrizione" required />
            <textarea value={reflectionPositive} onChange={(e) => setReflectionPositive(e.target.value)} placeholder="Riflessione positiva" />
            <textarea value={reflectionNegative} onChange={(e) => setReflectionNegative(e.target.value)} placeholder="Riflessione negativa" />

            <label>Immagine/Video</label>
            <input type="file" accept="image/*,video/*" onChange={handleFileChange} />

            <label>Sforzo fisico (1-5)</label>
            <input type="number" min="1" max="5" value={physicalEffort} onChange={(e) => setPhysicalEffort(Number(e.target.value))} />

            <label>Sforzo economico (1-5)</label>
            <input type="number" min="1" max="5" value={economicEffort} onChange={(e) => setEconomicEffort(Number(e.target.value))} />

            <label>Costo (€)</label>
            <input type="number" step="0.01" value={cost} onChange={(e) => setCost(e.target.value)} required />

            <label>Mood</label>
            <select value={moodId || ''} onChange={(e) => setMoodId(Number(e.target.value))}>
                <option value="">Seleziona umore</option>
                {moods.map(mood => (
                    <option key={mood.id} value={mood.id}>{mood.name}</option>
                ))}
            </select>

            <label>Tags</label>
            <select
                multiple
                value={selectedTags}
                onChange={(e) => setSelectedTags(Array.from(e.target.selectedOptions, opt => Number(opt.value)))}
            >
                {tags.map(tag => (
                    <option key={tag.id} value={tag.id}>{tag.name}</option>
                ))}
            </select>

            <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Salvataggio...' : 'Salva Modifiche'}
            </button>
        </form>
    );
}
