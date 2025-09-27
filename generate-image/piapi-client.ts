const axios = require('axios');

export class PiAPIClient {
    private apiKey: string;
    private baseURL: string;
    private client: any;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.baseURL = 'https://api.piapi.ai/api/v1';
        this.client = axios.create({
            baseURL: this.baseURL,
            headers: {
                'X-API-Key': apiKey,
                'Content-Type': 'application/json'
            },
            timeout: 30000
        });
    }

    async generateImage(prompt: string, imageUrls: string[] = [], numImages: number = 1, outputFormat: string = 'jpeg') {
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

    private validateInputs(prompt: string, imageUrls: string[], numImages: number, outputFormat: string) {
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

    private async pollForCompletion(taskId: string, maxAttempts: number = 40, delayMs: number = 2000) {
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

    private handleSuccessResponse(taskData: any) {
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

    private handleFailedResponse(taskData: any) {
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

    private getErrorDetails(error: any, taskId: string | null) {
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
}