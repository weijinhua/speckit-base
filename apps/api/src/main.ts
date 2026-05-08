import Fastify from "fastify";

async function main() {
  const app = Fastify({ logger: true });

  app.get("/health", async (_request, reply) => {
    return reply.type("text/plain").send("OK");
  });

  const port = Number(process.env.PORT ?? 3001);
  const host = process.env.HOST ?? "0.0.0.0";

  await app.listen({ port, host });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
