
export const doc_comments_template = (comments: string[], indent = '') => `/**\n${indent}${comments.join(`\n${indent}`)}\n${indent}*/`;
