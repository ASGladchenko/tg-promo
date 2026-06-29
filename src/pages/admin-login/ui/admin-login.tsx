import "./admin-login.scss";

export function AdminLogin() {
  return (
    <div className="admin-login" aria-label="Admin login">
      <div className="admin-login__wrapper">
        <h4 className="admin-login__title">Crack Safe</h4>
        <p className="admin-login__description">Please log in to your account</p>

        <form className="admin-login__form">
          <div className="admin-login__form-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" />
          </div>
        </form>
      </div>
    </div>
  );
}
