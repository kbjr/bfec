
export const generator_comment_template = (quiet = false) => quiet ? '' : `
/*
 THIS FILE WAS AUTOMATICALLY GENERATED
 ${(new Date).toISOString()}
*/
`;
