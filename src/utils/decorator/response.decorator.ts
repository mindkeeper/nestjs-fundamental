import { SetMetadata } from '@nestjs/common';

export const ResponseMessageKey = 'responseMessage';
export const ResponseMessage = (message: string) =>
  SetMetadata(ResponseMessageKey, message);
