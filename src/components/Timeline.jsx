// Timeline.jsx
import * as React from "react";
import MuiTimeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import Typography from "@mui/material/Typography";
import { TextField, Select, MenuItem, FormControl, InputLabel, Box } from "@mui/material";

export default function Timeline({ posts, onPostClick }) {
    const [searchText, setSearchText] = React.useState("");
    const [moodFilter, setMoodFilter] = React.useState("");
    const [tagFilter, setTagFilter] = React.useState("");
    const [sortBy, setSortBy] = React.useState("");

    // estraggo mood e tag disponibili dai post
    const moods = [...new Set(posts.map((p) => p.moods?.name).filter(Boolean))];
    const tags = [
        ...new Set(
            posts.flatMap((p) => p.post_tags?.map((pt) => pt.tags.name) || [])
        ),
    ];

    // filtro e ordino i post
    const filteredPosts = React.useMemo(() => {
        let result = [...posts];

        if (searchText) {
            result = result.filter((p) =>
                [p.title, p.description, p.location_name]
                    .filter(Boolean)
                    .some((field) =>
                        field.toLowerCase().includes(searchText.toLowerCase())
                    )
            );
        }

        if (moodFilter) {
            result = result.filter((p) => p.moods?.name === moodFilter);
        }

        if (tagFilter) {
            result = result.filter((p) =>
                p.post_tags?.some((pt) => pt.tags.name === tagFilter)
            );
        }

        if (sortBy === "date") {
            result.sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );
        }

        if (sortBy === "cost") {
            result.sort((a, b) => b.cost - a.cost);
        }

        return result;
    }, [posts, searchText, moodFilter, tagFilter, sortBy]);

    return (
        <div>
            {/* FILTRI */}
            <Box display="flex" gap={2} mb={4} flexWrap="wrap">
                <TextField
                    label="Cerca"
                    variant="outlined"
                    size="small"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />

                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Stato d'animo</InputLabel>
                    <Select
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

                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Tag</InputLabel>
                    <Select
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

                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Ordina per</InputLabel>
                    <Select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        label="Ordina per"
                    >
                        <MenuItem value="">Nessuno</MenuItem>
                        <MenuItem value="date">Data</MenuItem>
                        <MenuItem value="cost">Spesa economica</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* TIMELINE */}
            <MuiTimeline position="alternate">
                {filteredPosts.map((post, index) => (
                    <TimelineItem
                        key={post.id}
                        sx={{ cursor: "pointer", minHeight: 150 }}
                        onClick={() => onPostClick(post)}
                    >
                        {/* Titolo a sinistra/destra */}
                        <TimelineOppositeContent
                            sx={{ m: "auto 0", fontSize: "2rem", fontWeight: "bold" }}
                            align={index % 2 === 0 ? "right" : "left"}
                            color="text.primary"
                        >
                            {post.title}
                        </TimelineOppositeContent>

                        <TimelineSeparator>
                            {index !== 0 && (
                                <TimelineConnector
                                    sx={{ borderLeftWidth: 6, borderColor: "primary.main" }}
                                />
                            )}

                            {/* Cerchio grande con immagine */}
                            <TimelineDot
                                sx={{ width: 100, height: 100, padding: 0, overflow: "hidden" }}
                            >
                                {post.media_url && (
                                    <img
                                        src={post.media_url}
                                        alt={post.title}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            borderRadius: "50%",
                                        }}
                                    />
                                )}
                            </TimelineDot>

                            {index !== posts.length - 1 && (
                                <TimelineConnector
                                    sx={{ borderLeftWidth: 6, borderColor: "primary.main" }}
                                />
                            )}
                        </TimelineSeparator>

                        {/* Luogo e costo */}
                        <TimelineContent sx={{ minWidth: 250 }}>
                            <Typography variant="h5" component="div" gutterBottom>
                                {post.location_name}
                            </Typography>
                            <Typography variant="h5" component="div" color="success.main">
                                € {post.cost}
                            </Typography>
                        </TimelineContent>
                    </TimelineItem>
                ))}
            </MuiTimeline>
        </div>
    );
}
