// react-native-appwrite.d.ts
declare module "react-native-appwrite" {
  export * from "appwrite";

  import { Client as AppwriteClient } from "appwrite";

  export interface ClientInterface extends AppwriteClient {
    setPlatform(platform: string): this;
  }

  export class Client extends AppwriteClient implements ClientInterface {
    /**
     * Set Project Platform
     *
     * Your platform name
     *
     * @param platform string
     *
     * @return {this}
     */
    setPlatform(platform: string): this {
      return this;
    }
  }
}
