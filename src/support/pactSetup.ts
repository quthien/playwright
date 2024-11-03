import path from "path";
import { Pact } from "@pact-foundation/pact";

export const provider = new Pact({
  consumer: "Consumer",
  provider: "Provider",
  port: 1234,
  log: path.resolve(process.cwd(), "logs", "pact.log"),
  dir: path.resolve(process.cwd(), "pacts"),
  logLevel: "debug",
});

export const setupProvider = async (): Promise<void> => {
  await provider.setup(); // Start the mock server once
};

export const finalizeProvider = async (): Promise<void> => {
  await provider.verify(); // Verifies all interactions were called
  await provider.finalize(); // Writes the pact file
};
