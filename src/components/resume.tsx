import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Print from 'expo-print';

export default function ResumeScreen() {
  const generateAndDownloadPdf = async () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
            h1 { font-size: 24px; margin-bottom: 0; color: #111; }
            h3 { color: #555; margin-top: 5px; }
            .section { margin-top: 20px; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
            ul { padding-left: 20px; }
          </style>
        </head>
        <body>
          <h1>Your Name</h1>
          <h3>Full-Stack Engineer & React Native Developer</h3>
          <p>Email: your.email@example.com | Phone: +1234567890</p>
          
          <div class="section">
            <h3>Education</h3>
            <p><strong>B.Tech in Computer Science</strong> - University Name (2022 - 2026)</p>
          </div>

          <div class="section">
            <h3>Technical Skills</h3>
            <p>React Native, Node.js, JavaScript, TypeScript, MongoDB, Express</p>
          </div>
        </body>
      </html>
    `;

    try {
      // Generates and triggers the native share/download print dialogue
      await Print.printAsync({
        html: htmlContent,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={generateAndDownloadPdf}>
        <Text style={styles.buttonText}>Download Resume PDF</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  button: { backgroundColor: '#007AFF', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});