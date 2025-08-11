// Timeline.jsx

import * as React from 'react';
import MuiTimeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';

export default function Timeline({ posts, onPostClick }) {
    return (
        <MuiTimeline position="alternate">
            {posts.map((post, index) => (
                <TimelineItem key={post.id} style={{ cursor: 'pointer' }} onClick={() => onPostClick(post)}>
                    <TimelineOppositeContent
                        sx={{ m: 'auto 0' }}
                        align={index % 2 === 0 ? "right" : "left"}
                        variant="body2"
                        color="text.secondary"
                    >
                        {new Date(post.created_at).toLocaleDateString()}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        {index !== 0 && <TimelineConnector />}
                        <TimelineDot sx={{ padding: 0, width: 48, height: 48, overflow: 'hidden' }}>
                            <img
                                src={post.media_url}
                                alt={post.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                            />
                        </TimelineDot>
                        {index !== posts.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                        <Typography variant="h6" component="span">
                            {post.title}
                        </Typography>
                        <Typography>{post.location_name}</Typography>
                    </TimelineContent>
                </TimelineItem>
            ))}
        </MuiTimeline>
    );
}
