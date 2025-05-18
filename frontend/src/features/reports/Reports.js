// components/Reports/Reports.js
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: '1 solid #ccc',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E2875',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1E2875',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: 150,
    fontSize: 12,
    color: '#666',
  },
  value: {
    fontSize: 12,
    flex: 1,
  },
  scoreSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  neuroxaiImage: {
    width: '100%',
    height: 300,
    objectFit: 'contain',
    marginVertical: 10,
  },
  paragraph: {
    fontSize: 12,
    lineHeight: 1.6,
    marginTop: 10,
    color: '#333',
  },
});

const Reports = ({ patientData, result }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>DARWIN - Depression Analysis Report</Text>
        <Text style={styles.subtitle}>Generated on {new Date().toLocaleDateString()}</Text>
      </View>

      {/* Patient Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Patient Information</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{patientData.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Age:</Text>
          <Text style={styles.value}>{patientData.age}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Gender:</Text>
          <Text style={styles.value}>{patientData.gender}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Analysis Date:</Text>
          <Text style={styles.value}>{patientData.dateOfAnalysis}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>EEG Recording:</Text>
          <Text style={styles.value}>{patientData.eegCondition}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Recording Date:</Text>
          <Text style={styles.value}>{patientData.recordingDate}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>File Name:</Text>
          <Text style={styles.value}>{patientData.fileName}</Text>
        </View>
      </View>

      {/* Analysis Results */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Depression Analysis Results</Text>
        <View style={styles.scoreSection}>
          <View style={styles.row}>
            <Text style={styles.label}>Depression Probability:</Text>
            <Text style={styles.value}>{(result.depressionProbability * 100).toFixed(0)}%</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Model Accuracy:</Text>
            <Text style={styles.value}>{(result.modelAccuracy * 100).toFixed(1)}%</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Severity Level:</Text>
            <Text style={styles.value}>{result.severity}</Text>
          </View>
        </View>
      </View>

      {/* LIME Visualization */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>XAI Analysis</Text>
        <Image 
          src={result.limePlotUrl} // This will now be a base64 string
          style={styles.neuroxaiImage}
        />
      </View>

      {/* Interpretation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Analysis Interpretation</Text>
        <Text style={styles.paragraph}>{result.interpretation}</Text>
      </View>
    </Page>
  </Document>
);

export default Reports;
