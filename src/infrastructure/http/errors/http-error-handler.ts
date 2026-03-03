import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "../../../domain/errors/app-error.js";

export function handleError(
  error: FastifyError | Error,
  _request: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      error: error.message,
      statusCode: error.statusCode,
    });
  }

  const statusCode = (error as FastifyError).statusCode ?? 500;
  return reply.status(statusCode).send({
    error: error.message || "Internal server error",
    statusCode,
  });
}
