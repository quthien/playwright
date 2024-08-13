import { setWorldConstructor, World, IWorldOptions } from "@cucumber/cucumber";
import * as messages from "@cucumber/messages";
import {
  BrowserContext,
  Page,
  PlaywrightTestOptions,
  APIRequestContext,
} from "@playwright/test";

import { HomePO } from "../pages/HomePO";
import { Helper } from "../utils/Helper";
import { APIManager } from "./APIManager";

export interface CucumberWorldConstructorParams {
  parameters: { [key: string]: string };
}

export interface ICustomWorld extends World {
  debug: boolean;
  feature?: messages.Pickle;
  context?: BrowserContext;
  page?: Page;

  testName?: string;
  startTime?: Date;

  apiManager?: APIManager;

  playwrightOptions?: PlaywrightTestOptions;
  sharedData?: { [key: string]: any }; // Shared data object

  helper?: Helper;
}

export class CustomWorld extends World implements ICustomWorld {
  constructor(options: IWorldOptions) {
    super(options);
  }
  debug = false;
  sharedData = {}; // Initialize shared data object
  page?: Page;
  helper = new Helper();
  apiManager = new APIManager();
}

setWorldConstructor(CustomWorld);
