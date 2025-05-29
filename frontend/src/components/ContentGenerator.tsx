import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import config from '../config';

const ContentGenerator = () => {
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [referenceText, setReferenceText] = useState('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      const formData = new FormData();
      formData.append('file', uploadedFile);

      try {
        const response = await axios.post(`${config.apiUrl}/api/upload`, formData);
        setReferenceText(response.data.path);
      } catch (err) {
        setError('Failed to upload file');
      }
    }
  };

  const handleGenerateContent = async () => {
    if (!prompt) {
      setError('Please enter a prompt');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${config.apiUrl}/api/generate-content`, {
        contentType: 'content',
        prompt,
        referenceText,
      });

      setGeneratedContent(response.data.content);
    } catch (err) {
      setError('Failed to generate content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Content Generator
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <input
              accept=".doc,.docx,.pdf,.txt"
              style={{ display: 'none' }}
              id="file-upload"
              type="file"
              onChange={handleFileUpload}
            />
            <label htmlFor="file-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={<CloudUploadIcon />}
              >
                Upload Reference Document
              </Button>
            </label>
            {file && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected file: {file.name}
              </Typography>
            )}
          </Box>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Enter your prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleGenerateContent}
            disabled={loading}
            sx={{ mb: 3 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Generate Content'}
          </Button>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {generatedContent && (
            <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="h6" gutterBottom>
                Generated Content:
              </Typography>
              <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                {generatedContent}
              </Typography>
            </Paper>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ContentGenerator; 