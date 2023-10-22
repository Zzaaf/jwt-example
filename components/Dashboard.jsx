const React = require('react');
const PropTypes = require('prop-types');

// компоненты
const Header = require('./Header');
const Footer = require('./Footer');
const Layout = require('./Layout');

function Dashboard({ title, name }) {
  return (
    <Layout title={title}>
      <Header name={name} />

      <main className="flex-shrink-0">
        <div className="container">
          <h1 className="mt-5">
            Hello,
            {' '}
            {name}
            !
          </h1>
          <p className="lead">Welcome to your Dashboard</p>

        </div>
      </main>

      <Footer />
    </Layout>
  );
}

// PropTypes
Dashboard.propTypes = {
  title: PropTypes.string.isRequired,
  // user: PropTypes.shape({ user: PropTypes.string }).isRequired,
  name: PropTypes.string.isRequired,
};

module.exports = Dashboard;
