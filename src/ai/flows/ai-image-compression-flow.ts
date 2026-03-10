'use server';
/**
 * @fileOverview A Genkit flow for intelligent image compression using AI.
 *
 * - aiImageCompression - A function that handles the AI-powered image compression process.
 * - AiImageCompressionInput - The input type for the aiImageCompression function.
 * - AiImageCompressionOutput - The return type for the aiImageCompression function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const AiImageCompressionInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "The image to be compressed, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  qualityLevel: z
    .enum(['low', 'medium', 'high', 'maximum'])
    .describe(
      'The desired compression quality level, influencing the balance between file size and visual fidelity.'
    ),
});
export type AiImageCompressionInput = z.infer<typeof AiImageCompressionInputSchema>;

const AiImageCompressionOutputSchema = z.object({
  compressedImageDataUri: z
    .string()
    .describe(
      "The intelligently compressed image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  compressionDetails: z
    .string()
    .describe('A brief description of the compression applied and any notable changes made by the AI.'),
});
export type AiImageCompressionOutput = z.infer<typeof AiImageCompressionOutputSchema>;

export async function aiImageCompression(
  input: AiImageCompressionInput
): Promise<AiImageCompressionOutput> {
  return aiImageCompressionFlow(input);
}

// This prompt is primarily for documentation and Genkit UI. The actual multimodal prompt
// is constructed directly within the ai.generate call in the flow.
const compressImagePrompt = ai.definePrompt({
  name: 'compressImagePrompt',
  input: { schema: AiImageCompressionInputSchema },
  output: { schema: AiImageCompressionOutputSchema },
  prompt: `You are an expert image compression AI.
Given an image and a desired compression quality level (low, medium, high, maximum), your task is to intelligently re-generate the image to reduce its file size while preserving as much visual quality as possible.
After generating the compressed image, you must provide a brief, concise description (max 2-3 sentences) detailing the compression applied, how the quality level was interpreted, and any noticeable visual changes or optimizations made to achieve the file size reduction.`,
});

const aiImageCompressionFlow = ai.defineFlow(
  {
    name: 'aiImageCompressionFlow',
    inputSchema: AiImageCompressionInputSchema,
    outputSchema: AiImageCompressionOutputSchema,
  },
  async (input) => {
    const { imageDataUri, qualityLevel } = input;

    const { media, output } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-image'),
      prompt: [
        { media: { url: imageDataUri } },
        {
          text: `Intelligently compress this image to reduce file size while maintaining visual quality. Aim for a "${qualityLevel}" compression level. Describe the compression applied and any visual changes, focusing on how quality was balanced with file size reduction.`,
        },
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media || !media.url) {
      throw new Error('Failed to get compressed image data from AI model.');
    }
    if (!output) {
      throw new Error('Failed to get compression details from AI model.');
    }

    return {
      compressedImageDataUri: media.url,
      compressionDetails: output,
    };
  }
);
