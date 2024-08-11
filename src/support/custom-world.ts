import { setWorldConstructor, World, IWorldOptions } from "@cucumber/cucumber";
import * as messages from "@cucumber/messages";
import {
  BrowserContext,
  Page,
  PlaywrightTestOptions,
  APIRequestContext,
} from "@playwright/test";

import { Helper } from "../utils/Helper";
import { Logger } from "../utils/Logger";
import { LocatorHelper } from "../utils/LocatorHelper";

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

  server?: APIRequestContext;

  playwrightOptions?: PlaywrightTestOptions;
  sharedData?: { [key: string]: any }; // Shared data object

  helper?: Helper;
  logger?: Logger;
  locatorHelper?: LocatorHelper;
}

export class CustomWorld extends World implements ICustomWorld {
  constructor(options: IWorldOptions) {
    super(options);
  }
  debug = false;
  sharedData = {}; // Initialize shared data object
  page?: Page;
  helper = new Helper();
  logger = new Logger();
  locatorHelper = new LocatorHelper(this.page);
}

setWorldConstructor(CustomWorld);
