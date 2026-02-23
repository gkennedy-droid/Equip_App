export default function LoginPage() {
  return (
    <form className="card" method="post" action="/api/auth/login">
      <h2>Login</h2>
      <label>Email<input name="email" type="email" required /></label>
      <label>Password<input name="password" type="password" required /></label>
      <button type="submit">Sign In</button>
    </form>
  );
}
