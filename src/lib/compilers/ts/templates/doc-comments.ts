
export const doc_comments_template = (comments: string[], indent = '') => `
/**
${comments.join(`\n${indent} * `)}
*/`;
