import { passages, type Reply } from './assistant';

type Extractor = (text: string | string[], options: { pooling: 'mean'; normalize: boolean }) => Promise<{ tolist: () => number[][] }>;

interface TransformersModule {
  pipeline: (task: string, model: string, options?: Record<string, unknown>) => Promise<unknown>;
  env: { allowLocalModels: boolean };
}

const CDN = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.1';

let vectors: number[][] | null = null;
let extractor: Extractor | null = null;
let loading: Promise<boolean> | null = null;

const cosine = (a: number[], b: number[]) => a.reduce((sum, value, index) => sum + value * b[index], 0);

export function loadModel(onProgress?: (status: string) => void): Promise<boolean> {
  if (loading) return loading;
  loading = (async () => {
    try {
      onProgress?.('loading');
      const { pipeline, env } = (await import(/* @vite-ignore */ CDN)) as TransformersModule;
      env.allowLocalModels = false;
      extractor = (await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', { dtype: 'q8' })) as Extractor;
      const output = await extractor(passages.map(passage => passage.text), { pooling: 'mean', normalize: true });
      vectors = output.tolist();
      onProgress?.('ready');
      return true;
    } catch (error) {
      console.error('Local model unavailable, using keyword search:', error);
      onProgress?.('failed');
      extractor = null;
      vectors = null;
      return false;
    }
  })();
  return loading;
}

export const modelReady = () => Boolean(extractor && vectors);

export async function semanticAsk(question: string): Promise<Reply | null> {
  if (!extractor || !vectors) return null;
  try {
    const output = await extractor(question, { pooling: 'mean', normalize: true });
    const query = output.tolist()[0];
    let bestIndex = -1;
    let bestScore = -1;
    vectors.forEach((vector, index) => {
      const score = cosine(query, vector);
      if (score > bestScore) { bestScore = score; bestIndex = index; }
    });
    if (bestIndex < 0 || bestScore < 0.3) return null;
    const match = passages[bestIndex];
    return { html: match.answer, label: match.label, confident: bestScore > 0.45, follow: match.follow };
  } catch (error) {
    console.error('Semantic search failed, using keyword search:', error);
    return null;
  }
}
