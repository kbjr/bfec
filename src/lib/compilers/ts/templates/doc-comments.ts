
export const doc_comments_template = (comments: string[], indent = '') => `
/**
${indent} * ${comments.join(`\n${indent} * `)}
${indent} */`;
