// Timeline.jsx

import * as React from "react";
import { TextField, Select, MenuItem, FormControl, InputLabel, Box } from "@mui/material";
import TravelMap from './TravelMap';

export default function Timeline({ posts, onPostClick, onAddPostClick }) {
    const [searchText, setSearchText] = React.useState("");
    const [moodFilter, setMoodFilter] = React.useState("");
    const [tagFilter, setTagFilter] = React.useState("");

    // estraggo mood e tag disponibili
    const moods = [...new Set(posts.map((p) => p.moods?.name).filter(Boolean))];
    const tags = [...new Set(posts.flatMap((p) => p.post_tags?.map(pt => pt.tags.name) || []))];

    // filtra i post
    const filteredPosts = React.useMemo(() => {
        let result = [...posts];

        if (searchText) {
            result = result.filter(p =>
                [p.title, p.description, p.location_name]
                    .filter(Boolean)
                    .some(field => field.toLowerCase().includes(searchText.toLowerCase()))
            );
        }
        if (moodFilter) result = result.filter(p => p.moods?.name === moodFilter);
        if (tagFilter) result = result.filter(p =>
            p.post_tags?.some(pt => pt.tags.name === tagFilter)
        );

        return result;
    }, [posts, searchText, moodFilter, tagFilter]);

    return (
        <div>
            {/* FILTRI */}
            <Box display="flex" gap={2} mb={4} flexWrap="wrap" justifyContent="center">
                <TextField
                    label="Cerca"
                    variant="outlined"
                    size="small"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />

                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel id="mood-label">Stato d'animo</InputLabel>
                    <Select
                        labelId="mood-label"
                        value={moodFilter}
                        onChange={(e) => setMoodFilter(e.target.value)}
                        label="Stato d'animo"
                    >
                        <MenuItem value="">Tutti</MenuItem>
                        {moods.map((m) => (
                            <MenuItem key={m} value={m}>
                                {m}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel id="tag-label">Tag</InputLabel>
                    <Select
                        labelId="tag-label"
                        value={tagFilter}
                        onChange={(e) => setTagFilter(e.target.value)}
                        label="Tag"
                    >
                        <MenuItem value="">Tutti</MenuItem>
                        {tags.map((t) => (
                            <MenuItem key={t} value={t}>
                                {t}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* MAPPA */}
            <Box mb={6}>
                <TravelMap
                    events={filteredPosts}
                    onPostClick={onPostClick}
                    onAddPostClick={onAddPostClick}
                />
            </Box>
        </div>
    );
}
