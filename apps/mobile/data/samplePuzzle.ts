import { Board } from '@shikaku/engine';
import minimal2x2 from '../../../spec/fixtures/valid/minimal-2x2.json';

export const getSampleBoard = (): Board => {
    return minimal2x2.board as Board;
};
