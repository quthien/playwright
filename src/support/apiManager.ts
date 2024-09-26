import { request, APIRequestContext } from "@playwright/test";

export enum APIHost {
  Host1 = "Host1",
  Host2 = "Host2",
}

export class APIManager {
  initialized: boolean = false;
  private contexts: { [key in APIHost]?: APIRequestContext } = {};

  // Initialize the API context
  async initContext(name: APIHost, baseURL: string): Promise<void> {
    if (this.contexts[name]) {
      await this.contexts[name]?.dispose(); // Dispose of the existing context if needed
    }
    this.contexts[name] = await request.newContext({ baseURL });
    this.initialized = true;
  }

  // Get the context by api host name
  getContext(name: APIHost): APIRequestContext {
    if (!this.initialized) {
      throw new Error(`APIManager not initialized`);
    }
    const context = this.contexts[name];
    if (!context) {
      throw new Error(`API context '${name}' not found`);
    }
    return context;
  }

  // Close all contexts
  async closeAllContexts(): Promise<void> {
    for (const context of Object.values(this.contexts)) {
      try {
        await context?.dispose();
      } catch (error) {
        console.error(`Error disposing context: ${error}`);
      }
    }
  }
}
