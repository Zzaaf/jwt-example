/* eslint-disable react/prop-types */
const React = require('react');
const PropTypes = require('prop-types');

// компоненты
const Header = require('./Header');
const Footer = require('./Footer');
const Layout = require('./Layout');

function Profile({ user, title, email }) {
  return (
    <Layout title={title}>
      <Header name={user.name} />

      <main className="flex-shrink-0">
        <div className="container">
          <div className="card" style={{ width: '18rem' }}>
            <i className="bi bi-person-bounding-box profile-avatar" />
            <div className="card-body">
              <h5 className="card-title">
                User name:
                {' '}
                {user.name}
              </h5>
              <p className="card-text">
                Email:
                {' '}
                <a href={`mailto:${email}`} className="card-text">{email}</a>
              </p>
            </div>

            <div className="card-body d-flex justify-content-around">
              <a href={`/users/${user.id}`} className="btn btn-primary">Edit profile</a>
              <button id="deleteBtn" type="button" data-url={`/api/users/${user.id}`} className="btn btn-danger">Delete profile</button>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </Layout>
  );
}

// PropTypes
Profile.propTypes = {
  title: PropTypes.string.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string,
    id: PropTypes.number,
    email: PropTypes.string,
  }).isRequired,
};

module.exports = Profile;
