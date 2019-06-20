class IModelBankAuthorizationClient {
    constructor(jsonObj) {
        this._userInfo = UserInfo.fromJson(jsonObj);
        this.hasSignedIn = true;//this is cheating
    }
    async getAccessToken(_requestContext) {
        const userInfo = this._userInfo;
        const foreignAccessTokenWrapper = {};
        foreignAccessTokenWrapper[AccessToken.foreignProjectAccessTokenJsonProperty] = { userInfo };
        const accessToken = AccessToken.fromForeignProjectAccessTokenJson(JSON.stringify(foreignAccessTokenWrapper));
        return accessToken;
    }
}

