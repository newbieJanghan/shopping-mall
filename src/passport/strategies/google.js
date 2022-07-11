import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import bcrypt from 'bcrypt';
import { User } from '../../db';

// 구글 OAuth 설정
const config = {
  clientID: process.env.GOOGLE_OAUTH_ID,
  clientSecret: process.env.GOOGLE_OAUTH_SECRET,
  callbackURL: '/auth/google/callback',
};

async function findOrCreateUser({ email, name }) {
  const user = await User.findOne({
    email,
  });

  // user가 있으면 user 리턴
  if (user) {
    return user;
  }

  // 없으면 user 생성
  const hashedPassword = await bcrypt.hash('google', 10); // 비밀번호 해쉬화
  const createdNewUser = await User.create({
    fullName: name,
    email,
    password: hashedPassword,
  });
  return createdNewUser;
}

export default new GoogleStrategy.Strategy(
  config,
  async (a, b, profile, done) => {
    const { email, name } = profile._json;

    try {
      const user = await findOrCreateUser({ email, name });
      done(null, {
        _id: user._id,
        email: user.email,
        name: user.name,
      });
    } catch (e) {
      done(e, null);
    }
  },
);
