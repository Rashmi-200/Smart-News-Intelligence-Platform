const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

(async () => {
  try {
    const register = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      JSON.stringify({ name: 'Test User', email: 'test@example.com', password: 'Test1234!' })
    );
    console.log('Register response:', register);

    const login = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      JSON.stringify({ email: 'test@example.com', password: 'Test1234!' })
    );
    console.log('Login response:', login);

    const token = JSON.parse(login.body).token;
    const me = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/me',
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      },
      null
    );
    console.log('Me response:', me);
  } catch (err) {
    console.error('Error during test requests:', err);
  }
})();
