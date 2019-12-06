import { UserInfo, AccessToken } from "@bentley/imodeljs-clients";

export class IModelBankAuthorizationClient {
  constructor(jsonObj) {
    this._userInfo = UserInfo.fromJson(jsonObj);
    this.isAuthorized = true;
    this.hasExpired = true;
    this.hasSignedIn = true;
  }

  async getAccessToken() {
    const userInfo = this._userInfo;

    const foreignAccessTokenWrapper = {};

    foreignAccessTokenWrapper[
      AccessToken.foreignProjectAccessTokenJsonProperty
    ] = { userInfo };

    const accessToken = AccessToken.fromForeignProjectAccessTokenJson(
      JSON.stringify(foreignAccessTokenWrapper)
    );

    return accessToken;
  }
}
