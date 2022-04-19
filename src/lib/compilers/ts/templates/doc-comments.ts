
export const doc_comments_template = (comments: string[], indent = '') => `
${indent}/**
${indent}${comments.join(`\n${indent}`)}
${indent}*/`;
