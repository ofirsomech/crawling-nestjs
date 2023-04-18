import * as bcrypt from 'bcryptjs';

export const BcryptSupport = {
  async generate(plainText: string, saltRounds: number): Promise<string> {
    return bcrypt.hash(plainText, saltRounds);
  },

  async compare(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  },
};
