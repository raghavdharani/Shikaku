import { Board, GameState, createGameState, placeRectangle } from '@shikaku/engine';
import minimal2x2 from '../../../spec/fixtures/valid/minimal-2x2.json';

export const getSampleBoard = (): Board => {
    return minimal2x2.board as Board;
};

export const getSampleGameState = (): GameState => {
    let state = createGameState(getSampleBoard());
    // Place one sample rectangle
    state = placeRectangle(state, { id: 'sample-1', x: 0, y: 0, width: 2, height: 1 });
    return state;
};
