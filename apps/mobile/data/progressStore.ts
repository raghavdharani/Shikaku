import AsyncStorage from '@react-native-async-storage/async-storage';
import { SessionStats } from './sessionStore';

export type Difficulty = 'beginner' | 'intermediate' | 'expert';

export interface ProgressState {
    currentDifficulty: Difficulty;
    puzzleIndex: Record<Difficulty, number>;
    solvedCount: Record<Difficulty, number>;
    totalStats: SessionStats;
}

const STORAGE_KEY = '@shikaku_progress';

const DEFAULT_STATE: ProgressState = {
    currentDifficulty: 'beginner',
    puzzleIndex: {
        beginner: 0,
        intermediate: 0,
        expert: 0,
    },
    solvedCount: {
        beginner: 0,
        intermediate: 0,
        expert: 0,
    },
    totalStats: {
        puzzlesSolved: 0,
        placementsMade: 0,
        undosMade: 0,
    }
};

let internalProgress: ProgressState = { ...DEFAULT_STATE };

export const loadProgress = async (): Promise<ProgressState> => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        if (data) {
            internalProgress = JSON.parse(data);
        }
    } catch (e) {
        console.error('Failed to load progress', e);
    }
    return internalProgress;
};

export const saveProgress = async () => {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(internalProgress));
    } catch (e) {
        console.error('Failed to save progress', e);
    }
};

export const getProgressSync = (): ProgressState => internalProgress;

export const setDifficulty = async (difficulty: Difficulty) => {
    internalProgress.currentDifficulty = difficulty;
    await saveProgress();
};

export const advanceProgress = async (difficulty: Difficulty) => {
    internalProgress.puzzleIndex[difficulty] += 1;
    internalProgress.solvedCount[difficulty] += 1;
    internalProgress.totalStats.puzzlesSolved += 1;
    await saveProgress();
};

export const updateStats = async (placements: number) => {
    internalProgress.totalStats.placementsMade += placements;
    await saveProgress();
};

export const resetProgress = async () => {
    internalProgress = { ...DEFAULT_STATE };
    await saveProgress();
};
