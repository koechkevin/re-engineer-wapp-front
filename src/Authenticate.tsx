import React, {FC, useCallback, useEffect} from 'react';
import { GoogleLogin } from 'react-google-login';
import style from './App.module.scss';
import axios from 'axios';

const styles = {
  styles: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};
export const CLIENT_ID = 'client-id';

const Authenticate: FC<any> = (props) => {
  const { setIsLoggedIn } = props;
  const searchParams = new URLSearchParams(window.location.search);
  const provider: string | null = searchParams.get('provider');
  const code: string | null = searchParams.get('code');
  const raw: string | null = window.location.hash?.split('access_token=')[1];
  const token = raw && raw.split('&')[0];

  const setId = useCallback((value: string) => {
    localStorage.setItem(CLIENT_ID, value);
    setIsLoggedIn(true);
  }, [setIsLoggedIn]);

  useEffect(() => {
    if (provider && (code || token)) {
      if (provider === 'facebook') {
        axios
          .get(`https://graph.facebook.com/me`, {
            params: { access_token: token, scope: 'email' },
          })
          .then((res) => {
            setId(res.data.id);
          });
      }
    }
    if (provider === 'github') {
      axios
        .post(
          `/github/login/oauth/access_token?code=${code}&redirect_uri=${window.location.origin}&client_id=16e974e0ac7d4e33d13a&client_secret=386baf904b97bb6635819487fb05e67efcf1f4c1`,
        )
        .then((response) => {
          axios.get(`https://api.github.com/user?${response.data}`).then((res) => {
            setId(res.data.email);
          });
        });
    }
  }, [provider, code, token, setId]);

  return (
    <div style={styles.styles}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            height: 40,
            lineHeight: '40px',
            backgroundColor: '#39579a',
            marginBottom: 16,
            borderRadius: 4,
            color: '#fff',
            textAlign: 'center',
            cursor: 'pointer',
            fontWeight: 600,
            width: 308,
          }}
          onClick={() => {
            window.location.href = `https://www.facebook.com/v6.0/dialog/oauth?scope=email&client_id=659857431222983&response_type=token&redirect_uri=${window.location.origin}?provider=facebook&state={}`;
          }}
        >
          Sign in with Facebook
        </div>
        <div
          onClick={() => {
            window.location.href =
              'https://github.com/login/oauth/authorize?scope=email&client_id=16e974e0ac7d4e33d13a';
          }}
          style={{
            height: 40,
            lineHeight: '40px',
            backgroundColor: '#1a1c23',
            marginBottom: 16,
            borderRadius: 4,
            cursor: 'pointer',
            color: '#fff',
            textAlign: 'center',
            fontWeight: 600,
          }}
        >
          Sign in with Github
        </div>

        <GoogleLogin
          clientId="132789956544-5ujqfv92rqhf9vkm5a0f1n95qmbdiqnr.apps.googleusercontent.com"
          onSuccess={({profileObj}: any) => {
            setId(profileObj.email);
          }}
          onFailure={console.log}
          className={style.google}
        >
          <span
            style={{
              fontSize: 12,
              marginLeft: -10,
              fontWeight: 600,
              color: '#1d1d1d',
            }}
          >
            Sign in with Google
          </span>
        </GoogleLogin>
      </div>
    </div>
  );
};

export default Authenticate;
