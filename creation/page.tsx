// pages/index.
'use client'
import { useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_SECRET_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

class PiAPIClient {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = 'https://api.piapi.ai/api/v1';
        this.client = axios.create({
            baseURL: this.baseURL,
            headers: {
                'X-API-Key': apiKey,
                'Content-Type': 'application/json'
            },
            timeout: 30000 // 30 second timeout
        });
    }

    async generateImage(prompt, imageUrls = [], numImages = 1, outputFormat = 'jpeg') {
        let taskId = null;
        
        try {
            // Validate input parameters
            this.validateInputs(prompt, imageUrls, numImages, outputFormat);

            // Step 1: Create the generation task
            const taskData = {
                model: "gemini",
                task_type: "gemini-2.5-flash-image",
                input: {
                    prompt: prompt,
                    image_urls: imageUrls,
                    num_images: numImages,
                    output_format: outputFormat
                }
            };

            console.log('📤 Creating Gemini image generation task...');
            const createResponse = await this.client.post('/task', taskData);
            
            if (createResponse.data.code !== 200) {
                throw new Error(`API Error: ${createResponse.data.message} (Code: ${createResponse.data.code})`);
            }

            if (!createResponse.data.data || !createResponse.data.data.task_id) {
                throw new Error('Invalid response format: missing task_id');
            }

            taskId = createResponse.data.data.task_id;
            console.log(`✅ Task created successfully. Task ID: ${taskId}`);

            // Step 2: Poll for task completion
            console.log('⏳ Waiting for image generation to complete...');
            const result = await this.pollForCompletion(taskId);
            
            return {
                success: true,
                taskId: taskId,
                imageUrls: result.imageUrls,
                metadata: result.metadata
            };

        } catch (error) {
            const errorDetails = this.getErrorDetails(error, taskId);
            console.error('❌ Error details:', errorDetails);
            
            return {
                success: false,
                taskId: taskId,
                error: errorDetails.message,
                details: errorDetails.details,
                statusCode: errorDetails.statusCode,
                responseData: errorDetails.responseData
            };
        }
    }

    validateInputs(prompt, imageUrls, numImages, outputFormat) {
        if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
            throw new Error('Prompt is required and must be a non-empty string');
        }

        if (imageUrls && !Array.isArray(imageUrls)) {
            throw new Error('Image URLs must be provided as an array');
        }

        if (numImages < 1 || numImages > 4) {
            throw new Error(`Number of images must be between 1 and 4, got: ${numImages}`);
        }

        const validFormats = ['jpeg', 'png'];
        if (!validFormats.includes(outputFormat)) {
            throw new Error(`Output format must be one of: ${validFormats.join(', ')}, got: ${outputFormat}`);
        }
    }

    async pollForCompletion(taskId, maxAttempts = 40, delayMs = 2000) {
        let lastStatus = '';
        
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                const response = await this.client.get(`/task/${taskId}`);
                
                if (response.data.code !== 200) {
                    throw new Error(`Status check failed: ${response.data.message} (Code: ${response.data.code})`);
                }

                const taskData = response.data.data;
                const status = taskData.status || taskData.task_status;
                lastStatus = status;

                console.log(`🔄 Attempt ${attempt}/${maxAttempts}: Status - ${status}`);

                // Handle different status cases
                switch (status) {
                    case 'success':
                    case 'Completed':
                    case 'completed':
                        return this.handleSuccessResponse(taskData);
                        
                    case 'failed':
                    case 'Failed':
                        throw this.handleFailedResponse(taskData);
                        
                    case 'processing':
                    case 'Processing':
                    case 'pending':
                    case 'Pending':
                    case 'starting':
                    case 'Starting':
                    case 'staged':
                    case 'Staged':
                        // Continue polling
                        break;
                        
                    default:
                        console.warn(`Unknown status: ${status}, continuing to poll...`);
                }

                // Wait before next poll
                await new Promise(resolve => setTimeout(resolve, delayMs));

            } catch (error) {
                if (error.response?.status === 404 && attempt < 5) {
                    // Task might not be immediately available in the system
                    console.log(`Task not found yet (attempt ${attempt}), retrying...`);
                    await new Promise(resolve => setTimeout(resolve, delayMs));
                    continue;
                }
                throw error;
            }
        }

        throw new Error(`Task did not complete within ${maxAttempts * delayMs / 1000} seconds. Last status: ${lastStatus}`);
    }

    handleSuccessResponse(taskData) {
        const output = taskData.output || taskData.task_output;
        const meta = taskData.meta || {};
        
        if (!output) {
            throw new Error('Success status but no output data found');
        }

        let imageUrls = output.image_urls || [];
        
        // Handle single image response format
        if (output.image_url && !imageUrls.length) {
            imageUrls = [output.image_url];
        }

        if (!imageUrls.length) {
            throw new Error('Success status but no image URLs found');
        }

        console.log('🎉 Image generation completed successfully!');
        
        return {
            imageUrls: imageUrls,
            metadata: {
                createdAt: meta.created_at,
                startedAt: meta.started_at,
                endedAt: meta.ended_at,
                model: taskData.model,
                taskType: taskData.task_type,
                usage: meta.usage
            }
        };
    }

    handleFailedResponse(taskData) {
        const error = taskData.error || {};
        const errorMessages = taskData.error_messages || [];
        const logs = taskData.logs || [];
        
        let errorMessage = 'Task failed';
        
        if (error.message) {
            errorMessage += `: ${error.message}`;
        } else if (errorMessages.length > 0) {
            errorMessage += `: ${errorMessages.join(', ')}`;
        }
        
        if (error.code) {
            errorMessage += ` (Error Code: ${error.code})`;
        }

        const detailedError = new Error(errorMessage);
        detailedError.details = {
            errorCode: error.code,
            rawMessage: error.raw_message,
            errorDetail: error.detail,
            logs: logs,
            taskInput: taskData.input
        };

        return detailedError;
    }

    getErrorDetails(error, taskId) {
        let details = {
            message: error.message,
            taskId: taskId,
            timestamp: new Date().toISOString()
        };

        // Axios response error
        if (error.response) {
            details.statusCode = error.response.status;
            details.statusText = error.response.statusText;
            details.responseData = error.response.data;
            details.responseHeaders = error.response.headers;
        }
        
        // Axios request error (no response received)
        else if (error.request) {
            details.requestError = 'No response received from server';
            details.requestConfig = {
                url: error.config?.url,
                method: error.config?.method,
                timeout: error.config?.timeout
            };
        }
        
        // Network errors
        else if (error.code) {
            details.errorCode = error.code;
        }

        // Add stack trace for debugging
        details.stack = error.stack;

        return details;
    }

    // Utility method to get task status without polling
    async getTaskStatus(taskId) {
        try {
            const response = await this.client.get(`/task/${taskId}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.getErrorDetails(error, taskId)
            };
        }
    }
}

export default function ImageGenerator() {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [numImages, setNumImages] = useState(1);
  const [outputFormat, setOutputFormat] = useState('jpeg');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError('');

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `public/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('fgfg') // Make sure you have a bucket named 'images' in Supabase
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('fgfg')
          .getPublicUrl(filePath);

        return {
          name: file.name,
          url: publicUrl,
          path: filePath
        };
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      setUploadedImages([...uploadedImages, ...uploadedFiles]);
    } catch (err) {
      setError('Failed to upload images: ' + err.message);
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = async (index) => {
    const imageToRemove = uploadedImages[index];
    
    try {
      const { error } = await supabase.storage
        .from('fgfg')
        .remove([imageToRemove.path]);
      
      if (error) throw error;
      
      const newImages = [...uploadedImages];
      newImages.splice(index, 1);
      setUploadedImages(newImages);
    } catch (err) {
      setError('Failed to remove image: ' + err.message);
      console.error(err);
    }
  };

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    if (uploadedImages.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedImages([]);

    try {
      const apiKey = process.env.NEXT_PUBLIC_PIAPI_API_KEY;
      const client = new PiAPIClient(apiKey);
      
      const imageUrls = uploadedImages.map(img => img.url);
      
      const result = await client.generateImage(
        prompt,
        imageUrls,
        numImages,
        outputFormat
      );

      if (result.success) {
        setGeneratedImages(result.imageUrls);
      } else {
        setError(result.error || 'Failed to generate image');
        console.error('Generation error:', result);
      }
    } catch (err) {
      setError('An unexpected error occurred: ' + err.message);
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container">
      <h1>AI Image Generator</h1>
      
      {/* Image Upload Section */}
      <div className="section">
        <h2>Upload Images</h2>
        <input
          type="file"
          ref={fileInputRef}
          multiple
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
        <button 
          onClick={() => fileInputRef.current.click()}
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Select Images'}
        </button>
        
        <div className="image-grid">
          {uploadedImages.map((image, index) => (
            <div key={index} className="image-item">
              <img src={image.url} alt={image.name} />
              <button onClick={() => removeImage(index)}>Remove</button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Prompt Section */}
      <div className="section">
        <h2>Prompt</h2>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what you want to generate..."
          rows={4}
        />
      </div>
      
      {/* Settings Section */}
      <div className="section">
        <h2>Generation Settings</h2>
        <div className="settings">
          <label>
            Number of images:
            <input
              type="number"
              min="1"
              max="4"
              value={numImages}
              onChange={(e) => setNumImages(parseInt(e.target.value))}
            />
          </label>
          
          <label>
            Output format:
            <select
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
            >
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
            </select>
          </label>
        </div>
      </div>
      
      {/* Generate Button */}
      <div className="section">
        <button 
          onClick={generateImage}
          disabled={isGenerating || uploadedImages.length === 0}
        >
          {isGenerating ? 'Generating...' : 'Generate Image'}
        </button>
      </div>
      
      {/* Error Display */}
      {error && (
        <div className="error">
          {error}
        </div>
      )}
      
      {/* Results Section */}
      {generatedImages.length > 0 && (
        <div className="section">
          <h2>Generated Images</h2>
          <div className="image-grid">
            {generatedImages.map((url, index) => (
              <div key={index} className="image-item">
                <img src={url} alt={`Generated ${index + 1}`} />
                <a href={url} download={`generated-${index + 1}.${outputFormat}`}>
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: sans-serif;
        }
        
        .section {
          margin-bottom: 30px;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
        }
        
        h1, h2 {
          color: #333;
        }
        
        textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-family: inherit;
        }
        
        .settings {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }
        
        .settings label {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        
        .image-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }
        
        .image-item {
          display: flex;
          flex-direction: column;
          gap: 10px;
          border: 1px solid #eee;
          padding: 10px;
          border-radius: 4px;
        }
        
        .image-item img {
          width: 100%;
          height: 150px;
          object-fit: cover;
          border-radius: 4px;
        }
        
        button {
          padding: 10px 15px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }
        
        button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
        
        .error {
          color: #d32f2f;
          padding: 10px;
          background-color: #ffebee;
          border-radius: 4px;
          margin: 10px 0;
        }
      `}</style>
    </div>
  );
}