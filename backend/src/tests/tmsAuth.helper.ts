import TmsAuth from '../tms/tmsAuth.model';

const seedTmsAuth = async () => {
  const tmsAuth = new TmsAuth({
    _aid: '_aid',
    _rid: '_rid',
    xsrfToken: 'xsrfToken',
    clientId: 'clientId',
    userId: 'userId',
    userName: 'userName',
  });

  const newTmsAuth = await tmsAuth.save();
  return newTmsAuth;
};

export { seedTmsAuth };
