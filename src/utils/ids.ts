import { customAlphabet, nanoid } from "nanoid";

export const createPollID = customAlphabet(
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    6,
);

export const createUserID = () => nanoid();
export const createNominationID = () => nanoid(8);
// import('nanoid').then(({ customAlphabet, nanoid }) => {
//     export const createPollID = customAlphabet(
//         '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
//         6,
//     );
    
//     export const createUserID = () => nanoid();
//     export const createNominationID = () => nanoid(8);
//   });
  