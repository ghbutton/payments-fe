import Api from './Api';

const Utils = {
  createSessionAndToken: async (email, password) => {
    const session = await Api.createSession(email, password);
    if (session && session.data && session.data.attributes) {
      await DiskStore.setData("session", session);

      return Utils.createTokenFromSession(session);
    }
  },
  createTokenFromSession: async (session) => {
    const token = await Api.createToken(session.data.id, session.data.attributes.secret, Math.floor(Date.now() / 1000));
    if (token && token.data && token.data.attributes) {
      await DiskStore.setData("sessionToken", token.data.attributes.token);
      return token.data.attributes.token
    }
  },
}

export default Utils;
