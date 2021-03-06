import { ExecutionContext, HttpException, HttpStatus } from '@nestjs/common'

export function badRequest(message: string) {
  return new HttpException(message, HttpStatus.BAD_GATEWAY)
}

export function notFound(message: string) {
  return new HttpException(message, HttpStatus.NOT_FOUND)
}

export interface Response<T> {
  data: T
  message: string
  code: number
  metadata: any
}

export type APIResponse<T> = Promise<Response<T>>

export async function response<T>(
  data: T | Promise<T>,
  {
    message = 'OK',
    metadata = null,
    code = 200,
  }: { message?: string; metadata?: any; code?: number } = {},
): Promise<Response<T>> {
  const resolvedData = await Promise.resolve(data)
  return { data: resolvedData, message, code, metadata }
}

export function headers(
  context: ExecutionContext,
  key: string,
): string | undefined {
  const headers = context.switchToHttp().getRequest().headers
  return headers[key]
}
