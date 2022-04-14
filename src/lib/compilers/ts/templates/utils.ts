
export const utils_template = () => `
export { $BufferReader } from './buffer-reader';
export { $BufferWriter } from './buffer-writer';

export const $encode = Symbol('$encode');
export const $decode = Symbol('$decode');
`;
