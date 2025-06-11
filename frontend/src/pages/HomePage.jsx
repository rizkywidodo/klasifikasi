// src/pages/HomePage.jsx
import { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, CircularProgress, Tabs, Tab, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Papa from 'papaparse'; // Import Papaparse

// Helper component untuk Tab Panel
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function HomePage() {
  // States
  const [tabValue, setTabValue] = useState(0);
  const [selectedModel, setSelectedModel] = useState('bert_custom');
  const [reviewText, setReviewText] = useState('');
  const [predictionResult, setPredictionResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // States for CSV upload
  const [csvFile, setCsvFile] = useState(null);
  const [csvColumns, setCsvColumns] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState('');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCsvFile(file);
      // "Mengintip" header CSV menggunakan Papaparse
      Papa.parse(file, {
        header: true,
        preview: 1,
        complete: (results) => {
          setCsvColumns(results.meta.fields);
        }
      });
    }
  };

  const handleSingleTextSubmit = async () => {
    // ... (Logic fetch untuk teks tunggal, tambahkan 'model' di body)
    setIsLoading(true);
    setPredictionResult('');
    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: reviewText, model: selectedModel }),
      });
      const data = await response.json();
      setPredictionResult(data.prediction || data.error);
    } catch (error) { alert('Gagal terhubung ke server.'); }
    finally { setIsLoading(false); }
  };

  const handleCsvSubmit = async () => {
    // ... (Logic fetch untuk CSV, gunakan FormData)
    if (!csvFile || !selectedColumn) {
      alert("Pilih file dan kolom review terlebih dahulu.");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', csvFile);
    formData.append('model', selectedModel);
    formData.append('column', selectedColumn);

    try {
      const response = await fetch('http://127.0.0.1:5000/predict-csv', {
        method: 'POST',credentials: 'include', body: formData,
      });
      const data = await response.json();
      alert(data.message || data.error);
    } catch (error) { alert("Gagal mengupload file."); }
    finally { setIsLoading(false); }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>Dashboard</Typography>
      <Paper sx={{ p: 2, borderRadius: '0.5rem', boxShadow: '0 4px 12px 0 rgba(0,0,0,0.07)' }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Pilih Model</InputLabel>
          <Select value={selectedModel} label="Pilih Model" onChange={(e) => setSelectedModel(e.target.value)}>
            <MenuItem value="bert_custom">BERT (Custom Trained)</MenuItem>
            <MenuItem value="distilbert">DistilBERT (Fast)</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Klasifikasi Teks" />
            <Tab label="Upload File CSV" />
          </Tabs>
        </Box>

        {/* Panel untuk Teks Tunggal */}
        <TabPanel value={tabValue} index={0}>
          <Typography sx={{ mb: 2 }}>Masukkan satu kalimat untuk dianalisis.</Typography>
          <TextField fullWidth multiline rows={6} label="Tulis review di sini..." value={reviewText} onChange={(e) => setReviewText(e.target.value)} disabled={isLoading} />
          <Button variant="contained" sx={{ mt: 2 }} onClick={handleSingleTextSubmit} disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : 'Klasifikasi Teks'}
          </Button>
        </TabPanel>

        {/* Panel untuk Upload CSV */}
        <TabPanel value={tabValue} index={1}>
          <Typography sx={{ mb: 2 }}>Upload file .csv untuk diproses secara massal.</Typography>
          <Button variant="outlined" component="label">Pilih File CSV<input type="file" hidden accept=".csv" onChange={handleFileChange}/></Button>
          {csvFile && <Typography sx={{ my: 1 }}>File: {csvFile.name}</Typography>}

          {csvColumns.length > 0 && (
            <FormControl fullWidth sx={{ my: 2 }}>
              <InputLabel>Pilih Kolom Review</InputLabel>
              <Select value={selectedColumn} label="Pilih Kolom Review" onChange={(e) => setSelectedColumn(e.target.value)}>
                {csvColumns.map(col => <MenuItem key={col} value={col}>{col}</MenuItem>)}
              </Select>
            </FormControl>
          )}
          <Button variant="contained" sx={{ mt: 2 }} onClick={handleCsvSubmit} disabled={isLoading || !selectedColumn}>
            {isLoading ? <CircularProgress size={24} /> : 'Proses CSV'}
          </Button>
        </TabPanel>

        {/* Area Hasil Prediksi untuk Teks Tunggal */}
        {tabValue === 0 && predictionResult && (
          <Box sx={{ mt: 4, p: 2, backgroundColor: 'action.hover', borderRadius: 1 }}>
            <Typography variant="h6" align="center">Hasil Prediksi: <strong>{predictionResult}</strong></Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}